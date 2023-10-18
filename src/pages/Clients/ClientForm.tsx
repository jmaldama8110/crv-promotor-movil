import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { ClientFormPersonalData } from "../../components/ClientForm/ClientFormPersonalData";
import { useContext, useEffect, useState } from "react";
import { ClientFormAddress } from "../../components/ClientForm/ClientFormAddress";
import { ClientFormEconomics } from "../../components/ClientForm/ClientFormEconomics";
import { ClientFormBusinessData } from "../../components/ClientForm/ClientFormBusinessData";
import { ClientFormSummary } from "../../components/ClientForm/ClientFormSummary";
import { AppContext } from "../../store/store";
import { Geolocation } from "@capacitor/geolocation";
import { ClientFormIdentity } from "../../components/ClientForm/ClientFormIdentity";
import { ClientFormComprobanteDomicilio } from "../../components/ClientForm/ClientFormComprobanteDomicilio";


interface ClientFormProps {
  onSubmit: any;
}

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

  function onIdentityDocsNext( data:any) {
    dispatchClientData({
      type: 'SET_CLIENT',
      ...clientData,
      ...data
    })
  }

  function onComprobanteDomicilioNext( data:any) {
    dispatchClientData({
      type: 'SET_CLIENT',
      ...clientData,
      ...data
    })
  }


  function updateAddressBasedOnType ( typeAdd: string, newAddressData:any){
    /// 1. determines whether a HOME address exists
    let newAddressList = clientData.address
    const homeAddress = newAddressList.find( (i:any) => i.type=== typeAdd );
    ///2. if exists, update it
    if( homeAddress)
      newAddressList = clientData.address.map( (add:any) => (
          add._id === homeAddress._id ? {...add,...newAddressData} : { ...add } ))
     else // 3. If not, add it
      newAddressList.push({
        _id: Date.now().toString(),
        ...newAddressData
      })
    
    return newAddressList

  }

  function onHomeAddressNext( data:any){
  
    dispatchClientData({ 
      type:"SET_CLIENT",
      ...clientData,
      coordinates: [lat,lng],
      address:  updateAddressBasedOnType('DOMICILIO',data)
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
      address: updateAddressBasedOnType('NEGOCIO',data)
    })
  }

  function sendData( data: any) {
    onSubmit({...clientData,...data,});
  }


  return (
    <Swiper spaceBetween={50} slidesPerView={1} allowTouchMove={false}>

      <SwiperSlide>
        <ClientFormPersonalData onNext={onPersonalDataNext} />
      </SwiperSlide>
      
      {/* <SwiperSlide>
        <ClientFormIdentity onNext={onIdentityDocsNext} />
      </SwiperSlide> */}

       <SwiperSlide>
        <ClientFormAddress addressType={"DOMICILIO"} onNext={onHomeAddressNext} />
      </SwiperSlide>

      {/* <SwiperSlide>
        <ClientFormComprobanteDomicilio onNext={onComprobanteDomicilioNext} />
      </SwiperSlide> */}
     
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
        <ClientFormSummary onNext={sendData}/>

      </SwiperSlide> 
    </Swiper>
  );
};
