import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonProgressBar,
  IonContent,
  useIonLoading,
} from "@ionic/react";
import { useContext, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";
import { useDBSync } from "../../../hooks/useDBSync";
import { createAction } from "../../../model/Actions";
import { LoanAppGroup } from "../../../reducer/LoanAppGroupReducer";
import { AppContext } from "../../../store/store";
import { GroupImportImportForm } from "./GroupImportForm";

export const GroupImport: React.FC<RouteComponentProps> = ({ history }) => {
  const [progress, setProgress] = useState(0.33);
  const [ present, dismiss] = useIonLoading();
  const { session } = useContext(AppContext);
  const { couchDBSyncUpload } = useDBSync();


  async function getColonyIfExist( colonyId: string ){
    
    await db.createIndex( { index: { fields: ["couchdb_type"]}});
    const coloniesData = await db.find({ selector: { couchdb_type: 'NEIGHBORHOOD'}});

    const colony = coloniesData.docs.find((i: any) => i._id === colonyId)
    return colony;
  }

  async function loanAppExist(IdLoanApp: number){
     try{
      
        await db.createIndex( {index: { fields: ["couchdb_type"]}});
        const data = await db.find({selector: {
          couchdb_type: 'LOANAPP_GROUP'
        }})
         const loan = data.docs.find((i:any) => i.id_solicitud == IdLoanApp  )
         
        return !!loan;
     }
     catch(e){
      console.log(e);
      return false;
     }
  }
  async function contractNewExist(IdContract: number){
    try{
       await db.createIndex( {index: { fields: ["couchdb_type"]}});
       const data = await db.find({selector: {
         couchdb_type: 'CONTRACT'
       }})
        const contract = data.docs.find((i:any) => i.idContrato == IdContract  )

       return !!contract;
    }
    catch(e){
     console.log(e);
     return false;
    }
 }
 

  async function onOk(data: any) {
    try{
      present( { message: 'Guardando...'})
      const colony:any = await getColonyIfExist(data.group_data.address.colony[0]);

      /// crea el grupo, solo si no existe
      const newGroupId = !data.groupExistId ? Date.now().toString() : data.groupExistId;
      if (!data.groupExistId) {
          await 
          db.put({
            ...data.group_data,
            address: {
              ...data.group_data.address,
              post_code: colony ? colony.codigo_postal : "",
            },
            couchdb_type: "GROUP",
            _id: newGroupId,
            created_by: session.user,
            branch: session.branch,
            created_at: new Date(),
            status: [2, "Activo"],
          })
        }
        /// valida si esta solicitud, ya existe localmente
        const loanExist = await loanAppExist( data.loan_app.id_solicitud);
        if( !loanExist){
          const newLoanAppIdGrp = Date.now().toString()
          const newLoanApp: LoanAppGroup = {
            ...data.loan_app,
            members: data.membersHf,
            _id: newLoanAppIdGrp,
            dropout: [],
            apply_by: newGroupId,
            renovation: false,
            apply_at: new Date().toISOString(),
            created_by: session.user,
            created_at: new Date().toISOString(),
            branch: session.branch,
            couchdb_type: "LOANAPP_GROUP",
          };
          
          await db.put(newLoanApp);
        }
        ////
        if( data.createNewLoanApp ){
          const newLoanAppIdGrp = Date.now().toString()
          const newLoanApp: LoanAppGroup = {
            ...data.loan_app,
            members: data.membersHf,
            _id: newLoanAppIdGrp,
            dropout: [],
            apply_by: newGroupId,
            GL_financeable: false,
            liquid_guarantee: 10,
            renovation: true,
            apply_at: new Date().toISOString(),
            created_by: session.user,
            created_at: new Date().toISOString(),
            branch: session.branch,
            status: [1, "NUEVO TRAMITE"],
            estatus: "TRAMITE",
            sub_estatus: "NUEVO TRAMITE",
            couchdb_type: "LOANAPP_GROUP",
          };
          await db.put(newLoanApp);
          await createAction( "CREATE_UPDATE_LOAN" , 
          { 
            _id: '',
            id_loan: newLoanAppIdGrp,
            client_name: data.group_data.group_name,
            id_cliente: data.group_data.id_cliente,
            id_solicitud: data.loan_app.id_solicitud
           },
          session.user )

        }
      //// traer el prestamo ACTIVO para consultar saldo si es que no ha sido sincronizado
      const contractExist = await contractNewExist( data.contract.idContrato);
      if( !contractExist ){
        const newContract = 
            {
              ...data.contract,
              _id: Date.now().toString(),
              client_id: newGroupId,
              created_by: session.user,
              created_at: new Date().toISOString(),
              branch: session.branch,
              couchdb_type: "CONTRACT",
          }
          await db.put(newContract);
      }
      ////// Finally, puts ans Syncs

      await couchDBSyncUpload();
      dismiss();
      history.goBack();
  
    }
    catch(e){
      dismiss();
      alert('Hubo un problema...')
    }

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonProgressBar value={progress}></IonProgressBar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <GroupImportImportForm setProgress={setProgress} onSubmit={onOk} />
      </IonContent>
    </IonPage>
  );
};

