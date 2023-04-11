import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { db, dbX } from "../../../db";
import { AppContext } from "../../../store/store";
import { GuaranteesFormEq } from "./GuaranteesFormEq";
import { Guarantee } from '../../../reducer/GuaranteesReducer';
import { useDBSync } from "../../../hooks/useDBSync";
import { GeneralPhoto } from "../../../hooks/useCameraTaker";


export const GuaranteeAddEq:React.FC<RouteComponentProps> = ( props )=>{

    
    const { session, dispatchGuaranteesList } = useContext(AppContext);
    const { couchDBSyncUpload } = useDBSync();
    
    const onAdd = async (data: any) => {
        const client_id = props.match.url.split("/")[2];
        const guaranteeItem: Guarantee = {
            _id: Date.now().toString(),
            couchdb_type: 'GUARANTEE',
            guarantee_type: 'equipment',
            client_id,
            created_by: session.user,
            created_at: new Date(),
            equipment: {
                ...data.equipment,
                photos: data.equipment.photos.map( (i:GeneralPhoto) => ({ _id: i._id , title: i.title })), /// saves skiping  base64str
              },
        }
        dispatchGuaranteesList({
            type: "ADD_GUARANTEE",
            item: guaranteeItem
        })
        db.put({
            ...data,
            ...guaranteeItem,
        }).then( async ()=>{
            await dbX.bulkDocs(data.equipment.photos);
            await couchDBSyncUpload();
            props.history.goBack();
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