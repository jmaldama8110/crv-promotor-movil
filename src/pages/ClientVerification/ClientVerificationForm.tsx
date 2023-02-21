import { Geolocation } from "@capacitor/geolocation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";


import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";

import { ClientVerificationFormGenerals } from "./ClientVerificationForm/ClientVerificationFormGenerals";
import { ClientVerificationFormSocioeconomics } from "./ClientVerificationForm/ClientVerificationFormSocioeconomics";
import { ClientVerificationFormPLD } from "./ClientVerificationForm/ClientVerificationFormPLD";
import { ClientFormAddress } from "../../components/ClientForm/ClientFormAddress";
import { IonCheckbox, IonItem, IonItemDivider, IonLabel } from "@ionic/react";
import { ClientVerificationImages } from "./ClientVerificationForm/ClientVerificationImages";
import { ButtonSlider } from "../../components/SliderButtons";

export const ClientVerificationForm: React.FC<{ onSetProgress: any, onSubmit:any}> = ( {onSetProgress, onSubmit})=> {

    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [isAddressCorrect, setIsAddressCorrect] = useState<boolean>(false);
    const { dispatchClientVerification, clientVerification } = useContext(AppContext);

    let render = true;
    useEffect(() => {
        async function loadCoordinates() {
          const coordsData = await Geolocation.getCurrentPosition();
          setLat(coordsData.coords.latitude);
          setLng(coordsData.coords.longitude);
        }
        

        if( render ){
          render = false;
          loadCoordinates();
          
        }
    
        
      }, []);

      useEffect( ()=>{
          if( clientVerification._id){
            setIsAddressCorrect( clientVerification.isAddressCorrect);
          }
      },[clientVerification])

      function onGeneralsNext(data:any){
        
        dispatchClientVerification({ type:"SET_CLIENT_VERIFICATION", verification:{
          ...data, coordinates:[lat,lng]
        }})
      }

      function onSocioEconomicsNext(data:any){
        dispatchClientVerification({ type: "SET_CLIENT_VERIFICATION", verification:{
          ...data
        }})
      }

      function onAddressNext(data:any) { 
        dispatchClientVerification({ type: "SET_CLIENT_VERIFICATION", verification:{
          ...data, isAddressCorrect
        }})      }
      
      function onImageVerificationNext(data:any){
        dispatchClientVerification({ type: "SET_CLIENT_VERIFICATION", verification:{
          ...data
        }})
      }

      function onPldNext(data:any){
        
        dispatchClientVerification({ type: "SET_CLIENT_VERIFICATION", verification:{
          ...data
        }})
        onSubmit({...clientVerification, ...data});

      }
    return (
        <Swiper spaceBetween={50} slidesPerView={1} allowTouchMove={false}>
          <SwiperSlide>
            <ClientVerificationFormGenerals onNext={onGeneralsNext} onSetProgress={onSetProgress} />
          </SwiperSlide>
  
          <SwiperSlide>
            <ClientVerificationFormSocioeconomics onNext={onSocioEconomicsNext} onSetProgress={onSetProgress}  />
          </SwiperSlide>

          <SwiperSlide>
          <IonItemDivider><IonLabel>COTEJE LA DIRECCION DEL CLIENTE</IonLabel></IonItemDivider>
          <IonItem><IonLabel>La direccion del Cliente es correcta</IonLabel>
            <IonCheckbox checked={isAddressCorrect} onIonChange={async (e) =>setIsAddressCorrect(e.detail.checked)} />
          </IonItem>
          
            { !clientVerification._id &&
              <ClientFormAddress addressType="DOMICILIO" onNext={onAddressNext} />}
            {!!clientVerification._id &&
            <>
              <IonItem>
                <p>Calle: {clientVerification.address_line1}</p>
              </IonItem>
              <IonItem>
                <p>Colonia: {clientVerification.colony[1]}</p>
              </IonItem>
              <IonItem>
                <p>Ciudad, Municipio: {clientVerification.municipality[1]}</p>
              </IonItem>
              <IonItem>
                <p>Estado: {clientVerification.province[1]}, {clientVerification.country[1]}</p>
              </IonItem>
              <IonItem>
                <p>CP: {clientVerification.post_code}</p>
              </IonItem>
              <p></p>
              <ButtonSlider color="primary" expand="block" label='Siguiente' onClick={()=>{} } slideDirection={"F"}></ButtonSlider>
              <ButtonSlider color="medium" expand="block" label='Anterior' onClick={() => {} } slideDirection={"B"}></ButtonSlider>
            </>
          }
          </SwiperSlide>
          <SwiperSlide>
            <ClientVerificationImages onNext={onImageVerificationNext} />
          </SwiperSlide>
        
          <SwiperSlide>
            <ClientVerificationFormPLD onNext={onPldNext} onSetProgress={onSetProgress}/>
          </SwiperSlide>
      </Swiper>
    );
}