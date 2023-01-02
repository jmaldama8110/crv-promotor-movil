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
        .then((data) => {
          console.log(data);
          setLoan(data);
        })
        .catch((err) => {
          alert("No fue posible recuperar datos del cliente: " + itemId);
        });
    },[])
    HACER FUNCIONAR LA EDICION DEL LOAN EDIT
    LA FALLA ESTA EN QUE EL SERVICIO ORIGINAL DEVUELVE EL PRODUCTO COMPLETO,
    Y EN COUCHDB, HAY QUE RECUPERAR LA INFORMACION DEL PRODUCTO DE FORMA MANUAL
    const onSave = async (data:any) => {
     
      console.log(data);
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
