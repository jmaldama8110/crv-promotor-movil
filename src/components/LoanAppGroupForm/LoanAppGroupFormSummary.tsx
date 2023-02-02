import {
  IonCol,
  IonGrid,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/react";
import { useContext } from "react";
import { GroupMember } from "../../reducer/GroupMembersReducer";
import { AppContext } from "../../store/store";
import { formatLocalCurrency } from "../../utils/numberFormatter";


export const LoanAppGroupFormSummary: React.FC = () => {
  const { groupMemberList, loanAppGroup } = useContext(AppContext);


  return (
    <IonList className="ion-padding">
      <IonItemDivider>
        <IonLabel>Resumen de Informacion</IonLabel>
      </IonItemDivider>
      <IonGrid className="fuente-sm">
        <IonRow>
          <IonCol size="4">Producto:</IonCol>{" "}
          <IonCol>{`${loanAppGroup.product.product_name}`}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="4">Total Solicitado:</IonCol>{" "}
          <IonCol>{`${formatLocalCurrency(loanAppGroup.apply_amount)}`}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="4">Plazo:</IonCol>{" "}
          <IonCol>{`${loanAppGroup.term}, ${loanAppGroup.frequency[1]}`}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="4">Integrantes:</IonCol>{" "}
          <IonCol>{groupMemberList.length}</IonCol>
        </IonRow>

        <IonRow>
          <IonCol size="4">Coord Geo:</IonCol>{" "}
          <IonCol>
            {loanAppGroup.coordinates
              ? `${loanAppGroup.coordinates[0]}, ${loanAppGroup.coordinates[1]}`
              : ""}
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonItem><IonLabel>Integrantes</IonLabel></IonItem>
                        <IonGrid>
                            { groupMemberList.map((i:GroupMember)=> (
                                <IonRow key={i._id}><IonLabel className="xs">{formatLocalCurrency(parseFloat(i.apply_amount))}</IonLabel><IonLabel className="xs"> - {i.fullname.slice(0,20)} ({i.position.slice(0,1)}) </IonLabel></IonRow>) )
                              }

                        </IonGrid>
    </IonList>
  );
};
