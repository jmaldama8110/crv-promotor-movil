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
        ...data,
        // comprobante_domicilio_pics: data.comprobante_domicilio_pics.map( (x:GeneralPhoto) => ({ _id: x._id, title: x.title })),
        // identity_pics: data.identity_pics.map( (x:GeneralPhoto) => ({ _id: x._id, title: x.title })),
      }).then( async ()=>{
        // await dbX.bulkDocs(data.identity_pics);
        // await dbX.bulkDocs(data.comprobante_domicilio_pics);
        await createAction("CREATE_UPDATE_CLIENT", 
        { 
          _id: itemId,
          id_loan: '',
          client_name: `${data.name} ${data.lastname} ${data.second_lastname}`,
          id_cliente: data.id_cliente,
          id_solicitud: 0
         }, session.user);
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
