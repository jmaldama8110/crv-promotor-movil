import {
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
import { ClientData } from "../../reducer/ClientDataReducer";
import { AppContext } from "../../store/store";
import { ClientForm } from "./ClientForm";

export const ClientsEdit: React.FC<RouteComponentProps> = ({ match,history }) => {

  const { dispatchSession , dispatchClientData} = useContext(AppContext);
  const [showToast] = useIonToast();
  let render = true;
  useEffect(() => {
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
          return () =>{
            dispatchClientData({ type:'RESET' });
          }
      
  }, []);

  const onUpdate = (data:any) => {
    // Update selected Client
    const itemId = match.url.replace("/clients/edit/", "");
    
    db.get(itemId).then( async (clientDbData:any) => {
      return db.put({
        ...clientDbData,
        ...data
      }).then( ()=>{
        try{
          dispatchSession({ type: "SET_LOADING", loading: true, loading_msg: "Subiendo datos..."});
          db.replicate.to(remoteDB).on('complete', function () {
            console.log('Local => RemoteDB, Ok!')
            dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
            history.goBack();
            alert('Se guardo el cliente!');
    
          }).on('error', function (err) {
            dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
            history.goBack();
            alert('Se guardo el cliente!, pero estas sin conexion...');
            throw new Error();
          });
        }
        catch(e){
          console.log(e);
        }
        
      })
    })
    
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar Cliente</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <ClientForm  onSubmit={onUpdate}/>
      </IonContent>
    </IonPage>
  );
};
