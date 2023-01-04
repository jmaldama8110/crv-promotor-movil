import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from "@ionic/react";

import { RouteComponentProps } from "react-router";
import { AppContext } from "../../../store/store";
import { GuaranteesFormVh } from "./GuaranteesFormVh";
import { db } from "../../../db";
import { useContext } from "react";

export const GuaranteeAddVh:React.FC<RouteComponentProps> = ( props )=>{

    
    const { session} = useContext(AppContext);

    const onAdd = async (data:any)=> {
        /// Save new record
        const client_id = props.match.url.split("/")[2]
        db.put({
            couchdb_type: 'GUARANTEE',
            guarantee_type: 'vehicle',
            client_id,
            created_by: session.user,
            created_at: new Date(),
            _id: Date.now().toString(),
            ...data
        }).then( ()=>{
            props.history.goBack();
            alert('Se guardo informacion del Vehiculo!');
        }).catch( e =>{
            alert('No se pudo guardar el dato del Vehiculo')
        })
 
    }
    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton defaultHref="/guarantees" />
            </IonButtons>
            <IonTitle>Agregar Vehiculos</IonTitle>
            </IonToolbar>
      </IonHeader>
      <IonContent>
                
                <GuaranteesFormVh 
                onSubmit={onAdd}
                {...props}
                />
            </IonContent>
        </IonPage>
    );

}