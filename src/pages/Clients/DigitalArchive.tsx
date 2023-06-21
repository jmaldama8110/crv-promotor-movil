import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonItemDivider, IonLabel, IonInput, IonButton, IonGrid, IonRow, IonCol, IonImg } from "@ionic/react"
import { useContext, useEffect } from "react";
import { AppContext } from "../../store/store";
import { db } from "../../db";
import { RouteComponentProps } from "react-router";
import { ClientData } from "../../reducer/ClientDataReducer";
import { IdentityVerification } from "../../components/DigitalArchive/IdentityVerification";

import { ButtonSlider } from "../../components/SliderButtons";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import 'swiper/css';


export const DigitalArchive: React.FC<RouteComponentProps> = (props)=>{

  const { dispatchSession, dispatchClientData } = useContext(AppContext);
  let loaded = false;
  useEffect( ()=> {

    async function LoadClientData() {

      const itemId = props.match.url.replace("/digitalachive/", "");
      dispatchSession({ type: "SET_LOADING", loading_msg: 'Cargando...', loading: true});
        db.get(itemId)
          .then( async (data) => {
            
            const newData = data as ClientData;
            dispatchClientData({
              type: "SET_CLIENT",
              ...newData
            });
            
            dispatchSession({ type: "SET_LOADING", loading_msg: '', loading: false});
            console.log(newData);
          })
          .catch((err) => {
            alert("No fue posible recuperar el cliente: " + itemId);
          });

    }

    if( ! loaded ) {
      loaded = true;
      LoadClientData();
    }

  },[])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>        
          <IonTitle>Expediente Digital</IonTitle>
          
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">

        <Swiper spaceBetween={50} slidesPerView={1} allowTouchMove={false} >
        
          <SwiperSlide> 
          {/** Identity verification slide */}
            <IdentityVerification />
            <ButtonSlider color='success' label='Siguiente' expand='block' onClick={()=>{}} slideDirection="F"/>
          </SwiperSlide>

          <SwiperSlide>
            <h1>Slide 2</h1>
            <ButtonSlider color='success' label='Siguiente' expand='block' onClick={()=>{}} slideDirection="F"/>
            <ButtonSlider  color='medium' label='Anterior' expand='full' onClick={()=>{}} slideDirection="B"/>

          </SwiperSlide>
          <SwiperSlide>
            <h1>The End</h1>
            
            <ButtonSlider  color='medium' label='Anterior' expand='full' onClick={()=>{}} slideDirection="B"/>

          </SwiperSlide>

        </Swiper>
      </IonContent>
    </IonPage>
  );

}