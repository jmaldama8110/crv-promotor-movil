import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, useIonLoading, useIonToast } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { createAction } from "../../model/Actions";
import { AppContext } from "../../store/store";

import { LoanApplicationForm } from "./LoanApplicationForm";

export const LoanApplicationEdit: React.FC<RouteComponentProps> = (props) => {

    const [loan,setLoan] = useState({})
    
    const { dispatchSession, session } = useContext(AppContext);
    const { couchDBSyncUpload } = useDBSync();
    let render = true;

    useEffect( ()=>{
        async function LoadData() {
          const itemId = props.match.url.split("/")[5];
          const loanData:any = await db.get(itemId);
          setLoan(loanData);
        }
        if( render) {
          render = false;
          LoadData();
        }
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
          const clientData:any = await db.get(loanInfo.apply_by);
          await createAction( "CREATE_UPDATE_LOAN",
          { 
            _id: '',
            id_loan: itemId,
            client_name: `${clientData.name} ${clientData.lastname} ${clientData.second_lastname}`,
            id_cliente: clientData.id_cliente,
            id_solicitud: clientData.id_solicitud
          },
           session.user )
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
