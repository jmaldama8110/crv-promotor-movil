
import { IonButton, IonChip, IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup, IonRange, IonRow, IonSegment, IonSegmentButton } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";

import { Geolocation } from "@capacitor/geolocation";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useCameraTaker } from "../../hooks/useCameraTaker";
import { formatLocalCurrency } from "../../utils/numberFormatter";
import { IonButtonNext, IonButtonPrev } from "../../components/SliderButtons";
import './LoanApplicationForm.css';
import { getRound } from "../../utils/math";
import { AppContext } from "../../store/store";
import { camera } from "ionicons/icons";
import { db } from "../../db";

interface LoanApplicationFormProps extends RouteComponentProps {
    loanapp?: any;
    onSubmit: any;
}

interface TermType {
    identifier: string;
    value: string;
    year_periods: string;
}

interface LoanDestination {
    _id: number;
    description: string;
    status: boolean;
}

export const LoanApplicationForm: React.FC<LoanApplicationFormProps> = (props) => {

    const { takePhoto, pics, setPics } = useCameraTaker();

    const [ productsList, setProductList] = useState([]);  

    const [currSegment, setSegment] = useState<string>("5");
    const [apply_amount, setApplyAmount] = useState(0);
    const [lat,setLat] = useState(0);
    const [lng, setLng] = useState(0);
  
    const [minAmout, setMinAmount] = useState(1000);
    const [maxAmount, setMaxAmount] = useState(100000);
    const [stepAmount, setStepAmount] = useState(10000);

    const [minTerm, setMinTerm] = useState<number>(1);
    const [maxTerm, setMaxTerm] = useState<number>(48);
    const [term, setTerm] = useState<number>(1);
    const [termType, setTermType] = useState<string | undefined | null>("");
    
    const [tax, setTax] = useState(0);
    const [productName, setProductName] = useState('');
    const [productTermTypes, setProductTermTypes] = useState<TermType[]>([]);
    const [destinations, setDestinations] = useState<LoanDestination[]>([]);
    const [productRate, setProductRate] = useState('');

    /// Pago igual resultante
    const [paymentAmount, setPaymentAmount] = useState<string | undefined | null>("");

    useEffect( ()=>{
        db.createIndex( {
            index: { fields: [ "couchdb_type"] }
           }).then( function (){
              db.find({
                selector: {
                  couchdb_type: "PRODUCT"
                }
              }).then( (data:any) =>{
                // const newData = data.docs.map( (i:any)=>( {id: i._id, rev: i._rev, etiqueta: `${i.name} ${i.lastname} ${i.second_lastname}`} ))
                setProductList(data.docs);
            })
           })

    },[])


    useEffect( ()=>{

        if( !props.loanapp ){
                /// only when form is in new Loan app
            db.createIndex( {
                index: { fields: [ "couchdb_type"] }
            }).then( function (){
                db.find({
                    selector: {
                    couchdb_type: "LOANDEST"
                    }
                }).then( (data:any) =>{
                    /// converts from loanDestinatios Catalog to locally have an array of selected destinations and its status TRUE or FALSE
                    const newDestinationsData: LoanDestination[] = data.docs.map((i:any)=> ({ _id: i._id, description:i.descripcion, status:false  }) )
                    setDestinations(newDestinationsData);
                })
            })
            }
    },[])

    useEffect( ()=> {
        //// loads Geolocation of device
        async function loadCoordinates (){
            const coordsData = await Geolocation.getCurrentPosition();
            setLat(coordsData.coords.latitude);
            setLng(coordsData.coords.longitude);
          }
        loadCoordinates();
        
        if( props.loanapp ){
            /// si estamos editando el Loan
            if( props.loanapp.pics){
            setPics( props.loanapp.pics);
            }
            if(props.loanapp.loandests){
                setDestinations(props.loanapp.loandests);
                
            }
            
            if( props.loanapp.product){

                setSegment(props.loanapp.product.external_id);
                /// Loan Product definitions when editing the loan application
                setMinAmount(props.loanapp.product.min_amount);
                setMaxAmount(props.loanapp.product.max_amount);
                setStepAmount(props.loanapp.product.step_amount);

                setMinTerm(props.loanapp.product.min_term);
                setMaxTerm(props.loanapp.product.max_term);
                setProductName(props.loanapp.product.product_name);
                setProductTermTypes(props.loanapp.product.allowed_term_type);
                setProductRate(props.loanapp.product.rate);
                setTax(props.loanapp.product.tax);
            }
            setApplyAmount(props.loanapp.apply_amount);
            setTerm(props.loanapp.term);
            if( props.loanapp.frequency ){
                setTermType(props.loanapp.frequency[0]);
            }
        }
        
    },[props.loanapp])

    //// Actualizar la cuota cada vez que cambian algun dato

    useEffect(() => {

        const sched = [];
        const importe = apply_amount;
        const npagos = -term;
        let cuota = 0;
        let saldo = importe;
        let interes_periodo = 0;
        let capital_periodo = 0;
        let impuesto_periodo = 0;
        const iva = (1 + (tax)/100) ;
    
        const period: (TermType | undefined ) = productTermTypes.find( (i: any) => i.identifier === termType);
        
        if (period) {
          const year_rate = (parseFloat(productRate) * iva) / 100;
          const year_periods = parseFloat(period.year_periods);
          const period_rate = year_periods ? year_rate / year_periods : 0;
          
          const numerator = importe * period_rate;
          const divisor = 1 - (1 + period_rate) ** npagos;
          cuota = divisor ? numerator / divisor : 0;
          setPaymentAmount(formatLocalCurrency(cuota));
    
          /// inserta en item 0 del plan de cuotas
          sched.push({
            number: 0,
            amount: 0,
            principal: 0,
            interest: 0,
            tax: 0,
            insurance: 0,
            balance: importe
          })
          /// calcula las cuotas
          for (let i = 0; i < term; i++) {
    
            interes_periodo =  (saldo * period_rate) / iva 
            impuesto_periodo = interes_periodo * (iva - 1) 
            capital_periodo = cuota - interes_periodo - impuesto_periodo
            saldo = saldo - capital_periodo;
      
            sched.push({
              number: i,
              amount: getRound(cuota),
              principal: getRound(capital_periodo),
              interest: getRound(interes_periodo),
              tax: getRound(impuesto_periodo),
              insurance: 0,
              balance: getRound(saldo)
            });
          }
        }
    
      }, [apply_amount, term, termType]);

    const onSend = () => {
        const selectedProduct:any = productsList.find( (i:any) => i.external_id == currSegment )
        if( selectedProduct ){
            const ttypeSel = selectedProduct.allowed_term_type.find( (i:any)=> i.identifier === termType )
            const data = {
                product: selectedProduct._id,
                apply_amount,
                term,
                frequency: [ttypeSel.identifier,ttypeSel.value],
                loandests: destinations,
                pics,
                coordinates: [lat,lng],
            };
            props.onSubmit(data);
            
        }
    };

    const onChipClick = (e:any)=>{
        const itemId = e.target.id;
        /// Sets STATUS only at the selected Item of the array
        const newData:LoanDestination[] = destinations.map( (i:LoanDestination)=>(
            itemId == i._id ? 
            {   _id: i._id,
                description: i.description,
                status: !(i.status)
            } : i
        ))
        setDestinations(newData);
    }

    useEffect( ()=>{

        if( currSegment ){
            const selectedProduct:any = productsList.find( (i:any) => i.external_id == currSegment )
            if( selectedProduct ){
                setMinAmount(selectedProduct.min_amount);
                setMaxAmount(selectedProduct.max_amount);
                setStepAmount(selectedProduct.step_amount);

                setMinTerm(selectedProduct.min_term);
                setMaxTerm(selectedProduct.max_term);
                setProductName(selectedProduct.product_name);
                setProductTermTypes(selectedProduct.allowed_term_type);
                setProductRate(selectedProduct.rate);
                setTax(selectedProduct.tax);
            }
        }

    },[currSegment]);

    const onPhotoTitleUpdate = (e:any) =>{
        const itemPosition = pics.length - 1;
        const newData = pics.map( (i:any,n)=>( itemPosition == n  ? { base64str: i.base64str,title: e.target.value } : i ) );
        setPics([...newData]);
    }

    return(

        <Swiper spaceBetween={50} slidesPerView={1} allowTouchMove={false}>
            
            { !props.loanapp && 
            <SwiperSlide>
                <IonList className="ion-padding">
                    <div className="contenido-loanform">
                        <IonSegment
                            value={currSegment}
                            onIonChange={(e) => setSegment(e.detail.value!)}
                            >
                        {
                            productsList.map( (i:any)=>(
                                <IonSegmentButton key={i._id} value={i.external_id}>
                                    <IonLabel>{i.product_name.substring(0,10)}</IonLabel>
                                </IonSegmentButton>
                            ))
                        }
                        </IonSegment>                        
                        { currSegment === "5" && /// Tu Negocio
                            <div>
                                <div className="texto-centrado">
                                    <h1 className="clr-tnc">TU NEGOCIO CON CONSERVA</h1>
                                </div>
                                <div>
                                    <ul className="fuente-md">
                                        <li>Desde 10,000 hasta 150,000 pesos</li>
                                        <li>Plazo de 12 a 48 meses </li>
                                        <li>Pagos Quincenales o Mensuales</li>
                                        <li>Sin Comisiones</li>
                                        <li>Contratacion de Seguro deudor</li>
                                    </ul>
                                </div>
                                <div className="texto-centrado">
                                    <h1>Requisitos</h1>
                                </div>
                                <div>
                                    <ul className="fuente-md">
                                        <li>Identificacion oficial vigente</li>
                                        <li>Comprobante de domicilio actualizado</li>
                                        <li>Ser empleado</li>
                                        <li>Avales</li>
                                        <li>Referencias personales</li>
                                        <li>Contratacion de Seguro deudor</li>
                                    </ul>
                                </div>     

                            </div>
                        
                        }
                        { currSegment === "12" && /// Tu Hogar
                            <div>
                                <div className="texto-centrado">
                                    <h1 className="clr-tuhogar">TU HOGAR CON CONSERVA</h1>
                                </div>
                                <div>
                                    <ul className="fuente-md">
                                        <li>Desde 25,000 hasta 200,000 pesos</li>
                                        <li>Plazo de 6 a 24 meses</li>
                                        <li>Pagos Quincenales o Mensuales</li>
                                        <li>Sin Comisiones</li>
                                        <li>Contratacion de Seguro deudor</li>
                                    </ul>
                                </div>
                                <div className="texto-centrado">
                                    <h1>Requisitos</h1>
                                </div>
                                <div>
                                    <ul className="fuente-md">
                                        <li>Identificacion oficial vigente</li>
                                        <li>Comprobante de domicilio actualizado</li>
                                        <li>Ser empleado</li>
                                        <li>Avales</li>
                                        <li>Referencias personales</li>
                                        <li>Contratacion de Seguro deudor</li>
                                    </ul>
                                </div>                                
                            </div>
                        }
                        { currSegment === "4" && // Especial
                            <div>
                                <div className="texto-centrado">
                                    <h1 className="clr-especial">CREDITO ESPECIAL CONSERVA</h1>
                                </div>
                                <div>
                                    <ul className="fuente-md">
                                        <li>Desde 30,000 hasta 400,000 pesos</li>
                                        <li>Plazo de 6 a 24 meses, tasa {productRate}% anual</li>
                                        <li>Pagos Quincenales o Mensuales</li>
                                        <li>Sin Comisiones</li>
                                        <li>Contratacion de Seguro deudor</li>
                                    </ul>
                                </div>
                                <div className="texto-centrado">
                                    <h1>Requisitos</h1>
                                </div>
                                <div>
                                    <ul className="fuente-md">
                                        <li>Identificacion oficial vigente</li>
                                        <li>Comprobante de domicilio actualizado</li>
                                        <li>Avales</li>
                                        <li>Garantias</li>
                                        <li>Referencias personales</li>
                                        <li>Contratacion de Seguro deudor</li>
                                    </ul>
                                </div>     
                            </div>
                        }
                    </div>
                    <IonButtonNext enabled={true} color='primary' expand="block" text='Siguiente'></IonButtonNext>
                </IonList>
    
            </SwiperSlide>}

            <SwiperSlide>
                <IonList className="ion-padding">
                    <div className="contenido-loanform">
                        <IonItemDivider>Credito Solicitado: {productName}</IonItemDivider>
                        <IonItem>
                            <IonRange dualKnobs={false} min={minAmout} max={maxAmount} step={stepAmount} snaps={true} value={apply_amount} onIonChange={(e) => setApplyAmount(e.detail.value as any)}/>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Importe Solicitado: {formatLocalCurrency(apply_amount) } </IonLabel>
                        </IonItem>
                            <IonItem><IonRange value={term} onIonChange={(e) => setTerm(e.detail.value as number)} min={minTerm} max={maxTerm} step={1} snaps={true}></IonRange>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Plazo: {term}</IonLabel>
                        </IonItem>
                        <IonRadioGroup allowEmptySelection={false} onIonChange={(e:any)=> setTermType(e.target.value!)} value={termType}>
                            <IonListHeader><IonLabel>Pagos Cada:</IonLabel></IonListHeader>
                                {productTermTypes.map( (t:any) => (
                                    <IonItem key={t._id}>
                                        <IonLabel>{t.value}</IonLabel>
                                        <IonRadio value={t.identifier}></IonRadio>
                                    </IonItem>))}
                        </IonRadioGroup>
                        <IonItem>
                            <IonLabel>Tu pago seria de:</IonLabel>
                            <IonLabel>{paymentAmount}</IonLabel>
                        </IonItem>

                    </div>
                    <IonButtonNext enabled={true} color='primary' expand="block" text='Siguiente' ></IonButtonNext>
                    <IonButtonPrev enabled={true} color='light' expand="block" text='Anterior' ></IonButtonPrev>
                </IonList>

            </SwiperSlide>

            <SwiperSlide>
                <IonList className="ion-padding">
                    <div className="contenido-loanform">
                        <IonItem>
                            <IonLabel>Destinos del Crédito</IonLabel>
                        </IonItem>
                        {
                            destinations.map((i:LoanDestination) =>(
                                <IonChip    key={i._id}
                                            outline={!i.status}
                                            onClick={onChipClick}
                                            color={ !i.status? 'medium' : 'success'}>
                                    <IonLabel id={`${i._id}`}>{i.description}</IonLabel>
                                </IonChip>
                            ))
                        }
                    </div>
                    <IonButtonNext enabled={true} color='primary' expand="block" text='Siguiente' ></IonButtonNext>
                    <IonButtonPrev enabled={true} color='light' expand="block" text='Anterior' ></IonButtonPrev>
                </IonList>
            </SwiperSlide>
            <SwiperSlide>
                <IonList className="ion-padding">
                    <div className="contenido-loanform">
                        <IonItem><IonLabel>Comprobantes y/o documentos</IonLabel></IonItem>
                        <IonFab vertical="bottom" horizontal="center" slot="fixed">
                            <IonFabButton onClick={() => takePhoto(20)} className='margen-abajo8x'>
                                <IonIcon icon={camera}></IonIcon>
                            </IonFabButton>
                        </IonFab>

                        <IonGrid>
                            <IonRow>
                                {pics.map((photo, index) => (
                                <IonCol size="6" key={index}>
                                    <IonImg src={`data:image/jpeg;base64,${photo.base64str}`} ></IonImg>
                                    {   /// si ya tiene un titulo, lo muestra, de otro modo, muestra el Input
                                        photo.title ? <IonLabel>{photo.title}</IonLabel>
                                        : <IonInput onIonBlur={onPhotoTitleUpdate} placeholder="Ingresa una descripcion" className="fuente-sm"></IonInput>
                                    }   
                                </IonCol>
                                
                                ))}
                            </IonRow>
                        </IonGrid>
                    </div>

                    <IonButtonNext enabled={true} color='primary' expand="block" text='Siguiente' ></IonButtonNext>
                    <IonButtonPrev enabled={true} color='light' expand="block" text='Anterior' ></IonButtonPrev>
                </IonList>
            </SwiperSlide>
            <SwiperSlide>
                <IonList className="ion-padding">
                    
                    <div className="contenido-loanform">
                        <IonItem>
                            <IonLabel>Resumen de Tu Solicitud</IonLabel>
                        </IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="4">Importe Solicitado:</IonCol>
                                <IonCol>{formatLocalCurrency(apply_amount)}</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="4">Plazo y forma de pago:</IonCol>
                                <IonCol>{term} { termType? (productTermTypes.find((i:any)=>i.identifier === termType) as TermType).value : ''}</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="4">Importe a pagar:</IonCol>
                                <IonCol>{paymentAmount}</IonCol>
                            </IonRow>
                        </IonGrid>
                        <IonItem><IonLabel>Destino del Credito</IonLabel></IonItem>
                        <IonGrid>
                            {destinations.map((i:LoanDestination)=> 
                                (i.status ? <IonRow  className='fuente-sm' key={i._id}>{i.description}</IonRow>: ''))}
                        </IonGrid>
            
                    </div>
                    
                    <IonButton onClick={onSend} type="submit" color="primary" expand="block" className="margen-abajo">Confirmar</IonButton>
                    <IonButtonPrev enabled={true} color='light' expand="block" text='Anterior' ></IonButtonPrev>
                </IonList>
            </SwiperSlide>
        </Swiper>

    )

}