import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, useIonLoading } from "@ionic/react";
import { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { AppContext } from "../../store/store";
import { LoanAppGroupForm } from "./LoanAppGroupForm";


export const LoanAppGroupEdit: React.FC<RouteComponentProps> = (props) => {

   
    const { dispatchLoanAppGroup, groupMemberList } = useContext(AppContext);
    const { couchDBSyncUpload } = useDBSync();
    useEffect( ()=>{

      const itemId = props.match.url.split("/")[5];
      db.get(itemId)
        .then( (loan:any) => {
          dispatchLoanAppGroup( {type: 'SET_LOAN_APP_GROUP', ...loan})
        })
        .catch((err) => {
          alert("No fue posible recuperar datos de la solicitud del grupo..: " + itemId);
        });
    },[])
    
    const onSave = async (data:any) => {
      const itemId = props.match.url.split("/")[5];

      db.get(itemId).then( async (loanInfo:any) => {
        return db.put({
          ...loanInfo,
          ...data,
          members: groupMemberList,
          updated_at: Date.now()
        }).then( async function(){
          await couchDBSyncUpload();
          props.history.goBack();
        })
      })
      
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
       <LoanAppGroupForm  onSubmit={onSave} />
      </IonContent>
    </IonPage>
  );
};
