import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, useIonLoading } from "@ionic/react";
import { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { createAction } from "../../model/Actions";
import { AppContext } from "../../store/store";
import { LoanAppGroupForm } from "./LoanAppGroupForm";


export const LoanAppGroupEdit: React.FC<RouteComponentProps> = (props) => {

   
    const { dispatchLoanAppGroup, groupMemberList,dropoutMembers, dispatchSession, session } = useContext(AppContext);
    const { couchDBSyncUpload } = useDBSync();
    useEffect( ()=>{

      dispatchSession({ type: "SET_LOADING", loading_msg: 'Cargando...', loading: true });
      const itemId = props.match.url.split("/")[5];
      db.get(itemId)
        .then( (loan:any) => {
          dispatchLoanAppGroup( {type: 'SET_LOAN_APP_GROUP', ...loan})
          dispatchSession({ type: "SET_LOADING", loading_msg: '', loading: false });
        })
        .catch((err) => {
          alert("No fue posible recuperar datos de la solicitud del grupo..: " + itemId);
        });
    },[])
    
    const onSave = async (data:any) => {
      const itemId = props.match.url.split("/")[5];
      dispatchSession( { type: "SET_LOADING", loading_msg: 'Guardando...',loading: true});
      db.get(itemId).then( async (loanInfo:any) => {
        return db.put({
          ...loanInfo,
          ...data,
          members: groupMemberList,
          renovation: false,
          // dropout: dropoutMembers,
          updated_at: Date.now()
        }).then( async function(){
          await createAction( "CREATE_UPDATE_LOAN", { id_loan: itemId, hasDropouts: !!dropoutMembers.length }, session.user );
          await couchDBSyncUpload();
          //// actions for dropout members

           dispatchSession( { type: "SET_LOADING", loading_msg: '',loading: false});
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
       <LoanAppGroupForm  onSubmit={onSave} />
      </IonContent>
    </IonPage>
  );
};
