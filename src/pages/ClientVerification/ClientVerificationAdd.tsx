import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonProgressBar, IonContent } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { AppContext } from "../../store/store";
import { ClientVerificationForm } from "./ClientVerificationForm";

export const ClientVerificationAdd: React.FC<RouteComponentProps> = ({match,history })=>{

    const [progress, setProgress] = useState(0.25);
    const { dispatchClientData, dispatchClientVerification,session,dispatchSession} = useContext(AppContext);

    const { couchDBSyncUpload} = useDBSync()

    let render = true;
    
    useEffect( ()=>{
      async function LoadClientData(){
        dispatchSession({ type: "SET_LOADING", loading_msg: "Cargando...", loading: true});
        const clientId = match.url.split("/")[2];
        const ClientDataTmp:any = await db.get(clientId);
        
        dispatchClientData( { type:"SET_CLIENT", ...ClientDataTmp });
        dispatchSession({ type: "SET_LOADING", loading_msg: "", loading: false});
      }
      if( render ){
        render = false;
        LoadClientData()
      }

      return ()=>{
        dispatchClientData({type: "RESET_CLIENT"});
        dispatchClientVerification({type:"RESET_CLIENT_VERIFICATION"});
      }

    },[]);

    const onSaveVerification = async (data:any)=>{  
      try{
        dispatchSession({ type: "SET_LOADING", loading_msg: 'Guardando...', loading: true});
        const clientId = match.url.split("/")[2];
        await db.put({
          couchdb_type: "CLIENT_VERIFICATION",
          ...data,
          _id: Date.now().toString(),
          client_id: clientId,
          created_by: session.user,
          branch: session.branch,
          created_at: new Date(),
        });
     
        await couchDBSyncUpload();
      }
      catch(e:any){
        alert('Se presento un error:'+e.message);
      }
      dispatchSession({ type:"SET_LOADING", loading_msg: "", loading: false});
      history.goBack();

    }

    
    return (
        <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
              <IonProgressBar value={progress}></IonProgressBar>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <ClientVerificationForm onSetProgress={setProgress} onSubmit={onSaveVerification} />
        </IonContent>
      </IonPage>
    );
}

