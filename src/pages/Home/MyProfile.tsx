import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import ExploreContainer from "../../components/ExploreContainer";


export const MyProfile: React.FC = () => {
 return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>My Profile</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen> 
    <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mi Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Mi Perfil, sin actividad..." />

    </IonContent>
</IonPage>
 );
}