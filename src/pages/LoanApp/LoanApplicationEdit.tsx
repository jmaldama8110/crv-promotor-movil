import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, useIonLoading, useIonToast } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db, remoteDB } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { createAction } from "../../model/Actions";
import { AppContext } from "../../store/store";

import { LoanApplicationForm } from "./LoanApplicationForm";

export const LoanApplicationEdit: React.FC<RouteComponentProps> = (props) => {

    const [loan,setLoan] = useState({})
    const [showToast] = useIonToast();
    const { dispatchSession, session } = useContext(AppContext);
    const { couchDBSyncUpload } = useDBSync();

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
      dispatchSession({ type: "SET_LOADING", loading_msg: "Guardando...", loading: true})
      db.get(itemId).then( (loanInfo:any) => {
        return db.put({
          ...loanInfo,
          ...data,
          updated_at: Date.now()
        }).then(async ()=> {
          await createAction( "CREATE_UPDATE_LOAN", { id_loan: itemId}, session.user )
          await couchDBSyncUpload();
          dispatchSession({ type: "SET_LOADING", loading_msg: "", loading: false})
          props.history.goBack();
        })
      })

    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
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
