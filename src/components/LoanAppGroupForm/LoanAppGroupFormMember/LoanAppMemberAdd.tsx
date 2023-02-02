import { IonBackButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { db, remoteDB } from "../../../db";
import { GroupMember } from "../../../reducer/GroupMembersReducer";
import { AppContext } from "../../../store/store";
import { LoanAppMemberForm } from "./LoanAppMemberForm";

export const LoanAppMemberAdd: React.FC<RouteComponentProps> = (props) => {
  
  
  const { dispatchGroupMember } = useContext(AppContext);

  function onAdd (data: any){
    /// Save new record
    
    const item: GroupMember = {
      ...data,
      _id: Date.now().toString(),
    }

      dispatchGroupMember({ type: 'ADD_GROUP_MEMBER',item });
      props.history.goBack();
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Agregar integrante</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <LoanAppMemberForm onSubmit={onAdd} />
      </IonContent>
    </IonPage>
  );
};
