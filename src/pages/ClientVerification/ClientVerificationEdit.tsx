import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonProgressBar, IonContent } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { AppContext } from "../../store/store";
import { ClientVerificationForm } from "./ClientVerificationForm";

export const ClientVerificationEdit: React.FC<RouteComponentProps> = ({ match, history})=>{

    const [progress, setProgress] = useState(0.25);
    const { dispatchSession, dispatchClientVerification, dispatchClientData } = useContext(AppContext);

    useEffect( ()=>{
      async function loadData(){
        const verificationId = match.url.split("/")[5];
        dispatchSession({ type: "SET_LOADING", loading_msg:"Cargando...", loading: true })
        const data:any = await db.get(verificationId);
        dispatchClientVerification({ type: "SET_CLIENT_VERIFICATION", verification: {...data} })
        dispatchSession({ type: "SET_LOADING", loading_msg:"", loading: false })

      }
      loadData();

      return ()=>{
        dispatchClientData({type: "RESET_CLIENT"});
        dispatchClientVerification({type:"RESET_CLIENT_VERIFICATION"});
      }
    },[])


    const onOkVerification = ()=>{
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
          <ClientVerificationForm onSetProgress={setProgress} onSubmit={onOkVerification}/>
        </IonContent>
      </IonPage>
    );
}