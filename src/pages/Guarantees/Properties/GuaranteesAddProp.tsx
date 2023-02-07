import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";
import { useDBSync } from "../../../hooks/useDBSync";
import { Guarantee } from "../../../reducer/GuaranteesReducer";
import { AppContext } from "../../../store/store";
import { GuaranteesFormProp } from "./GuaranteesFormProp";

export const GuaranteeAddProp: React.FC<RouteComponentProps> = (props) => {

    const { session, dispatchGuaranteesList } = useContext(AppContext);
    const { couchDBSyncUpload } = useDBSync();

    const onAdd = async (data: any) => {
        const client_id = props.match.url.split("/")[2]
        const guaranteeItem: Guarantee = {
          _id: Date.now().toString(),
          couchdb_type: 'GUARANTEE',
          guarantee_type: 'property',
          client_id,
          created_by: session.user,
          created_at: new Date(),
          property: data.property
        }
        dispatchGuaranteesList( {
          type: "ADD_GUARANTEE",
          item: guaranteeItem
        })
        db.put({
            ...guaranteeItem,
            ...data
        }).then( async ()=>{
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
          <IonTitle>Agregar Propiedades</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <GuaranteesFormProp onSubmit={onAdd} {...props} />
      </IonContent>
    </IonPage>
  );
};
