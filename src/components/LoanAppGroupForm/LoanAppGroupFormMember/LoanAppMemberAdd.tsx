import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";

import { GroupMember } from "../../../reducer/GroupMembersReducer";
import { AppContext } from "../../../store/store";
import { LoanAppMemberForm } from "./LoanAppMemberForm";

export const LoanAppMemberAdd: React.FC<RouteComponentProps> = (props) => {
  
  
  const { dispatchGroupMember,groupMemberList } = useContext(AppContext);

  function onAdd (data: any){

    const itemData: GroupMember = {
      apply_amount:  parseInt(data.apply_amount),
      approved_amount: data.apply_amount,
      client_id: data.client_id,
      disbursment_mean: data.disbursment_mean,
      estatus: "INGRESO",
      sub_estatus: "NUEVO",
      dropout_reason: [0,''],
      fullname: data.fullname,
      id_cliente: data.id_cliente,
      id_member: 0,
      id_persona: data.id_persona,
      curp: data.curp,
      insurance: {
        id: Date.now(),
        beneficiary: data.beneficiary,
        relationship: data.relationship,
        percentage: data.percentage
      },
      loan_cycle: data.loan_cycle,
      position: data.position,
      previous_amount: '0',
      _id: groupMemberList.length.toString(),
    }
    
    dispatchGroupMember( { type: "ADD_GROUP_MEMBER", item: itemData })
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
