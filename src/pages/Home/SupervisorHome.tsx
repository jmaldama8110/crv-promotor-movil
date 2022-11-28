import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './SupervisorHome.css';

const SupervisorHome: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Supervisor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Supervisor</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Supervisor, sin actividad..." />
      </IonContent>
    </IonPage>
  );
};

export default SupervisorHome;
