import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { LoanApplicationForm } from "./LoanApplicationForm";

import { db } from "../../db";
import { AppContext } from "../../store/store";
import { useContext } from "react";
import { useDBSync } from "../../hooks/useDBSync";

export const LoanApplicationAdd: React.FC<RouteComponentProps> = (props) => {

    
    const { session } = useContext(AppContext);
    const { couchDBSyncUpload } = useDBSync();
    
    const onAdd = async (data:any) =>{
        const clientId = props.match.url.split("/")[2];
        
        db.put({
            _id: Date.now().toString(),
            apply_by: clientId,
            apply_at: new Date(),
            created_by: session.user,
            status:[1, "Pendiente"],
            branch: session.branch,
            couchdb_type: "LOANAPP",
            ...data
          }).then( async (doc)=>{
              await couchDBSyncUpload();
              props.history.goBack();

            }).catch( e =>{
            alert('No se pudo guardar el dato del cliente')
          })
        
    }

    return(
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton />
            </IonButtons>
            <IonTitle>Nueva Solicitud</IonTitle>
            </IonToolbar>
      </IonHeader>
      <IonContent>
                <LoanApplicationForm 
                onSubmit={onAdd}
                {...props}
                />
            </IonContent>
        </IonPage>
    )

}
