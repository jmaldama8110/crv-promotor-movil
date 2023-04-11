import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonTitle } from "@ionic/react";
import { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { db, dbX } from "../../db";
import { GeneralPhoto } from "../../hooks/useCameraTaker";
import { useDBSync } from "../../hooks/useDBSync";
import { MemberInArrears } from "../../reducer/MembersInArrearsReducer";

import { AppContext } from "../../store/store";
import { VisitsForm } from "./VisitsForm";

export const VisitsAdd: React.FC<RouteComponentProps> = ({ history, match})=>{

  const { dispatchSession, dispatchMembersInArrears, dispatchVisitQuizChecklist, session }  = useContext(AppContext);
  const { couchDBSyncUpload} = useDBSync();

    const onSubmit = async (data:any) =>{
      const contractId = match.url.split("/")[2];
      dispatchSession({ type: "SET_LOADING", loading_msg: "Guardando...", loading: true});
      try{
        
        await db.put({
          ...data,
          _id: Date.now().toString(),
          visits_pics: data.visits_pics.
                        map( (i:GeneralPhoto) => ({ _id: i._id , title: i.title })), /// saves skiping  base64str
          couchdb_type: "VISIT",
          contract_id: contractId,
          created_by: session.user,
          created_at: (new Date().toISOString()),
        });
        /// saves photos in a separeted DB
        // saves full array of pics
        await dbX.bulkDocs(data.visits_pics); 

        await couchDBSyncUpload();
        dispatchSession({ type: "SET_LOADING", loading_msg: "", loading: false});
        history.goBack();
        
      }
      catch(err){
        dispatchSession({ type: "SET_LOADING", loading_msg: "", loading: false});
        alert('No fue posible guardar la visita...')
      }

    }

    useEffect( ()=>{
      const contractId = match.url.split("/")[2];
      async function LoadContract() {
        
        try{
          const contractData:any = await db.get(contractId);
          if( contractData.tipo_contrato === "SIMPLE GRUPAL" || "CONSERVA TE ACTIVA"){
            // is a group visit
            const queryLoanApp = await db.find( { selector: { couchdb_type:"LOANAPP_GROUP"}});
            const loanApp:any =  queryLoanApp.docs.find( (i:any) => i.apply_by === contractData.client_id )
              if( !!loanApp && !!loanApp.members ){
                const membersInArrears: MemberInArrears[] = loanApp.members.map((i:MemberInArrears) =>({
                  _id: i._id,
                  client_id: i.client_id,
                  fullname: i.fullname,
                  arrears_amount: "",
                  is_in_arrears: false,
                }))
                dispatchMembersInArrears({type:"POPULATE_MEMBERS_INARREARS", data:membersInArrears});
                
            }
          }
          
          dispatchVisitQuizChecklist({ type: 'POPULATE_QUIZ', data: [
            { id: 1001, title: 'Metodologico', note:'', done: false },
            { id: 2001, title: 'Finanzas', note:'', done: false },
            { id: 3001, title: 'Medio Ambiente', note:'', done: false },
            { id: 4001, title: 'Salud', note:'', done: false },
            { id: 5001, title: 'Reconocimiento / Fidelizacion', note:'', done: false },
            { id: 6001, title: 'Otros: especificar...', note:'', done: false },
          ]})
        }
        catch(e){
          console.log(e);
          alert('Verifica que este Grupo / Cliente tenga una solicitud con integrantes..')
        }

      }
      LoadContract();

      return  ()=>{
        dispatchMembersInArrears({ type: "POPULATE_MEMBERS_INARREARS", data: []});
        dispatchVisitQuizChecklist({ type: "POPULATE_QUIZ",data: []});
      }
    },[])

    return (
        
        <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Registrar Visita</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <VisitsForm onSubmit={onSubmit}/>
        </IonContent>
        </IonPage>
    );
}

