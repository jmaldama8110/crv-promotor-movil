import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";

import { GroupMember } from "../../../reducer/GroupMembersReducer";
import { AppContext } from "../../../store/store";
import { LoanAppMemberForm } from "./LoanAppMemberForm";
import { NewMembersType } from "../../../reducer/NewMembersReducer";

export const LoanAppMemberAdd: React.FC<RouteComponentProps> = (props) => {
  
  
  const { dispatchNewMembers } = useContext(AppContext);

  function onAdd (data: any){
    /// Save new record

    const item: NewMembersType = {
          ...data,
          _id: Date.now().toString(),
    }
    
    // const item2: GroupMember = {
    //   ...data,
    //   _id: Date.now().toString(),
    // }
    dispatchNewMembers({ type: "ADD_NEW_MEMBER",item });
    // dispatchGroupMember( { type: "ADD_GROUP_MEMBER", item: item2 })
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
