import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { AppContext } from "../../store/store";
import { ClientForm } from "./ClientForm";

export const ClientsAdd: React.FC<RouteComponentProps> = ( {history} ) => {
  
  const {  session,dispatchClientData } = useContext(AppContext);
  const [showToast] = useIonToast();
  const { couchDBSyncUpload }  = useDBSync();
  function onClientAdd (data: any){
    
    /// Save new record
    
    db.put({
      ...data,
      _id: Date.now().toString(),
      client_type:[2,'INDIVIDUAL'],
      loan_cycle: 0,
      status: [1,'Pendiente'],
      branch: session.branch,
    }).then( async (doc)=>{
        await couchDBSyncUpload();
        history.goBack();
    }).catch( e =>{
      showToast("NO se guardo el registro!",1500);
    })

    
  }
  useEffect( ()=>{
    return () =>{
      dispatchClientData({ type:"RESET_CLIENT" })
    }
  },[])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>        
          <IonTitle>Alta de Clientes</IonTitle>

        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mis Clientes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ClientForm onSubmit={onClientAdd} />
      </IonContent>
    </IonPage>
  );
};
