import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonLabel, IonInput, useIonLoading } from "@ionic/react";
import { PersonalDataForm } from "./PersonalDataForm";
import { RouteComponentProps } from "react-router";
import { useContext, useEffect } from "react";
import { db } from "../../db";
import { AppContext } from "../../store/store";
import { useDBSync } from "../../hooks/useDBSync";
import { ClientData } from "../../reducer/ClientDataReducer";

export const PersonalDataEdit: React.FC<RouteComponentProps> = ( { match, history}) => {

  const {  dispatchClientData, dispatchSession, session} = useContext(AppContext);
  const { couchDBSyncUpload } = useDBSync();
 
  async function onSave ( clientData: any){

    console.log(clientData);
    history.goBack();

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton  />
          </IonButtons>
          <IonTitle>Editar - Datos personales</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <PersonalDataForm onSave={onSave} />

      </IonContent>
    </IonPage>

  );
}