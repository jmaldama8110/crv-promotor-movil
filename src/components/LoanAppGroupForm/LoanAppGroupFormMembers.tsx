import { IonAvatar, IonButton, IonItem, IonLabel, IonList } from "@ionic/react";
import { useContext, useEffect, useState } from "react";

import { GroupMember } from "../../reducer/GroupMembersReducer";
import { AppContext } from "../../store/store";
import { formatLocalCurrency } from "../../utils/numberFormatter";
import { ButtonSlider } from "../SliderButtons";
import avatar from '../../../src/assets/avatar.svg';

export const LoanAppGroupFormMembers: React.FC<{ onSubmit:any }> = ( { onSubmit }) => {

    const { groupMemberList, loanAppGroup, dispatchLoanAppGroup, dispatchGroupMember, dispatchMember } = useContext( AppContext);
    const [sumTotal, setSumTotal] = useState<number>(0)
    const [remaining, setRemaining] = useState<number>(loanAppGroup.apply_amount)

    function onSend() {

      onSubmit();
    }
    function onAutoFixLoanAmount() {

      dispatchLoanAppGroup({
        type:"SET_LOAN_APP_GROUP",
        ...loanAppGroup,
        members: groupMemberList,
        apply_amount: sumTotal
      })
    }

    function updateTotals() {
      let sum = 0, remain = 0;
      for (let i = 0; i < groupMemberList.length; i++){
        if( groupMemberList[i].estatus !== 'CANCELADO' )
        sum = sum + parseFloat(groupMemberList[i].apply_amount);
      }
      remain = loanAppGroup.apply_amount - sum;
      setSumTotal(sum);
      setRemaining(remain);
    }

    function getStyle (value: string){
      if( value === 'CANCELADO'|| value=== 'RECHAZADO')
        return { 
          textDecoration: 'line-through'
        }
      if(value === 'INGRESO' )
        return {
          color: 'green'
        }
      return {

      }
    }

    useEffect( ()=>{
      updateTotals();
      
    },[groupMemberList, loanAppGroup.apply_amount])

    useEffect( ()=>{
      
      if( loanAppGroup._id) {
        dispatchGroupMember({type:'POPULATE_GROUP_MEMBERS', data: loanAppGroup.members});

      }
    },[loanAppGroup])
    

    return (
        <IonList className="ion-padding">
          <IonItem>
            <IonLabel>
              <h1>Integrantes del Grupo</h1>
            </IonLabel>
          </IonItem>
          {
          groupMemberList.length ?
            groupMemberList.map((i: GroupMember) => (
            <IonItem key={i._id} button routerLink={ loanAppGroup._id ?`${loanAppGroup._id}/members/edit/${i._id}` : `add/members/edit/${i._id}`}>
              <IonAvatar slot="start">
                <img
                  alt="Perfil de usuario sin foto"
                  src={avatar}
                />
              </IonAvatar>
              <IonLabel style={ getStyle(i.estatus)}>{i.fullname}</IonLabel>            
            </IonItem>
           
          ))
          :
          <IonItem><IonLabel><p>...sin integrantes</p></IonLabel></IonItem>
        }
        <IonItem><IonLabel><h2>Total de Integrantes: {formatLocalCurrency(sumTotal)}</h2></IonLabel></IonItem>
        { remaining != 0 && sumTotal > 0 &&
          <IonItem>
            <IonLabel color={ remaining > 0 ? 'warning' : 'danger'}><h3>{ remaining > 0 ?"Faltante" :"Excedente"} {formatLocalCurrency(remaining)}</h3></IonLabel>
            <IonButton onClick={onAutoFixLoanAmount}>Corregir</IonButton>
            </IonItem>
        }

        <IonButton 
        color='success' 
        routerLink={  loanAppGroup._id ? `${loanAppGroup._id}/members/add` : 'add/members/add'} 
        onClick={ ()=> dispatchMember ({ type:"RESET_MEMBER"})}
         >+</IonButton>
        
          <ButtonSlider color="medium" expand="block" label="Siguiente" onClick={onSend} slideDirection={"F"} disabled={remaining != 0}></ButtonSlider>
          <ButtonSlider color="light" expand="block" label="Anterior" onClick={() => {}} slideDirection={"B"}></ButtonSlider>
        </IonList>

    );
}