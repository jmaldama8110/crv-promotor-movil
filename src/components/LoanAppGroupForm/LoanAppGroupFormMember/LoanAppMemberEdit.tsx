import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from "@ionic/react";
import { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";

import { GroupMember } from "../../../reducer/GroupMembersReducer";
import { AppContext } from "../../../store/store";
import { LoanAppMemberForm } from "./LoanAppMemberForm";


export const LoanAppMemberEdit: React.FC<RouteComponentProps> = (props) => {

    const { dispatchMember, groupMemberList, dispatchGroupMember  } = useContext(AppContext);

    useEffect( ()=>{
        //// if edit, URL match string contains member _ID in a differnte position
        const urlData = props.match.url.split("/");
        const size = urlData.length
        const itemId = urlData[size - 1]
        
        const member = groupMemberList.find( (i:GroupMember) => i._id === itemId) as GroupMember
        console.log(member);
        dispatchMember( {
          type: "SET_MEMBER",
          member,
        })


    },[])
    
    
    const onSave = async (data:any) => {
      const urlData = props.match.url.split("/");
        const size = urlData.length
        const itemId = urlData[size - 1]
        
      dispatchGroupMember({ type:"UPDATE_GROUP_MEMBER", 
        idx: itemId,
        position: data. position,
        apply_amount: data.apply_amount,
        beneficiary: data.beneficiary,
        relationship: data.relationship,
        percentage: data.percentage,
        disbursment_mean: data.disbursment_mean
      })
      props.history.goBack();     
      
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Editar Integrante</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
       <LoanAppMemberForm  onSubmit={onSave} />
      </IonContent>
    </IonPage>
  );
};
