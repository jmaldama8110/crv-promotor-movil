import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, useIonLoading } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db, remoteDB } from "../../db";
import { AppContext } from "../../store/store";

import { LoanApplicationForm } from "./LoanApplicationForm";

export const LoanApplicationEdit: React.FC<RouteComponentProps> = (props) => {

    const [loan,setLoan] = useState({})
    const [present, dismiss] = useIonLoading();
    const { dispatchSession } = useContext(AppContext);

    useEffect( ()=>{

      const itemId = props.match.url.split("/")[5];
      db.get(itemId)
        .then( (loan:any) => {
          db.get(loan.product).then( (prod) =>{
            const newData = {
              ...loan,
              product: prod
            }
            setLoan(newData);
          })
        })
        .catch((err) => {
          alert("No fue posible recuperar datos del cliente: " + itemId);
        });
    },[])
    
    const onSave = async (data:any) => {
      const itemId = props.match.url.split("/")[5];
      dispatchSession({ type: "SET_LOADING", loading: true, loading_msg: "Subiendo datos..."});
      db.get(itemId).then( (loanInfo:any) => {
        return db.put({
          ...loanInfo,
          ...data,
          updated_at: Date.now()
        }).then( function(){
          db.replicate.to(remoteDB).on('complete', function () {
            console.log('Local => RemoteDB, Ok!')
            dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
            props.history.goBack();    
          }).on('error', function (err) {
            console.log(err);
          });
        })
      })
      props.history.goBack();     
      alert('Se guardo la solicitud!')
      
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/guarantees" />
          </IonButtons>
          <IonTitle>Editar Mi Solicitud</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
       <LoanApplicationForm onSubmit={onSave} loanapp={loan} {...props} />
      </IonContent>
    </IonPage>
  );
};
