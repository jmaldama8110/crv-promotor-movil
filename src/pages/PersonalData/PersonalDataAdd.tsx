import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonLabel, IonInput } from "@ionic/react";
import { PersonalDataForm } from "./PersonalDataForm";

export const PersonalDataAdd = () => {

  async function onSave(){

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>        
          <IonTitle>Alta de Clientes</IonTitle>
          
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mis Clientes</IonTitle>
          </IonToolbar>
        </IonHeader>

        <PersonalDataForm onSave={onSave} />
 
      </IonContent>
    </IonPage>

  );
}