import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, useIonLoading } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";

import { LoanApplicationForm } from "./LoanApplicationForm";

export const LoanApplicationEdit: React.FC<RouteComponentProps> = (props) => {

    const [loan,setLoan] = useState({})
    const [present, dismiss] = useIonLoading();

    useEffect( ()=>{

      const itemId = props.match.url.split("/")[5];
      db.get(itemId)
        .then( (loan:any) => {

          db.get(loan.product).then( (prod) =>{
            
            const newData = {
              ...loan,
              product: prod
            }
            setLoan(newData);
          })
        })
        .catch((err) => {
          alert("No fue posible recuperar datos del cliente: " + itemId);
        });
    },[])
    
    const onSave = async (data:any) => {
      const itemId = props.match.url.split("/")[5];
      db.get(itemId).then( (loanInfo:any) => {
        return db.put({
          ...loanInfo,
          ...data,
          updated_at: Date.now()
        });
      })
      props.history.goBack();     
      alert('Se guardo la solicitud!')
      
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/guarantees" />
          </IonButtons>
          <IonTitle>Editar Mi Solicitud</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <LoanApplicationForm onSubmit={onSave} loanapp={loan} {...props} />
      </IonContent>
    </IonPage>
  );
};
