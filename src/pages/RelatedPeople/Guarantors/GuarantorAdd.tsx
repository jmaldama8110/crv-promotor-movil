import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";
import { useDBSync } from "../../../hooks/useDBSync";
import { RelatedPeople } from "../../../reducer/RelatedpeopleReducer";
import { AppContext } from "../../../store/store";
import { GuarantorForm } from "./GuarantorForm";

export const GuarantorAdd:React.FC<RouteComponentProps> = ( props )=>{

    const { session, dispatchRelatedPeople } = useContext(AppContext);
    const { couchDBSync } = useDBSync();

    const onAdd = async (data:any)=> {
        const client_id = props.match.url.split("/")[2];
        const guarantor:RelatedPeople = {
            _id: Date.now().toString(),
            couchdb_type: 'RELATED-PEOPLE',
            relation_type: "guarantor",
            client_id,
            created_by: session.user,
            created_at: new Date(),
            status: [1, "Pendiente"],
            ...data,
        }
        db.put({
            ...guarantor,
            ...data,
        }).then(async ()=>{
            dispatchRelatedPeople( {
                type: "ADD_RP",
                item: guarantor
            })
            await couchDBSync();
            props.history.goBack();
        }).catch( e =>{
            alert('No se pudo guardar informacion del Aval')
        })
    }
    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton />
            </IonButtons>
            <IonTitle>Solicitar Aval</IonTitle>
            </IonToolbar>
      </IonHeader>
      <IonContent>
                
                <GuarantorForm 
                onSubmit={onAdd}
                {...props}
                />
            </IonContent>
        </IonPage>
    );

}