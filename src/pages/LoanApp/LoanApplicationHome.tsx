import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { LoanAppCard } from "../../components/LoanAppCard";

export const LoanApplicationHome: React.FC<RouteComponentProps> = (props) => {


  const onAddNew =  () =>{
    const clientId = props.match.url.split("/")[2];
    props.history.push(`/clients/${clientId}/loanapps/add`);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/clients" />
          </IonButtons>
          <IonTitle>Solicitudes de Credito</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList className="ion-padding">
                <LoanAppCard {...props} />
                <IonButton onClick={onAddNew}>Nueva Solicitud</IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
