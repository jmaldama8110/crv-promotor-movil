import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db, dbX } from "../../../db";
import { GeneralPhoto } from "../../../hooks/useCameraTaker";
import { useDBSync } from "../../../hooks/useDBSync";
import { Guarantee } from "../../../reducer/GuaranteesReducer";
import { GuaranteesFormProp } from "./GuaranteesFormProp";


export const GuaranteesEditProp:React.FC<RouteComponentProps> = ( props )=>{

    const [editItem, setEditItem] = useState<Guarantee>();
    const { couchDBSyncUpload } = useDBSync();

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
              property: {
                ...data.property,
                photos: data.property.photos.map( (i:GeneralPhoto) => ({ _id: i._id , title: i.title })), /// saves skiping  base64str
              },
              updated_at: Date.now()
            }).then( async ()=>{
                await dbX.bulkDocs(data.property.photos);
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