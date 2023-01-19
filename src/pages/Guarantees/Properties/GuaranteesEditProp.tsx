import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";
import { Guarantee } from "../../../reducer/GuaranteesReducer";
import { GuaranteesFormProp } from "./GuaranteesFormProp";


export const GuaranteesEditProp:React.FC<RouteComponentProps> = ( props )=>{

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
            });
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
            { editItem && <IonTitle>Editar {editItem?.property.description}</IonTitle>}
            </IonToolbar>
      </IonHeader>
      <IonContent>
               { editItem && <GuaranteesFormProp property={editItem.property} onSubmit={onSubmit} {...props}/>}
      </IonContent>
    </IonPage>
    );
}