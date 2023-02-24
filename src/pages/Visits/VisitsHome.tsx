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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { AppContext } from "../../store/store";
import { formatDate } from "../../utils/numberFormatter";

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
  useEffect(() => {
    async function loadData() {
      try {
        dispatchSession({ type: "SET_LOADING", loading_msg: "Cargando visitas...", loading: true });
        const contractId = match.url.split("/")[2];
        console.log(contractId);
        const data = await db.find({ selector: { couchdb_type: "VISIT" } });
        const verifs = data.docs.filter((i: any) => i.contract_id === contractId);
        setVerificationsList(verifs);
        dispatchSession({ type: "SET_LOADING", loading_msg: "", loading: false });
      } catch (e) {
        dispatchSession({
          type: "SET_LOADING", loading_msg: "", loading: false });
          alert("Error al leer visitas...");
      }
    }
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
        <IonList className="ion-padding">
          {verificationsList.map((i: any) => (
            <IonItem
              key={i._id}
              button
              routerLink={`visits/edit/${i._id}`}
            >
              <IonLabel>
                {formatDate(i.created_at)} | {i.loanAmount}
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
