import {
  IonBackButton,IonButton,IonButtons,IonContent,IonHeader,IonLabel,IonPage,IonSegment,IonSegmentButton,IonTitle,IonToolbar } from "@ionic/react";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { RouteComponentProps } from "react-router";
import { GuaranteesListEq } from "./Equipment/GuaranteesListEq";
import { GuaranteesListVh } from "./Vehicules/GuaranteesListVh";
import { GuaranteesListProp } from "./Properties/GuaranteesListProp";
import { AppContext } from "../../store/store";
import { db } from "../../db";

export const GuaranteesHome :React.FC<RouteComponentProps> = ( props )=>{
  const [currSegment, setSegment] = useState<string>("vehicles");
  
  const { dispatchGuaranteesList } = useContext( AppContext);

  useEffect( ()=>{  

    db.createIndex( {
      index: { fields: ["couchdb_type"]}
    }).then( ()=>{
      db.find({
        selector: { couchdb_type: "GUARANTEE"}
      }).then( (data:any) =>{
        const clientId = props.match.url.split("/")[2]
        dispatchGuaranteesList({
          type:"POPULATE_GUARANTEES",
          data: data.docs.filter( (i:any) => i.client_id === clientId)
        })
      })
    })
  },[])


  const onAddEq = () =>{
    const itemId = props.match.url.split("/")[2]
    props.history.push(`/clients/${itemId}/guarantees/equipment/add`);
  }
  const onAddVh = () =>{
    const itemId = props.match.url.split("/")[2]
    props.history.push(`/clients/${itemId}/guarantees/vehicle/add`);
  }
  const onAddProp = () => {
    const itemId = props.match.url.split("/")[2]
    props.history.push(`/clients/${itemId}/guarantees/property/add`);
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/clients"/>
          </IonButtons>
          <IonTitle>Mis Garantias (Home)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSegment
          value={currSegment}
          onIonChange={(e) => setSegment(e.detail.value!)}
        >
          <IonSegmentButton value="vehicles">
            <IonLabel>Vehiculos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="properties">
            <IonLabel>Inmuebles</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="equipment">
            <IonLabel>Maquinaria</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {
        currSegment === "equipment" && 
        <div className="ion-padding texto-centrado">
          <GuaranteesListEq />
          <IonButton color='medium' className="margen-arriba" onClick={onAddEq}>Agregar</IonButton>
        </div>
        }
        {
        currSegment === "vehicles" && 
        <div className="ion-padding">
          <GuaranteesListVh />
          <IonButton color='medium' className="margen-arriba" onClick={onAddVh}>Agregar</IonButton>

        </div>
        }
                {
        currSegment === "properties" && 
        <div className="ion-padding">
          <GuaranteesListProp />
          <IonButton color='medium' className="margen-arriba" onClick={onAddProp}>Agregar</IonButton>

        </div>
        }

      </IonContent>
    </IonPage>
  );
};
