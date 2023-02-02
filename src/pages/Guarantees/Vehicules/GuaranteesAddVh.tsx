import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from "@ionic/react";

import { RouteComponentProps } from "react-router";
import { AppContext } from "../../../store/store";
import { GuaranteesFormVh } from "./GuaranteesFormVh";
import { db } from "../../../db";
import { useContext } from "react";
import { Guarantee } from "../../../reducer/GuaranteesReducer";
import { useDBSync } from "../../../hooks/useDBSync";

export const GuaranteeAddVh:React.FC<RouteComponentProps> = ( props )=>{

    
    const { session, dispatchGuaranteesList} = useContext(AppContext);
    const { couchDBSync } = useDBSync();

    const onAdd = async (data:any)=> {
        /// Save new record
        const client_id = props.match.url.split("/")[2]
        const guaranteeItem: Guarantee = {
            _id: Date.now().toString(),
            couchdb_type: 'GUARANTEE',
            guarantee_type: 'vehicle',
            client_id,
            created_by: session.user,
            created_at: new Date(),
            vehicle: data.vehicle
        }
        dispatchGuaranteesList( {
            type: "ADD_GUARANTEE",
            item: guaranteeItem
        })
        db.put({
            ...guaranteeItem,
            ...data
        }).then( async ()=>{
            await couchDBSync();
            props.history.goBack();
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