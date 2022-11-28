import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './GroupsHome.css';

const GroupsHome: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Grupos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Grupos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Grupos, sin actividad..." />
      </IonContent>
    </IonPage>
  );
};

export default GroupsHome;
