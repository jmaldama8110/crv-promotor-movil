import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useContext, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db, remoteDB } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";

import { AppContext } from "../../store/store";
import { GroupForm } from "./GroupForm";

export const GroupAdd: React.FC<RouteComponentProps> = (props) => {
  
  const { session } = useContext(AppContext);
  const { couchDBSync } = useDBSync();
  const [progress, setProgress] = useState(0.1);

  const onAdd = async (data: any) => {

    // Save new record
    db.put({
      couchdb_type: "GROUP",
      _id: Date.now().toString(),
      created_by: session.user,
      branch: session.branch,
      created_at: new Date(),
      status: [1, "Pendiente"],
      ...data,
    })
      .then(async (doc) => {
        await couchDBSync();
        props.history.goBack();
      })
      .catch((e) => {
        alert("No se pudo guardar el dato del cliente");
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
            <IonProgressBar value={progress}></IonProgressBar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <GroupForm onSubmit={onAdd} {...props} />
      </IonContent>
    </IonPage>
  );
};
