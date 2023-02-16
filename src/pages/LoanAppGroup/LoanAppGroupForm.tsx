import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { LoanAppGroupFormProduct } from "../../components/LoanAppGroupForm/LoanAppGroupFormProduct";
import { LoanAppGroupFormMembers } from "../../components/LoanAppGroupForm/LoanAppGroupFormMembers";
import { IonButton, IonList } from "@ionic/react";
import { ButtonSlider } from "../../components/SliderButtons";
import { LoanAppGroupFormSummary } from "../../components/LoanAppGroupForm/LoanAppGroupFormSummary";
import { LoanAppGroupFormGenerals } from "../../components/LoanAppGroupForm/LoanAppGroupFormGenerals";
import { AppContext } from "../../store/store";
import { useContext, useEffect } from "react";


export const LoanAppGroupForm: React.FC< {onSubmit:any}> = ( {onSubmit}) => {
 
  const { dispatchLoanAppGroup, loanAppGroup, dispatchGroupMember,dropoutMembers, groupMemberList, dispatchDropoutMembers } = useContext( AppContext );

  /** Product selection */
  function onProductNext (data:any) {
    
    dispatchLoanAppGroup({
      type: 'SET_LOAN_APP_GROUP',
      ...loanAppGroup,
      product:{
        ...data
      },
    })
  }

  /** General conditions */
  function onGeneralNext (data:any){
    dispatchLoanAppGroup({
      type: "SET_LOAN_APP_GROUP",
      ...loanAppGroup,
      ...data,
      members: groupMemberList,
      dropout: dropoutMembers
    })
  }


  function onMembersNext (){ 
    /// nothing to do, since members are manages by another state (GroupMembers)
  }


  function onSend() {
    dispatchLoanAppGroup( { type: 'RESET_LOAN_APP_GROUP'})
    dispatchGroupMember( { type:"POPULATE_GROUP_MEMBERS", data: []})
    dispatchDropoutMembers( { type: "POPULATE_DROPOUTS", data: []});

    onSubmit( loanAppGroup );
  }
  
  return (
    <Swiper spaceBetween={50} slidesPerView={1} allowTouchMove={false}>

      <SwiperSlide>
          <LoanAppGroupFormProduct onSubmit={onProductNext} />
      </SwiperSlide>
      <SwiperSlide>
          <LoanAppGroupFormGenerals onSubmit={onGeneralNext} />
      </SwiperSlide>
      
      <SwiperSlide>
        <LoanAppGroupFormMembers onSubmit={onMembersNext}/>

      </SwiperSlide>

      <SwiperSlide>
        <LoanAppGroupFormSummary />
        <IonList className='ion-padding'>
            <IonButton color="success" expand="block" onClick={onSend}>Guardar </IonButton>
            <ButtonSlider color="medium" expand="block" label="Anterior" onClick={() => {}} slideDirection={"B"} ></ButtonSlider>
        </IonList>

      </SwiperSlide>

    </Swiper>
  );
};
