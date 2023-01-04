import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";
import { AppContext } from "../../../store/store";
import { GuaranteesFormEq } from "./GuaranteesFormEq";


export const GuaranteeAddEq:React.FC<RouteComponentProps> = ( props )=>{

    
    const { session, dispatchGuaranteesList } = useContext(AppContext);
    
    const onAdd = async (data: any) => {
        const client_id = props.match.url.split("/")[2]
        db.put({
            couchdb_type: 'GUARANTEE',
            guarantee_type: 'equipment',
            client_id,
            created_by: session.user,
            created_at: new Date(),
            _id: Date.now().toString(),
            ...data
        }).then( ()=>{
            
            props.history.goBack();
            alert('Se guardo informacion de la propiedad!');
        }).catch( e =>{
            alert('No se pudo guardar el dato de la propiedad')
        })
    };


    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton defaultHref="/guarantees" />
            </IonButtons>
            <IonTitle>Agregar Equipamiento</IonTitle>
            </IonToolbar>
      </IonHeader>
      <IonContent>
                
                <GuaranteesFormEq 
                onSubmit={onAdd}
                {...props}
                />
            </IonContent>
        </IonPage>
    );

}