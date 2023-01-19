import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";



export const Notifications: React.FC = () => {
 return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Notifications</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notificaciones</IonTitle>
          </IonToolbar>
        </IonHeader>
        

    </IonContent>
</IonPage>
 );
}