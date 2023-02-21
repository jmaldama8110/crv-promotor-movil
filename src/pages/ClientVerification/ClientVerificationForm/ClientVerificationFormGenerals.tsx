import {  IonItem, IonItemDivider, IonLabel, IonList } from "@ionic/react"
import { useContext, useEffect, useState } from "react";
import { ButtonSlider } from "../../../components/SliderButtons";
import { db } from "../../../db";
import { AppContext } from "../../../store/store";
import { formatLocalCurrency } from "../../../utils/numberFormatter";


export const ClientVerificationFormGenerals: React.FC<{ onNext:any, onSetProgress: any}> = ({onNext, onSetProgress})=>{

  const { dispatchSession,session, clientData, clientVerification } = useContext(AppContext);

    const [ clientInfo, setClientInfo] = useState<{
      id_cliente: number;
      fullname: string;
      countryOfBirth: string;
      nationality: string;
      maritalStatus: string;
      loanAmount: string;
      groupName:string;
    }>({id_cliente: 0, fullname: "",countryOfBirth:"", nationality:"", maritalStatus:"", loanAmount:"", groupName:""});
    
    
    let render = true;

    //// 1. Loads up the data
    useEffect( ()=>{

      async function loadClientData() {
        dispatchSession({ type: "SET_LOADING", loading_msg: "Datos personales...", loading: true});

        const allLoansGrpQuery:any = await db.find( { selector: { couchdb_type: "LOANAPP_GROUP"}});

        /// let membExist is undefined, Client has no group
        let membExist:any;
        let loanAppGrp:any;
        for( let i = 0; i< allLoansGrpQuery.docs.length; i ++) {
          loanAppGrp = allLoansGrpQuery.docs[i];
          const membs = allLoansGrpQuery.docs[i].members;
          membExist = membs.find( (x:any)=> x.id_cliente === clientData.id_cliente )
          if( membExist) break;
        }
        if( membExist ){
          const groupInfoQuery =  await db.find( { selector: { couchdb_type: "GROUP"}});
          const groupInfoTmp:any = groupInfoQuery.docs.find( (i:any) => i._id === loanAppGrp.apply_by);
          setClientInfo({
            id_cliente: clientData.id_cliente,
            fullname: `${clientData.name} ${clientData.lastname} ${clientData.second_lastname}`,
            countryOfBirth: clientData.country_of_birth[1],
            nationality: clientData.nationality[1],
            maritalStatus: clientData.marital_status[1],
            loanAmount: formatLocalCurrency(membExist.apply_amount),
            groupName: groupInfoTmp.group_name          })
        }
        dispatchSession({ type:"SET_LOADING", loading_msg:"", loading: false});

      }
      if( render ){
        render = false
        if( clientData._id ){ // when we are creating a new Verification, load data for general form
          loadClientData();          
        }

        

      }

    },[clientData]);

    useEffect( ()=>{
        if( clientVerification._id ){ /// Enter in Edit Mode
          setClientInfo({
            ...clientVerification
          })
        }

    },[clientVerification])

      /// 2. Sends the data back to the parent component
      function onSend( ){
        onSetProgress(0.50);
          onNext(clientInfo);
      }
    return (
      <IonList>
        <IonItemDivider><IonLabel>Datos Generales</IonLabel></IonItemDivider>
        <IonItem><IonLabel >Sucursal: {session.branch[1]}</IonLabel></IonItem>
        <IonItem><IonLabel >Grupo Solidario: {clientInfo.groupName}</IonLabel></IonItem>
        <IonItem><IonLabel >Monto Solicitado: {clientInfo.loanAmount}</IonLabel></IonItem>
        <IonItem><IonLabel >Promotor: {`${session.name} ${session.lastname}`}</IonLabel></IonItem>
        <IonItem><IonLabel >Nombre: {clientInfo.fullname}</IonLabel></IonItem>
        <IonItem><IonLabel >Pais de Nacimiento: {clientInfo.countryOfBirth}</IonLabel></IonItem>
        <IonItem><IonLabel >Nacionalidad: {clientInfo.nationality}</IonLabel></IonItem>
        <IonItem><IonLabel >Estado Civil: {clientInfo.maritalStatus}</IonLabel></IonItem>

        <p></p>
        <ButtonSlider label="Siguiente" color="primary" slideDirection="F" expand="block" onClick={onSend} disabled={!clientInfo.id_cliente}/>
      </IonList>
    );
}