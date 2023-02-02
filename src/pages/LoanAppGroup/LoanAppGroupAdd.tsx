import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { RouteComponentProps } from "react-router";

import { db } from "../../db";
import { AppContext } from "../../store/store";
import { useContext } from "react";
import { LoanAppGroupForm } from "./LoanAppGroupForm";
import { LoanAppGroup } from "../../reducer/LoanAppGroupReducer";
import { useDBSync } from "../../hooks/useDBSync";

export const LoanAppGroupAdd: React.FC<RouteComponentProps> = (props) => {

    const { session,groupMemberList } = useContext(AppContext);
    const { couchDBSync } = useDBSync();
    
    const onAdd = async (data:any) =>{
        const clientId = props.match.url.split("/")[2];
        const newLoanAppGroup: LoanAppGroup = {
            ...data,
            members: groupMemberList,
            _id: Date.now().toString(),
            apply_by: clientId,
            apply_at: (new Date()).toISOString(),
            created_by: session.user,
            created_at: (new Date()).toISOString(),
            branch: session.branch,
            status:[1, "Pendiente"],
        }
        db.put({
            ...newLoanAppGroup
          }).then( async (doc)=>{
              await couchDBSync();
              props.history.goBack();
          }).catch( e =>{
            alert('No se pudo guardar la solicitud...')
          })
        
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
                <LoanAppGroupForm 
                onSubmit={onAdd}
                
                />
            </IonContent>
        </IonPage>
    )

}


