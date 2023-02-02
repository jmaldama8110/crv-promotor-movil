import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";
import { useDBSync } from "../../../hooks/useDBSync";
import { RelatedPeople } from "../../../reducer/RelatedpeopleReducer";
import { AppContext } from "../../../store/store";
import { PersonalReferenceForm } from "./PersonalReferenceForm";

export const PersonalReferenceAdd:React.FC<RouteComponentProps> = ( props )=>{

    
    const { session} = useContext(AppContext);
    
    const { couchDBSync } = useDBSync();

    const onAdd = async (data:any)=> {
        
        const client_id = props.match.url.split("/")[2];
        const reference:RelatedPeople = {
            _id: Date.now().toString(),
            couchdb_type: 'RELATED-PEOPLE',
            relation_type: "reference",
            client_id,
            created_by: session.user,
            created_at: new Date(),
            status: [1, "Pendiente"],
            ...data,
        }
        db.put({
            ...reference,
            ...data,
        }).then( async ()=>{
            await couchDBSync();
            props.history.goBack();
        }).catch( e =>{
            alert('No se pudo guardar informacion de la Referencias personal')
        })
    }
    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton />
            </IonButtons>
            <IonTitle>Agregar Referencia</IonTitle>
            </IonToolbar>
      </IonHeader>
      <IonContent>
                
                <PersonalReferenceForm 
                onSubmit={onAdd}
                {...props}
                />
            </IonContent>
        </IonPage>
    );

}