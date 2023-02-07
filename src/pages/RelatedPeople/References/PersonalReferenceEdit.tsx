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
import { useDBSync } from "../../../hooks/useDBSync";
import { RelatedPeople } from "../../../reducer/RelatedpeopleReducer";
import { PersonalReferenceForm } from "./PersonalReferenceForm";

export const PersonalReferenceEdit: React.FC<RouteComponentProps> = (props) => {
  const [editItem, setEditItem] = useState<RelatedPeople>({
    _id: "",
    client_id: "",
    couchdb_type: "RELATED-PEOPLE",
    relation_type: "reference",
    created_at: new Date(),
    created_by: '',
    status: [1,"Pendiente"],
    name: "",
    lastname:"",
    second_lastname: "",
    fullname: "",
    phone: "",
    phone_verified: false,
    relationship: "",
    
  });
  
  let render = true;
  const { couchDBSyncUpload } = useDBSync();

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
    const itemId = props.match.url.split("/")[6];
    db.get(itemId).then( (doc:any) => {
        return db.put({
          ...doc,
          ...data,
          updated_at: Date.now()
        }).then( async ()=>{
            await couchDBSyncUpload();
            props.history.goBack();
        })
      })
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
        <PersonalReferenceForm personref={editItem} onSubmit={onSubmit} {...props} />
      </IonContent>
    </IonPage>
  );
};