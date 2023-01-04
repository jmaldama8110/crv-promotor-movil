import { IonButton, IonItem } from "@ionic/react";
import { useContext } from "react";
import { Guarantee } from "../../../reducer/GuaranteesReducer";
import { AppContext } from "../../../store/store";


export const GuaranteesListEq = () => {
  const { guaranteesList } = useContext(AppContext);

  return (
    <div>
      {guaranteesList
        .filter((i: Guarantee) => i.guarantee_type === "equipment")
        .map((item: Guarantee) => (
          <IonItem routerLink={`/guarantees/equipment/edit/${item._id}`} key={item._id}>
            <IonButton color="light">Ver</IonButton>
            <p> {item.equipment.description}</p>
          </IonItem>
        ))}
    </div>
  );
};
