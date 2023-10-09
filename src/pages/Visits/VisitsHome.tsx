import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { AppContext } from "../../store/store";
import { formatLocalDateShort } from "../../utils/numberFormatter";

export const VisitsHome: React.FC<RouteComponentProps> = ({
  history,
  match,
}) => {
  const [verificationsList, setVerificationsList] = useState<any[]>([]);
  const { dispatchSession } = useContext(AppContext);

  const onAddNew = () => {
    const contractId = match.url.split("/")[2];
    history.push(`/contracts/${contractId}/visits/add`);
  };
  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
      await loadData();
      event.detail.complete();
   }
   async function loadData() {
    try {
      const contractId = match.url.split("/")[2];
      
      const data = await db.find({ selector: { couchdb_type: "VISIT" } });
      const verifs = data.docs.filter((i: any) => i.contract_id === contractId);
      
      //// sets the list from most recent to oldest
      setVerificationsList(verifs.reverse());
    } catch (e) {
        alert("Error al leer visitas...");
    }
  }
  useEffect(() => {

  
    loadData();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton  />
          </IonButtons>
          <IonTitle>Visitas Regulares</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

        <IonList className="ion-padding">
          {verificationsList.map((i: any) => (
            <IonItem
              key={i._id}
              button
              routerLink={`visits/edit/${i._id}`}
            >
              <IonLabel>
                {i.created_by}, {formatLocalDateShort(i.created_at)}
              </IonLabel>
            </IonItem>
          ))}
          { !verificationsList.length && <IonItem><IonLabel>... no hay visitas</IonLabel></IonItem> }
        </IonList>
        <IonButton onClick={onAddNew} color="tertiary">
          Nueva Visita
        </IonButton>
      </IonContent>
    </IonPage>
  );
};
