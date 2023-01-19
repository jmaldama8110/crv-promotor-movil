import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../../db";
import { RelatedPeople } from "../../../reducer/RelatedpeopleReducer";
import { AppContext } from "../../../store/store";
import { BeneficiariesForm } from "./BeneficiariesForm";

export const BeneficiariesAdd:React.FC<RouteComponentProps> = ( props )=>{

    
    const { dispatchRelatedPeople, session } = useContext(AppContext);
    const [showToast] = useIonToast();

    const onAdd = async (data:any)=> {
        const client_id = props.match.url.split("/")[2];
        const beneficiary:RelatedPeople = {
            _id: Date.now().toString(),
            couchdb_type: 'RELATED-PEOPLE',
            relation_type: "beneficiary",
            client_id,
            created_by: session.user,
            created_at: new Date(),
            status: [1, "Pendiente"],
            ...data,
        }
        db.put({
            ...beneficiary,
            ...data,
        }).then( ()=>{
            dispatchRelatedPeople( {
                type: "ADD_RP",
                item: beneficiary
            })
            showToast("Informacion guardada!",1500);
            props.history.goBack();
        }).catch( e =>{
            alert('No se pudo guardar informacion del Aval')
        })

    }
    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton />
            </IonButtons>
            <IonTitle>Agregar Beneficiario</IonTitle>
            </IonToolbar>
      </IonHeader>
      <IonContent>
                
                <BeneficiariesForm 
                onSubmit={onAdd}
                {...props}
                />
            </IonContent>
        </IonPage>
    );

}