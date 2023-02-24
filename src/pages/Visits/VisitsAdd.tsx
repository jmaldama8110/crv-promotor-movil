import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonTitle } from "@ionic/react";
import { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { MemberInArrears } from "../../reducer/MembersInArrears";

import { AppContext } from "../../store/store";
import { VisitsForm } from "./VisitsForm";

export const VisitsAdd: React.FC<RouteComponentProps> = ({ history, match})=>{

  const { dispatchSession, dispatchMembersInArrears }  = useContext(AppContext);
  const { couchDBSyncUpload} = useDBSync();

    const onSubmit = async (data:any) =>{
      const contractId = match.url.split("/")[2];
      dispatchSession({ type: "SET_LOADING", loading_msg: "Guardando...", loading: true});
      try{
        console.log(data);
        await db.put({
          ...data,
          _id: Date.now().toString(),
          couchdb_type: "VISIT",
          contract_id: contractId,
        })

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
      async function LoadContract(){
        dispatchSession({ type: "SET_LOADING", loading_msg: "Cargando...", loading: true});
        const contractData:any = await db.get(contractId);
        if( contractData.tipo_contrato === "SIMPLE GRUPAL"){
          // is a group visit
          const queryLoanApp = await db.find( { selector: { couchdb_type:"LOANAPP_GROUP"}});
          const loanApp:any =  queryLoanApp.docs.find( (i:any) => i.apply_by === contractData.client_id )
          const membersInArrears: MemberInArrears[] = loanApp.members.map((i:MemberInArrears) =>({
                _id: i._id,
                client_id: i.client_id,
                fullname: i.fullname,
                arrears_amount: "",
                is_in_arrears: false,
          }))
          dispatchMembersInArrears({type:"POPULATE_MEMBERS_INARREARS", data:membersInArrears})
        }else{
          // individual visit

        }
        dispatchSession({ type: "SET_LOADING", loading_msg: "", loading: false});

      }
      LoadContract();

      return  ()=>{
        dispatchMembersInArrears({ type: "POPULATE_MEMBERS_INARREARS", data: []})
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

