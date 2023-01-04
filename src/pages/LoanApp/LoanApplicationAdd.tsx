import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { LoanApplicationForm } from "./LoanApplicationForm";

import { db } from "../../db";
import { AppContext } from "../../store/store";
import { useContext } from "react";

export const LoanApplicationAdd: React.FC<RouteComponentProps> = (props) => {

    const [presentLoading, dismissLoading] = useIonLoading();
    const { session } = useContext(AppContext);
    
    const onAdd = async (data:any) =>{
        const clientId = props.match.url.split("/")[2];
        console.log(data);        
        db.put({
            couchdb_type: 'LOANAPP',
            _id: Date.now().toString(),
            apply_by: clientId,
            apply_at: new Date(),
            created_by: session.user,
            status:[1, "Pendiente"],
            ...data
          }).then( (doc)=>{
            props.history.goBack();
            alert('Se guardo la solicitud de credito!');
          }).catch( e =>{
            alert('No se pudo guardar el dato del cliente')
          })
        
    }

    return(
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton defaultHref="/guarantees" />
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