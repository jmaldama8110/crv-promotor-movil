import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { LoanApplicationForm } from "./LoanApplicationForm";

import { db } from "../../db";
import { AppContext } from "../../store/store";
import { useContext } from "react";
import { useDBSync } from "../../hooks/useDBSync";
import { createAction } from "../../model/Actions";
import { ClientData } from "../../reducer/ClientDataReducer";

export const LoanApplicationAdd: React.FC<RouteComponentProps> = (props) => {

    
    const { session, dispatchSession } = useContext(AppContext);
    const { couchDBSyncUpload } = useDBSync();
    
    const onAdd = async (data:any) =>{
        const clientId = props.match.url.split("/")[2];
        
        dispatchSession({ type: "SET_LOADING", loading_msg: "Guardando...", loading: true})
        const newIdLoan = Date.now().toString();
        const clientInfo:ClientData = await db.get(clientId);
        console.log(clientInfo);
        console.log(data);

        const newLoanApp = {
            _id: newIdLoan,
            id_cliente: clientInfo.id_cliente,
            id_solicitud: 0,
            loan_officer: 0,
            branch: session.branch,
            id_producto: 0,
            id_disposicion: 0,
            
        }
        // await db.put({
        //     _id: newIdLoan,
        //     apply_by: clientId,
        //     apply_at: new Date(),
        //     created_by: session.user,
        //     status:[1, "Pendiente"],
        //     branch: session.branch,
        //     couchdb_type: "LOANAPP",
        //     ...data
        //   });
        
        // await createAction( "CREATE_UPDATE_LOAN",{ id_loan: newIdLoan }, session.user);
        // await couchDBSyncUpload();
        dispatchSession({ type: "SET_LOADING", loading_msg: "", loading: false})
        props.history.goBack();

    }

    return(
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton />
            </IonButtons>
            <IonTitle>Nueva Solicitud</IonTitle>
            </IonToolbar>
      </IonHeader>
      <IonContent>
                <LoanApplicationForm 
                onSubmit={onAdd}
                {...props}
                />
            </IonContent>
        </IonPage>
    )

}
