import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonTitle,IonContent, IonList,IonCard,IonCardContent,IonCardHeader,IonCardSubtitle,IonItem,useIonLoading,IonLabel,IonListHeader,IonRadio,IonRadioGroup,IonBackButton, IonButton,
} from "@ionic/react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import 'swiper/css';
// import  JsBarcode from 'jsbarcode';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";
import api from "../../api/api";

import { RouteComponentProps } from "react-router";
import { formatLocalCurrency } from "../../utils/numberFormatter";
import { ButtonSlider } from "../../components/SliderButtons";
import { db } from "../../db";

interface IntermediadiesData {
    id: string;
    name: string;
    logo: string;
    external_id: number;
    tipo_evento: string;
    contain_barcode: boolean;
    associates: []
}

interface IntermediaryDataProps {
  id: string;
  name: string;
  logo: string;
  onSelectIntermediary: any;
}

const IntermediaryCard: React.FC<IntermediaryDataProps> = ({id, name, logo, onSelectIntermediary}) => {
  
  
  const swiper = useSwiper();
  
  function onSelect (e:any){
    
    onSelectIntermediary(e);
    swiper.slideNext();
  }
  return(
      <IonCard key={id} >
                  <img
                    src={`data:image/png;base64,${logo}`}
                    style={{ height: "50px" }}
                    onClick={onSelect}
                    id={`${id}`}
                  ></img>
                  <IonCardHeader>
                    <h1>{name}</h1>
              <IonCardSubtitle>{`${name}`}</IonCardSubtitle>
            </IonCardHeader>
        <IonCardContent></IonCardContent>
      </IonCard>
  );
}

