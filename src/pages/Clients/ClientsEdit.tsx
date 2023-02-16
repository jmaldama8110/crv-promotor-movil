import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  } from "@ionic/react";
import { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { createAction } from "../../model/Actions";
import { ClientData } from "../../reducer/ClientDataReducer";
import { AppContext } from "../../store/store";
import { ClientForm } from "./ClientForm";

export const ClientsEdit: React.FC<RouteComponentProps> = ({ match,history }) => {

  const {  dispatchClientData, dispatchSession, session} = useContext(AppContext);
  const { couchDBSyncUpload } = useDBSync();

  let render = true;
  useEffect(() => {
    
    if( render ){
      render = false;
      const itemId = match.url.replace("/clients/edit/", "");
      dispatchSession({ type: "SET_LOADING", loading_msg: 'Cargando...', loading: true});
        db.get(itemId)
          .then( async (data) => {
            await createAction("CREATE_UPDATE_CLIENT", { _id: itemId }, session.user);
            const newData = data as ClientData;
            dispatchClientData({
              type: "SET_CLIENT",
              ...newData
            });
            dispatchSession({ type: "SET_LOADING", loading_msg: '', loading: false});
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
    dispatchSession({ type: "SET_LOADING", loading_msg: 'Guardando...', loading: true});
    db.get(itemId).then( async (clientDbData:any) => {
      return db.put({
        ...clientDbData,
        ...data
      }).then( async ()=>{
        await couchDBSyncUpload();
        dispatchSession({ type: "SET_LOADING", loading_msg: '', loading: false});
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
