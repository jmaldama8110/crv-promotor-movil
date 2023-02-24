import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from "@ionic/react";
import { VisitsForm } from "./VisitsForm";

export const VisitsEdit: React.FC = ()=>{

    const onSubmit = () =>{

    }

    return (
        <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Inspeccionar Visita</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <VisitsForm onSubmit={onSubmit}/>
        </IonContent>
        </IonPage>
    );
}