import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { MemberInArrears } from "../../reducer/MembersInArrears";
import { AppContext } from "../../store/store";
import { VisitsForm } from "./VisitsForm";

export const VisitsEdit: React.FC<RouteComponentProps> = ({ match, history }) => {
  
  const { dispatchSession } = useContext(AppContext);
  const [visit, setVisit] = useState<{
    _id: string;
    asisstStars: boolean[];
    harmonyStars: boolean[];
    punctualtStars: boolean[];
    completePayment: boolean;
    internalArrears: boolean;
    membersInArrears: MemberInArrears[];
    visits_pics: any[];
    contract_id: string;
    coordinates: [number, number];
    created_at: string;
    created_by: string;
  }>({
    _id: "",
    asisstStars: [],
    harmonyStars: [],
    punctualtStars: [],
    completePayment: false,
    internalArrears: false,
    membersInArrears: [],
    visits_pics: [],
    contract_id: "",
    coordinates: [0, 0],
    created_at: "",
    created_by: "",
  });

  const onSubmit = () => {
    history.goBack();
  };
  async function LoadData() {
    try {
      const visitId = match.url.split("/")[5];
      const visitItem:any = await db.get(visitId);
      
      setVisit(visitItem);
   } catch (e) {
      alert("No fue posible ver la visita");
    }
  }

  useEffect(() => {
    LoadData();
  }, []);

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
        <VisitsForm onSubmit={onSubmit} visitData={visit}/>
      </IonContent>
    </IonPage>
  );
};
