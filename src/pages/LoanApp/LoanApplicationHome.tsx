import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { LoanAppCard } from "../../components/LoanAppCard";
import { db } from "../../db";


export const LoanApplicationHome: React.FC<RouteComponentProps> = (props) => {


  const onAddNew =  () =>{
    const clientId = props.match.url.split("/")[2];
    props.history.push(`/clients/${clientId}/loanapps/add`);
  }

  useEffect( ()=>{
    const clientId = props.match.url.split("/")[2];

    db.createIndex( {
      index: { fields: [ "couchdb_type"] }
     }).then( function (){
        db.find({
          selector: {
            couchdb_type: "LOANAPP"
          }
        }).then( (data:any) =>{
          
      })
     })

  },[])

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
