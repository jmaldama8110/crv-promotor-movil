import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";
import { useDBSync } from "../../../hooks/useDBSync";
import { RelatedPeople } from "../../../reducer/RelatedpeopleReducer";
import { BeneficiariesForm } from "./BeneficiariesForm";


export const BeneficiariesEdit:React.FC<RouteComponentProps> = ( props )=>{


    const { couchDBSyncUpload } = useDBSync();
    const [editItem, setEditItem] = useState<RelatedPeople >({
        _id: "",
        client_id: "",
        couchdb_type: "RELATED-PEOPLE",
        relation_type: "beneficiary",
        created_at: new Date(),
        created_by: '',
        status: [1,"Pendiente"],
        name: "",
        lastname:"",
        second_lastname: "",
        fullname: "",
        relationship: "",
        percentage: ""
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
  

    const onSubmit = async (data:any) => {
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
    }

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
                <BeneficiariesForm beneficiary={editItem} onSubmit={onSubmit} {...props}/>
      </IonContent>
    </IonPage>
    );
}