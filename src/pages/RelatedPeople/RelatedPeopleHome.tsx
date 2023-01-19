import {
  IonBackButton,IonButton,IonButtons,IonContent,IonHeader,IonLabel,IonPage,IonSegment,IonSegmentButton,IonTitle,IonToolbar, useIonLoading } from "@ionic/react";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { RouteComponentProps } from "react-router";

import { AppContext } from "../../store/store";
import { GuarantorList } from "./Guarantors/GuarantorList";
import { PersonalReferenceList } from "./References/PersonalReferenceList";
import { BeneficiariesList } from "./Beneficiaries/BeneficiariesList";
import { db } from "../../db";

export const RelatedPeopleHome :React.FC<RouteComponentProps> = ( props )=>{
  const [currSegment, setSegment] = useState<string>("avales");

  let render = true;

  const { dispatchRelatedPeople } = useContext(AppContext);

  useEffect( ()=>{  
    if( render ){
      db.createIndex( {
        index: { fields: ["couchdb_type"]}
      }).then( ()=>{
        db.find({
          selector: { 
            couchdb_type:'RELATED-PEOPLE'
          }
        }).then( (data:any) =>{
          const clientId = props.match.url.split("/")[2];
          dispatchRelatedPeople({
            type:"POPULATE_RP",
            data: data.docs.filter( (i:any) => i.client_id === clientId )
          });
          
          
        })
      })
  }
    render = false;
  },[])

  useEffect( ()=>{},[])

  const onAddGuarantor = () =>{
    props.history.push('related-people/guarantor/add');
  }
  const onAddPersonalReference = () =>{
    props.history.push('related-people/personalreference/add');
  }
  const onAddBeneficiaries = () => {
    props.history.push('related-people/beneficiaries/add');
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"/>
          </IonButtons>
          <IonTitle>Personas Relacionadas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSegment
          value={currSegment}
          onIonChange={(e) => setSegment(e.detail.value!)}
        >
          <IonSegmentButton value="avales">
            <IonLabel>Avales</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="referencias">
            <IonLabel>Referencias</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="beneficiarios">
            <IonLabel>Beneficiarios</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {
        currSegment === "avales" && 
        <div className="ion-padding texto-centrado">
          <GuarantorList />
          <IonButton color='medium' className="margen-arriba" onClick={onAddGuarantor}>Agregar</IonButton>
        </div>
        }
        {
        currSegment === "referencias" && 
        <div className="ion-padding">
          <PersonalReferenceList />
          <IonButton color='medium' className="margen-arriba" onClick={onAddPersonalReference}>Agregar</IonButton>

        </div>
        }
                {
        currSegment === "beneficiarios" && 
        <div className="ion-padding">
          <BeneficiariesList />
          <IonButton color='medium' className="margen-arriba" onClick={onAddBeneficiaries}>Agregar</IonButton>

        </div>
        }

      </IonContent>
    </IonPage>
  );
};
