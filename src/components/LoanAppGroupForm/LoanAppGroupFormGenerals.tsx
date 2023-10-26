
import { DatetimeChangeEventDetail, IonAvatar, IonDatetime, IonDatetimeButton, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonModal, IonRadio, IonRadioGroup, IonRange, useIonAlert } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";
import { getRound } from "../../utils/math";
import { formatLocalCurrencyV2, formatLocalCurrency } from "../../utils/numberFormatter";
import { ButtonSlider } from "../SliderButtons";
import { Geolocation } from "@capacitor/geolocation";

interface TermType {
    identifier: string;
    value: string;
    year_periods: string;
}
interface DatetimeCustomEvent extends CustomEvent {
    detail: DatetimeChangeEventDetail;
    target: HTMLIonDatetimeElement;
  }

export const LoanAppGroupFormGenerals: React.FC< { onSubmit:any }> = ( {onSubmit}) => {

    const { loanAppGroup  } = useContext(AppContext);
    
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
  
    const [apply_amount, setApplyAmount] = useState<number>( loanAppGroup.product.min_amount);  
    const [term, setTerm] = useState<number>( loanAppGroup.product.min_term);
    const [termType, setTermType] = useState<string | undefined | null>("");

    /// Pago igual resultante
    const [paymentAmount, setPaymentAmount] = useState<string | undefined | null>("");

    const [validationsStep1, setValidationsStep1] = useState<boolean>(true);

    const [fechaPrimerPago, setFechaPrimerPago] = useState<string>('');
    const [fechaDesembolso, setFechaDesembolso] = useState<string>('');
    const [showAlert] = useIonAlert();


    function onSend(){
        const freqItem:TermType = loanAppGroup.product.term_types.find( (i:TermType) => i.identifier === termType )
        
        const data ={   
            apply_amount,
            term,
            disbursment_date: fechaDesembolso,
            first_repay_date: fechaPrimerPago,
            frequency: [freqItem.identifier, freqItem.value ],
            coordinates: [lat,lng],
        }
        onSubmit(data);
    }
    useEffect( ()=>{
        setApplyAmount(loanAppGroup.apply_amount);
        if( loanAppGroup._id){ // runs when the _id not empty, thus in edit mode                
                setTerm( loanAppGroup.term);
                setTermType( loanAppGroup.frequency[0]);
                setFechaDesembolso( loanAppGroup.disbursment_date);
                setFechaPrimerPago( loanAppGroup.first_repay_date);
        }
        if( !loanAppGroup._id){
            //// calcualate defautl dates for Disbursment date and first repay date 14 days ahead today
                const fechaDesNew = new Date();
                const fechaPPagoNew = new Date();

                fechaDesNew.setDate(fechaDesNew.getDate() + 7);
                fechaPPagoNew.setDate( fechaPPagoNew.getDate() + 14);
                
                setFechaDesembolso(fechaDesNew.toISOString());
                setFechaPrimerPago(fechaPPagoNew.toISOString());
            
        }

    },[loanAppGroup]) 
    
    useEffect(() => {

        const sched = [];
        const importe = apply_amount;
        const npagos = -term;
        let cuota = 0;
        let saldo = importe;
        let interes_periodo = 0;
        let capital_periodo = 0;
        let impuesto_periodo = 0;
        const iva = (1 + (loanAppGroup.product.tax)/100) ;
    
        const period: (TermType | undefined ) = loanAppGroup.product.term_types.find( (i: any) => i.identifier === termType);
        
        if (period) {
          const year_rate = (loanAppGroup.product.rate * iva) / 100;
          const year_periods = parseFloat(period.year_periods);
          const period_rate = year_periods ? year_rate / year_periods : 0;
          
          const numerator = importe * period_rate;
          const divisor = 1 - (1 + period_rate) ** npagos;
          cuota = getRound(divisor ? numerator / divisor : 0,1);
          setPaymentAmount(formatLocalCurrencyV2(cuota,"$","",""));
    
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
              amount: getRound(cuota,100),
              principal: getRound(capital_periodo,100),
              interest: getRound(interes_periodo,100),
              tax: getRound(impuesto_periodo,100),
              insurance: 0,
              balance: getRound(saldo,100)
            });
          }
        }
    
      }, [apply_amount, term, termType]);    

      useEffect(() => {
        async function loadCoordinates() {
          const coordsData = await Geolocation.getCurrentPosition();
          setLat(coordsData.coords.latitude);
          setLng(coordsData.coords.longitude);
        }
        loadCoordinates();
      }, []);

      useEffect( ()=>{
        if( !loanAppGroup._id ){
            // onValidateEntries();
        }
    },[fechaDesembolso, fechaPrimerPago])

    function onValidateEntries (){
        setValidationsStep1(false);
        const today = new Date();
        const validationMessage: string[] = [];
        const disburseDate = new Date(fechaDesembolso);
        const firstRepayDate = new Date(fechaPrimerPago);

        if( disburseDate.getTime() <= today.getTime() ) {
            validationMessage.unshift('La fecha de desembolso no es valida el dia de hoy o pasada...\n')
        }
        if( firstRepayDate.getTime() <= today.getTime() ){
            validationMessage.unshift('La fecha de primer pago no es valida el dia de hoy o pasada...\n')
        }

        if( disburseDate.getTime() >= firstRepayDate.getTime() ){
            validationMessage.unshift('La fecha de desembolso no puede ser despues de la fecha de primero pago...\n')
        }

        if( validationMessage.length ){
            showAlert({
                header: 'OJO, existe un detalle',
                subHeader: 'Verifica las siguientes entradas',
                message: `${validationMessage.toString()}`,
                buttons: ['OK'],
              });
            setValidationsStep1(false);
        } else {
            setValidationsStep1(true);
        }

    }

    function onFechaDesembolsoChange (ev: DatetimeCustomEvent) {
        setFechaDesembolso( ev.detail.value as string );
        
    }

    function onFechaPrimerPagoChange( ev: DatetimeCustomEvent) {
        setFechaPrimerPago( ev.detail.value as string);
    }
    

    return (
        <IonList className="ion-padding">
        
            <IonItemDivider>Credito Solicitado: {loanAppGroup.product.product_name}</IonItemDivider>
            <IonItem>
                <IonRange dualKnobs={false} min={loanAppGroup.product.min_amount} max={loanAppGroup.product.max_amount} step={loanAppGroup.product.step_amount} snaps={true} value={apply_amount} onIonChange={(e) => setApplyAmount(e.detail.value as any)}/>
            </IonItem>
            <IonItem>
                <IonLabel>Importe Solicitado: {formatLocalCurrency(apply_amount) } </IonLabel>
            </IonItem>
                <IonItem><IonRange value={term} onIonChange={(e) => setTerm(e.detail.value as number)} min={loanAppGroup.product.min_term} max={loanAppGroup.product.max_term} step={1} snaps={true}></IonRange>
            </IonItem>
            <IonItem>
                <IonLabel>Plazo: {term}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Fecha Desembolso</IonLabel>
                <IonDatetimeButton datetime="fecha-desembolso"></IonDatetimeButton>
            </IonItem>
            <IonItem>
                <IonLabel>Fecha Primer Pago</IonLabel>
            <IonDatetimeButton datetime="fecha-primer-pago"></IonDatetimeButton>
            </IonItem>
            <IonModal keepContentsMounted={true}>
                <IonDatetime id="fecha-desembolso" presentation="date" multiple={false} value={fechaDesembolso} onIonChange={onFechaDesembolsoChange} ></IonDatetime>
            </IonModal>
            <IonModal keepContentsMounted={true}>
                <IonDatetime id="fecha-primer-pago" presentation="date" multiple={false} value={fechaPrimerPago} onIonChange={onFechaPrimerPagoChange}></IonDatetime>
            </IonModal>




            <IonRadioGroup allowEmptySelection={false} onIonChange={(e:any)=> setTermType(e.target.value!)} value={termType}>
                <IonListHeader><IonLabel>Pagos Cada:</IonLabel></IonListHeader>
                    {loanAppGroup.product.term_types.map( (t:TermType) => (
                        <IonItem key={t.identifier}>
                            <IonLabel>{t.value}</IonLabel>
                            <IonRadio value={t.identifier}></IonRadio>
                        </IonItem>))}
            </IonRadioGroup>
            <IonItem>
                <IonLabel>Importe Ficha:</IonLabel>
                <IonLabel>{paymentAmount}</IonLabel>
            </IonItem>

        
        <ButtonSlider color="primary" expand="block" label='Siguiente' onClick={onSend} slideDirection={"F"} disabled={!termType}></ButtonSlider>
        <ButtonSlider color="medium" expand="block" label='Anterior' onClick={() => {
            setTermType("");
            setApplyAmount(loanAppGroup.product.min_amount);
            setTerm(loanAppGroup.product.min_term);
            setPaymentAmount("")
        } } slideDirection={"B"}></ButtonSlider>
    </IonList>

    );
}