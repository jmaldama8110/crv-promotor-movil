import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton, IonModal, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";


import { GroupMember } from "../../../reducer/GroupMembersReducer";
import { AppContext } from "../../../store/store";
import { LoanAppMemberForm } from "./LoanAppMemberForm";


export const LoanAppMemberEdit: React.FC<RouteComponentProps> = (props) => {

    const { dispatchMember,groupMember, groupMemberList,dispatchGroupMember  } = useContext(AppContext);

    let render = true;
    const [reasonTypes] = useState(["CANCELACION","RECHAZO","CASTIGO"])
    const [reasonType, setReasonType] = useState("CANCELACION");

    const [dropoutReasons, setDropoutReasons] = useState<any[]>([])
    const [dropoutReason, setDropoutReason] = useState<any>();

    const [reasons1, setReasons1] = useState([])
    const [reasons2, setReasons2] = useState([])
    const [reasons3, setReasons3] = useState([])

    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<HTMLIonInputElement>(null);

    function confirm() {
      modal.current?.dismiss(input.current?.value, 'confirm');
    }
      function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
      if (ev.detail.role === 'confirm') {
        
        //// what happens when confirm the Dropout?
        const urlData = props.match.url.split("/");
        const size = urlData.length
        const itemId = urlData[size - 1]

        const member = groupMemberList.find( (i:GroupMember) => i._id === itemId) as GroupMember

        const dropStatus = mapReasonTypeToStatus(reasonType);
        
        dispatchGroupMember({ type:"UPDATE_GROUP_MEMBER", 
          idx: itemId,
          position: member.position,
          apply_amount: member.apply_amount,
          estatus: dropStatus.estatus,
          sub_estatus: dropStatus.substatus,
          dropout_reason: dropStatus.dropout_reason as [number, string],
          disbursment_mean: member.disbursment_mean,
          percentage: member.insurance.percentage,
          beneficiary: member. insurance.beneficiary,
          relationship: member.insurance.relationship
        })
      props.history.goBack(); 
      }
    }

    function mapReasonTypeToStatus ( reasonType: string ){
      /*
          CANCELACION 
          estatus: CANCELADO
          substatus: CANCELACION/ABANDONO

          RECHAZO
          estatus: RECHAZADO
          substatus: RECHAZADO

          CASTIGO
          estatus: RECHAZADO
          substatus: CASTIGADO

       */
        switch( reasonType){
          case "CANCELACION": 
            return {
              estatus: "CANCELADO",
              substatus: "CANCELACION/ABANDONO",
              dropout_reason: [dropoutReason.id, dropoutReason.etiqueta]
            }
          case "RECHAZO":
            return {
              estatus: "RECHAZADO",
              substatus: "RECHAZADO",
              dropout_reason: [dropoutReason.id, dropoutReason.etiqueta]
            }
          case "CASTIGO":
            return {
              estatus: "RECHAZADO",
              substatus: "CASTIGADO",
              dropout_reason: [dropoutReason.id, dropoutReason.etiqueta]
            }
          default:
            return {
              estatus: "CANCELADO",
              substatus: "CANCELACION/ABANDONO",
              dropout_reason: [dropoutReason.id, dropoutReason.etiqueta]
            }
        }


    }

    useEffect( ()=>{
        //// if edit, URL match string contains member _ID in a differnte position
        const urlData = props.match.url.split("/");
        const size = urlData.length
        const itemId = urlData[size - 1]
        
        const member = groupMemberList.find( (i:GroupMember) => i._id === itemId) as GroupMember
        
        dispatchMember( {
          type: "SET_MEMBER",
          member,
        })

        async function LoadData(){
          const dropReason1:any = await db.find({ selector: { couchdb_type:"CATALOG", name: "CATA_MotivoBajaCastigado"}})
          setReasons1(dropReason1.docs);
          const dropReason2:any = await db.find({ selector: { couchdb_type:"CATALOG", name: "CATA_MotivoBajaCancelacion"}})
          setReasons2(dropReason2.docs);
          setDropoutReasons(dropReason2.docs)
          const dropReason3:any = await db.find({ selector: { couchdb_type:"CATALOG", name: "CATA_MotivoBajaRechazado"}})
          setReasons3(dropReason3.docs);
        }
        /// for the Dropout Reasons
        if( render) {
          render = false;
          LoadData();
          
        }


    },[])

    useEffect( ()=>{
      setDropoutReason(undefined)
        if (reasonType === 'CASTIGO')
          setDropoutReasons(reasons1);
        if( reasonType === 'CANCELACION')
          setDropoutReasons(reasons2);
        if( reasonType === 'RECHAZO' )
          setDropoutReasons(reasons3);
      
    },[reasonType])
    
    
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
        disbursment_mean: data.disbursment_mean,
        estatus: 'TRAMITE',
        sub_estatus: 'NUEVO TRAMITE',
        dropout_reason: [0,'']
      })
      props.history.goBack();     
      
    }


    function onClientVerifications (){
      // routerLink: `/clients/${clientId}/verifications` 
      const urlData = props.match.url.split("/");
      props.history.push(`/clients/${groupMember.client_id}/verifications`)
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
      <IonContent className="ion-padding">
       <LoanAppMemberForm  onSubmit={onSave} />

      
       <IonButton id="open-modal" expand="block" color='warning'>Baja Integrante</IonButton>
       <p></p>
       <IonButton expand="block" color='secondary' onClick={onClientVerifications}>Verificacion Ocular</IonButton>
      
        
       <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Omitir</IonButton>
              </IonButtons>
              <IonTitle>Motivo de Baja</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()} disabled={!dropoutReason}>Ok</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
            <IonSelect
                value={reasonType}
                okText="Ok"
                cancelText="Cancelar"
                onIonChange={(e) => setReasonType(e.detail.value)}
                >
                {reasonTypes.map(  (c: string,n:number) => (
                    <IonSelectOption key={n} value={c}>
                    {c}
                    </IonSelectOption>
                ))}
                </IonSelect>              
            </IonItem>
            <IonItem>
            <IonSelect
                value={dropoutReason}
                okText="Ok"
                cancelText="Cancelar"
                onIonChange={(e) => setDropoutReason(e.detail.value)}
                >
                {dropoutReasons.map(  (c: any,n:number) => (
                    <IonSelectOption key={n} value={c}>
                    {c.etiqueta}
                    </IonSelectOption>
                ))}
                </IonSelect>              
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Ingresa un comentario</IonLabel>
              <IonInput ref={input} type="text" placeholder="Comentario..." />
            </IonItem>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};
