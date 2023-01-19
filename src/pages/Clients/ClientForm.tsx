import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  IonButton,
  IonList,
} from "@ionic/react";
import {  ButtonSlider } from "../../components/SliderButtons";
import { ClientFormPersonalData } from "../../components/ClientForm/ClientFormPersonalData";
import { useContext, useEffect, useState } from "react";
import { ClientFormAddress } from "../../components/ClientForm/ClientFormAddress";
import { ClientFormEconomics } from "../../components/ClientForm/ClientFormEconomics";
import { ClientFormBusinessData } from "../../components/ClientForm/ClientFormBusinessData";
import { ClientFormSummary } from "../../components/ClientForm/ClientFormSummary";
import { AppContext } from "../../store/store";
import { Geolocation } from "@capacitor/geolocation";


interface ClientFormProps {
  onSubmit: any;
}
 /**
  * RODO960112HCSMZS00
  * PEAL940702HCSRGS01
  * 
  */
export const ClientForm: React.FC<ClientFormProps> = ({ onSubmit }) => {
  
  
  const { clientData,dispatchClientData } = useContext(AppContext);  

  const [lat,setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect( ()=>{
    async function loadCoordinates (){
      const coordsData = await Geolocation.getCurrentPosition();
      setLat(coordsData.coords.latitude);
      setLng(coordsData.coords.longitude);
    }
    loadCoordinates();
  },[])
   

  function onPersonalDataNext(data:any){
    
    dispatchClientData({
      type: 'SET_CLIENT',
      ...clientData,
      ...data
    })
  };

  function onHomeAddressNext( data:any){
  
    dispatchClientData({ 
      type:"SET_CLIENT",
      ...clientData,
      coordinates: [lat,lng],
      address: [{
          _id: Date.now().toString(),
          ...data }]
    })
    
  }
  function onEconomicsData(data:any){

    dispatchClientData({
      type: "SET_CLIENT",
      ...clientData,
      ocupation: data.ocupation,
      marital_status: data.marital_status,
      education_level: data.education_level,
      business_data: {
        economic_activity: data.economic_activity,
        profession: data.profession,
        business_start_date: clientData.business_data.business_start_date,
        business_name: clientData.business_data.business_name,
        business_owned: clientData.business_data.business_owned,
        business_phone: clientData.business_data.business_phone,
      }
    })

  }

  function onBisDataNext( data:any){
    dispatchClientData({
      type: "SET_CLIENT",
      ...clientData,
      tributary_regime: data.tributary_regime,
      rfc: data.rfc,
      not_bis: data.not_bis,
      business_data: {
        ...clientData.business_data,
        business_start_date: data.business_start_date,
        business_name: data.business_name,
        business_owned: data.business_owned,
        business_phone: data.business_phone,
      }
    })
  }

  function onBisAddressNext( data:any){
    dispatchClientData({ 
      type:"SET_CLIENT",
      ...clientData,
      address: [
        clientData.address[0],
        {
          _id: Date.now().toString(),
          ...data 
        }]
    })
  }
  function sendData() {
    onSubmit(clientData);
  }


  return (
    <Swiper spaceBetween={50} slidesPerView={1} allowTouchMove={false}>

      <SwiperSlide>
        <ClientFormPersonalData onNext={onPersonalDataNext} />
      </SwiperSlide>

       <SwiperSlide>
        <ClientFormAddress addressType={"DOMICILIO"} onNext={onHomeAddressNext} />
      </SwiperSlide>
      
      <SwiperSlide>
        <ClientFormEconomics onNext={onEconomicsData}  />
      </SwiperSlide>

      <SwiperSlide>

        <ClientFormBusinessData onNext={onBisDataNext} />

      </SwiperSlide>
        
      
      {!clientData.not_bis &&
        <SwiperSlide>
          <ClientFormAddress addressType={"NEGOCIO"} onNext={onBisAddressNext} />
      </SwiperSlide>}
      
      <SwiperSlide>
        <ClientFormSummary />
        <IonList className="ion-padding">
          <IonButton expand="block" onClick={sendData} color='success'>Guardar</IonButton>
          <ButtonSlider onClick={()=>{}} slideDirection={'B'} color="light" expand="block" label="Anterior" />
        </IonList>
      </SwiperSlide> 
    </Swiper>
  );
};