export const WhereToPayHome: React.FC<RouteComponentProps> = ({match, history}) => {

  const [present,dismiss] = useIonLoading();
  const [intermediaries, setIntermediaries ] = useState<IntermediadiesData[]>([]);
  const [associates, setAssociates] = useState<IntermediadiesData[]>([]);
  const [tipoEvento, setTipoEvento] = useState<string>('');
  const [nombreCliente, setNombreCliente] = useState<string>('');
  const [tipoIntermediario, setTipoIntermediario] = useState<string>('');

  // const { loginInfo, personalData, contractsList } = useContext(AppContext);
  const [contractsList, setContractsList]  = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');

  const [selectedContract, setSelectedContract] = useState<string>('');

  useEffect( ()=>{

    async function loadData (){
      // present( {message:'Cargando ...'})
      try{
        /**
         * OBTENER los intermediarios
         */
        // api.defaults.headers.common["Authorization"] = `Bearer ${loginInfo.current_token}`;
        // const apiRes = await api.get('/paymentIntermediare');
        // setIntermediaries( apiRes.data );
        setIntermediaries([{
          id: "1",
          name: "BODEGA AHORRERA",
          logo: "",
          external_id: 0,
          tipo_evento: "",
          contain_barcode: false,
          associates:[]
        }]);

        /**
         * Loads up contract info
         */
        const clientId = match.url.split("/")[2]
        const contractsQuery = await db.find({ selector: { couchdb_type:"CONTRACT"}});
        const contracts = contractsQuery.docs.filter( (i:any) => i.client_id === clientId);
        setContractsList(contracts);

        dismiss();
      }
      catch(error){
        // dismiss();
        alert('No se encontraron medios donde realizar pago, solicite ayuda');
        history.goBack();
      }
    }
    loadData();
  },[]);


  async function selectIntermediary( e:any) {

    const selectedItem = intermediaries.find( (i:any)=> i._id === e.target.id );
    if( selectedItem ){
      try{ 
        present('Cargando referencias...')
        // api.defaults.headers.common["Authorization"] = `Bearer ${loginInfo.current_token}`;
        /// if selectedType === '2' (Pago de Garantía) or selectedType === '6' requires contractId
        // const referenceId = selectedType === '2' ? personalData.id_cliente : selectedContract;
        // const apiRes = await api.get(`/clients/createReference?typeReference=${selectedType}&id=${referenceId}&idIntermediario=${selectedItem.external_id}`);
        
        // if( selectedItem.contain_barcode && apiRes.data.length){
        //   JsBarcode("#code128",apiRes.data[0].referencia,{ fontSize: 14 } );
        //   setTipoEvento(apiRes.data[0].tipo_evento);
        //   setNombreCliente(apiRes.data[0].nombre_cliente);
        //   setTipoIntermediario(apiRes.data[0].nombre);
        // }

        dismiss();
      } catch(error){
        dismiss();
        console.log(error);
        alert('No fue posible procesar la peticion de referencias de pago')
      }
      
      setAssociates(selectedItem.associates);
       
    }
 }
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Medios de pago</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Swiper spaceBetween={50} slidesPerView={1} >
          <SwiperSlide>
            <IonList className="ion-margin">
              <IonRadioGroup value={selectedType} onIonChange={e => setSelectedType(e.detail.value)}>
                <IonListHeader>
                  <IonLabel>¿Qué voy a pagar?</IonLabel>
                </IonListHeader>
                <IonItem>
                  <IonLabel>Garantía Líquida</IonLabel>
                  <IonRadio slot="start" value="2" />
                </IonItem>
                <IonItem>
                  <IonLabel>Pagar Crédito</IonLabel>
                  <IonRadio slot="start" value="6" />
                </IonItem>
                
                <ButtonSlider  disabled={!selectedType}  onClick={()=>{}} color='success' label="Siguiente" expand="block" slideDirection="F"/>
              </IonRadioGroup>            
            </IonList>
          </SwiperSlide>
          { selectedType === '6' && // only when Credit type selected
          <SwiperSlide>
            <IonList className="ion-padding">
              <IonRadioGroup value={selectedContract} onIonChange={e => setSelectedContract(e.detail.value)}>
                  <IonListHeader>
                    <IonLabel>Contratos Activos:</IonLabel>
                  </IonListHeader>
                  {
                  contractsList.map( (i:any) => (
                    <IonItem key={i.idContrato}>
                      <IonLabel>Contrato: {i.idContrato} / {formatLocalCurrency(parseFloat(i.montoReembolso))}</IonLabel>
                      <IonRadio slot="start" value={i.idContrato} />
                    </IonItem> ))
                  }
                  <p></p>
                  <ButtonSlider disabled={!selectedContract} color='success' label='Continuar' expand='block' onClick={()=>{}} slideDirection="F"/>
                  <p></p>
                  <ButtonSlider  color='medium' label='Anterior' expand='block' onClick={()=>{}} slideDirection="B"/>
                </IonRadioGroup>              
            </IonList>
          </SwiperSlide>}
          <SwiperSlide>
            <IonList>
              {
              intermediaries.map((p: any,n) => (
                <IntermediaryCard
                  key={n}
                  id={p._id} 
                  name={p.name} 
                  logo={p.logo} 
                  onSelectIntermediary={selectIntermediary}/>
              ))}
              <IonList className="ion-padding">
                <p></p>
                <ButtonSlider disabled={!selectedContract} color='success' label='Continuar' expand='block' onClick={()=>{}} slideDirection="F"/>
                <p></p>
                <ButtonSlider  color='medium' label='Anterior' expand='block' onClick={()=>{}} slideDirection="B"/>
              </IonList>
            </IonList>

          </SwiperSlide>

          <SwiperSlide>
          <IonList className="ion-padding">
            <div className="barcode-header">
              <p>Deposito de: {tipoEvento} </p>
              <p>Nombre: {nombreCliente}</p>
              <p>Corresponsal: {tipoIntermediario}</p>
            </div>
            <div className="barcode-container">
              <svg id="code128" className="barcode-element" ></svg>
            </div>  
              <div className="barcode-associate">
              {
                associates.map( (x:any,n)=>(
                    <img key={n} src={`data:image/png;base64,${x.logo}`}>
                    </img>                  
                ))
              }
              </div>
              <p></p>
                <IonButton color='primary' expand="block">Finalizar</IonButton> <p></p>
                <IonButton color='success' expand="block">Compartir</IonButton>
            </IonList>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
}
