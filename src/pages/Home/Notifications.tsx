import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon} from "@ionic/react";
import {notificationsCircleOutline} from "ionicons/icons";



export const Notifications: React.FC = () => {
 return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle><IonIcon icon={notificationsCircleOutline} /> Notifications</IonTitle>
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