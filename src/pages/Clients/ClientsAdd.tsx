import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { ClientsForm } from "./ClientsForm";

export const ClientsAdd: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Alta de Clientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mis Clientes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ClientsForm />
      </IonContent>
    </IonPage>
  );
};
