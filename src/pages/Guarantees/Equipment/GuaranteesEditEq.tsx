import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import {  useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import api from "../../../api/api";
import { AppContext } from "../../../store/store";
import { GuaranteesFormEq } from "./GuaranteesFormEq";
import { Guarantee } from "../../../reducer/GuaranteesReducer";
import { db } from "../../../db";

export const GuaranteesEditEq:React.FC<RouteComponentProps> = ( props )=>{

    const [editItem, setEditItem] = useState<Guarantee>();

    useEffect( ()=>{
        const itemId = props.match.url.split("/")[6];
        db.get(itemId).then( (data:any) =>{
            setEditItem(data);
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
            { editItem && <IonTitle>Editar {editItem?.equipment.description}</IonTitle>}
            </IonToolbar>
      </IonHeader>
      <IonContent>
                <GuaranteesFormEq equipment={editItem?.equipment} onSubmit={onSubmit} {...props}/>
      </IonContent>
    </IonPage>
    );
}