import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";
import { Guarantee } from "../../../reducer/GuaranteesReducer";

import { GuaranteesFormVh } from "./GuaranteesFormVh";


export const GuaranteesEditVh:React.FC<RouteComponentProps> = ( props )=>{

    const [editItem, setEditItem] = useState<Guarantee>();

    useEffect( ()=>{
        const itemId = props.match.url.split("/")[6];
        db.get( itemId ).then( (data:any) =>{
            setEditItem( data );
        })
    },[]);

    const onSubmit = async (data:any) => {
        const itemId = props.match.url.split("/")[6];
        db.get(itemId).then( (guarantee:any) => {
            return db.put({
              ...guarantee,
              ...data,
              updated_at: Date.now()
            })
          })
          props.history.goBack();
    }

    return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton defaultHref="/guarantees" />
            </IonButtons>
            { editItem && <IonTitle>Editar {editItem!.vehicle.description}</IonTitle>}
            </IonToolbar>
      </IonHeader>
      <IonContent>
              { editItem &&   <GuaranteesFormVh vehicle={editItem.vehicle} onSubmit={onSubmit} {...props}/>}
      </IonContent>
    </IonPage>
    );
}