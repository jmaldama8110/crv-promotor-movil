import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";

import { AppContext } from "../../store/store";
import { GroupForm } from "./GroupForm";

export const GroupAdd: React.FC<RouteComponentProps> = (props) => {
  const { dispatchRelatedPeople, session } = useContext(AppContext);
  const [showToast] = useIonToast();

  const onAdd = async (data: any) => {
    /// Save new record
    db.put({
      couchdb_type: "CLIENT",
      _id: Date.now().toString(),
      status: [1, "Pendiente"],
      ...data,
    })
      .then((doc) => {
        props.history.goBack();
        alert("Se guardo el cliente!");
      })
      .catch((e) => {
        alert("No se pudo guardar el dato del cliente");
      });

    console.log(data);
    
    // const client_id = props.match.url.split("/")[2];
    // const beneficiary:RelatedPeople = {
    //     _id: Date.now().toString(),
    //     couchdb_type: 'RELATED-PEOPLE',
    //     relation_type: "beneficiary",
    //     client_id,
    //     created_by: session.user,
    //     created_at: new Date(),
    //     status: [1, "Pendiente"],
    //     ...data,
    // }
    // db.put({
    //     ...beneficiary,
    //     ...data,
    // }).then( ()=>{
    //     dispatchRelatedPeople( {
    //         type: "ADD_RP",
    //         item: beneficiary
    //     })
    //     showToast("Informacion guardada!",1500);
    //     props.history.goBack();
    // }).catch( e =>{
    //     alert('No se pudo guardar informacion del Aval')
    // })
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Grupo Nuevo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <GroupForm onSubmit={onAdd} {...props} />
      </IonContent>
    </IonPage>
  );
};
