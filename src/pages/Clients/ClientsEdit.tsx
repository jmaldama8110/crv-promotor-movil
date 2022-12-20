import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { ClientsForm } from "./ClientsForm";

export const ClientsEdit: React.FC<RouteComponentProps> = ({ match,history }) => {
  const [clientInfo, setClientInfo] = useState<any>({});

  useEffect(() => {
      const itemId = match.url.replace("/clients/edit/", "");
      db.get(itemId)
        .then((data) => {
          setClientInfo(data);
        })
        .catch((err) => {
          alert("No fue posible recuperar el cliente: " + itemId);
        });
  }, []);

  const onUpdate = (data:any) => {
    // Update selected Client

    history.push('/clients')
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar Cliente</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <ClientsForm client={clientInfo} onSubmit={onUpdate} />
      </IonContent>
    </IonPage>
  );
};
