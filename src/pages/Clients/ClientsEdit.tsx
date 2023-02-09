import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db, remoteDB } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { ClientData } from "../../reducer/ClientDataReducer";
import { AppContext } from "../../store/store";
import { ClientForm } from "./ClientForm";

export const ClientsEdit: React.FC<RouteComponentProps> = ({ match,history }) => {

  const {  dispatchClientData} = useContext(AppContext);
  const { couchDBSyncUpload } = useDBSync();

  let render = true;
  useEffect(() => {

    if( render ){
      render = false;
      const itemId = match.url.replace("/clients/edit/", "");
      
        db.get(itemId)
          .then( (data) => {
            const newData = data as ClientData;
            dispatchClientData({
              type: "SET_CLIENT",
              ...newData
            });
          })
          .catch((err) => {
            alert("No fue posible recuperar el cliente: " + itemId);
          });
        
    }

    return () =>{
      dispatchClientData({ type:"RESET_CLIENT" })
    }

  }, []);
  const onUpdate = (data:any) => {
    // Update selected Client
    const itemId = match.url.replace("/clients/edit/", "");
    
    db.get(itemId).then( async (clientDbData:any) => {
      return db.put({
        ...clientDbData,
        ...data
      }).then( async ()=>{
        await couchDBSyncUpload();
        history.goBack();
      })
    })
    
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>        
          <IonTitle>Editar Cliente</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <ClientForm  onSubmit={onUpdate}/>
      </IonContent>
    </IonPage>
  );
};
