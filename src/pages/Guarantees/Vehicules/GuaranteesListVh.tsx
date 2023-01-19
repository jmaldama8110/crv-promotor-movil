import { IonButton, IonItem } from "@ionic/react";
import { useContext } from "react";
import { Guarantee } from "../../../reducer/GuaranteesReducer";
import { AppContext } from "../../../store/store";

export const GuaranteesListVh = () => {
  const { guaranteesList } = useContext(AppContext);

  return (
    <div>
      { guaranteesList
        .filter((i: Guarantee) => i.guarantee_type === "vehicle")
        .map((item: Guarantee) => (
          <IonItem routerLink={`guarantees/vehicle/edit/${item._id}`} key={item._id}>
            <IonButton color="light">Ver</IonButton>
            <p> {item.vehicle.description}</p>
          </IonItem>
        ))}
    </div>
  );
};
