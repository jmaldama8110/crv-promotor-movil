import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonButton, IonItemDivider, IonLabel } from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { LoanAppGroupCard } from "../../components/LoanAppGroupForm/LoanAppGroupCard";
import { AppContext } from "../../store/store";
import { ContractsHome } from "../Contracts/ContractsHome";

export const LoanAppGroupHome: React.FC<RouteComponentProps> = (props) => {

    const { dispatchLoanAppGroup, dispatchGroupMember }  = useContext( AppContext) ;
    const onAddNew =  () =>{
      dispatchGroupMember( { type: 'POPULATE_GROUP_MEMBERS', data:[]});
      dispatchLoanAppGroup( {type: 'RESET_LOAN_APP_GROUP'});
        props.history.push(`loanapps/add`);
    }

    return(
        <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/groups" />
            </IonButtons>
            <IonTitle>Solicitudes de Grupos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList className="ion-padding">
            <IonItemDivider><IonLabel>Solicitudes</IonLabel></IonItemDivider>
                  <LoanAppGroupCard {...props} />
                  <IonButton onClick={onAddNew}>Crear</IonButton>
            <IonItemDivider><IonLabel>Contratos Activos</IonLabel></IonItemDivider>
                  <ContractsHome {...props} />
          </IonList>
        </IonContent>
      </IonPage>
    );
}