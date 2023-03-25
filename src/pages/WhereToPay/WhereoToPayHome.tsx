import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonTitle,IonContent, IonList,IonCard,IonCardContent,IonCardHeader,IonCardSubtitle,IonItem,useIonLoading,IonLabel,IonListHeader,IonRadio,IonRadioGroup,IonBackButton, IonButton, IonItemDivider,
} from "@ionic/react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import 'swiper/css';
import  JsBarcode from 'jsbarcode';
import { useContext, useState } from "react";
import { AppContext } from "../../store/store";
import api from "../../api/api";

import { RouteComponentProps } from "react-router";
import { formatLocalCurrency } from "../../utils/numberFormatter";
import { ButtonSlider } from "../../components/SliderButtons";
import { db } from "../../db";

interface IntermediaryData {
    id: string;
    name: string;
    contain_barcode: boolean;
    associates: []
}


interface IntermediaryDataProps {
  id: string;
  name: string;
  logo?: string;
  onSelectIntermediary: any;
}

const IntermediaryCard: React.FC<IntermediaryDataProps> = ({id, name, logo, onSelectIntermediary}) => {
  const swiper = useSwiper();
  function onSelect (e:any){
    
    onSelectIntermediary(e);
    swiper.slideNext();
  }
  return (
      <IonCard
        id={`ioncard-intermediary-${id}`}
        key={id} 
        onClick={onSelect}>
          <IonCardHeader
            id={`ioncard-intermediary-${id}`}
          >
              <h1 id={`ioncard-intermediary-${id}`}>{name}</h1>
              <IonCardSubtitle id={`ioncard-intermediary-${id}`}>{`${name}`}</IonCardSubtitle>
          </IonCardHeader>
      </IonCard>
  );
}

export const WhereToPayHome: React.FC<RouteComponentProps> = ({match, history}) => {

  const [present,dismiss] = useIonLoading();
  const [intermediaries, setIntermediaries ] = useState<IntermediaryData[]>([]);
  const [associates, setAssociates] = useState<IntermediaryData[]>([]);
  const [tipoEvento, setTipoEvento] = useState<string>('');
  const [nombreCliente, setNombreCliente] = useState<string>('');
  const [tipoIntermediario, setTipoIntermediario] = useState<string>('');
  const [codigoReferenciado, setCodigoReferenciado] = useState<string>('');
  
  const [contractsList, setContractsList]  = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');

  const [selectedContract, setSelectedContract] = useState<string>('');
  const { session } = useContext(AppContext);

 async function loadIntermediaries() {
  try{
    present( {message:'Cargando intermediarios...'})

    api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
    const apiRes = await api.get('/intermediary/hf');
    const apiData: IntermediaryData[] = apiRes.data.map( (x:any) =>( {
        id: `${x.id}`,
        name: x.nombre,
        contain_barcode: x.contiene_codigo_barras,
        associates: []
    }))
    setIntermediaries(apiData);
    
    const clientId = match.url.split("/")[2]
    const contractsQuery = await db.find({ selector: { couchdb_type:"CONTRACT"}});
    const contracts = contractsQuery.docs.filter( (i:any) => i.client_id === clientId);
    setContractsList(contracts);
    dismiss();

  }
  catch(error){
    dismiss();
    alert('No se encontraron medios donde realizar pago, solicite ayuda');
    
  }
}

async function selectIntermediary( e:any) {

  const targetId = e.target.id.replace('ioncard-intermediary-','')

  const selectedItem = intermediaries.find( (i:IntermediaryData)=> i.id === targetId );
  const clientId = match.url.split("/")[2];
  
  if( selectedItem ){
    try{ 
      present('Cargando referencias...')

      /** retrieves client data */
      const clientData:any = await db.get(clientId);
  
      api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;
      // if selectedType === '2' (Pago de Garantía) or selectedType === '6' requires contractId
      const referenceId = selectedType === '2' ? clientData.id_cliente : selectedContract;
      const apiRes = await api.get(`/clients/createReference?typeReference=${selectedType}&id=${referenceId}&idIntermediario=${selectedItem.id}`);

      setTipoEvento(apiRes.data[0].tipo_evento);
      setNombreCliente(apiRes.data[0].nombre_cliente);
      setTipoIntermediario(apiRes.data[0].nombre);
      setCodigoReferenciado(apiRes.data[0].referencia);
      if( selectedItem.contain_barcode && apiRes.data.length){
        JsBarcode("#code128",apiRes.data[0].referencia,{ fontSize: 14 } );
      }

      dismiss();
    } catch(error){
      dismiss();
      console.log(error);
      alert('No fue posible procesar la peticion de referencias de pago')
    }
    
    setAssociates(selectedItem.associates);
     
  }
}
 const onSelectTypeNext = async () =>{
      await loadIntermediaries();
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


        <Swiper spaceBetween={50} slidesPerView={1} allowTouchMove={false} >
          {/** Select Guarantee or Repayment */}
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
                <p></p>
                <ButtonSlider  disabled={!selectedType}  onClick={onSelectTypeNext} color='success' label="Siguiente" expand="block" slideDirection="F"/>
              </IonRadioGroup>            
            </IonList>
          </SwiperSlide>
          {/** Only when Repayment selected, list contracts*/}
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
              intermediaries.map((p: IntermediaryData,n) => (
                <IntermediaryCard
                  key={n}
                  id={p.id} 
                  name={p.name} 
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
            <IonItem>{nombreCliente}</IonItem>
            <IonItem><IonLabel>Deposito de: {tipoEvento}</IonLabel></IonItem>
            <IonItem><IonLabel>Donde pagar: {tipoIntermediario}</IonLabel></IonItem>
            <IonItemDivider><IonLabel>Referencia:</IonLabel></IonItemDivider>
            <IonItem><h3>{codigoReferenciado}</h3></IonItem>
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
                <IonButton color='success' expand="block">Compartir</IonButton>
            </IonList>
          </SwiperSlide>


        </Swiper>
      </IonContent>
    </IonPage>
  );
}
