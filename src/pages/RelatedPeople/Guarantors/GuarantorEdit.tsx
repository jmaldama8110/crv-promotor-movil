import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  
} from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";
import { RelatedPeople } from "../../../reducer/RelatedpeopleReducer";

import { GuarantorForm } from "./GuarantorForm";


export const GuarantorEdit: React.FC<RouteComponentProps> = (props) => {
  const [editItem, setEditItem] = useState<RelatedPeople>({
    _id: "",
    client_id: "",
    couchdb_type: "RELATED-PEOPLE",
    relation_type: "guarantor",
    created_at: new Date(),
    created_by: '',
    status: [1,"Pendiente"],
    name: "",
    lastname:"",
    second_lastname: "",
    fullname: "",
    phone: "",
    phone_verified: false,
    curp: "",
    address: "",
    relationship: "",
    
  });
  
  let render = true;

  useEffect(() => {
    if( render ){    
      const itemId = props.match.url.split("/")[6];
      db.get(itemId).then( (data:any) =>{
          setEditItem(data);
      })
    }
     render = false;
  }, []);

  const onSubmit = async (data: any) => {

  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Editar {editItem.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <GuarantorForm guarantor={editItem} onSubmit={onSubmit} {...props} />
      </IonContent>
    </IonPage>
  );
};
