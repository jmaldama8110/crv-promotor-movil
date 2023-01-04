import { IonButton, IonItem } from "@ionic/react";
import { useContext, useState } from "react";
import { Guarantee } from "../../../reducer/GuaranteesReducer";
import { AppContext } from "../../../store/store";


export const GuaranteesListProp = () => {
  const { guaranteesList } = useContext(AppContext);

  return (
    <div>
      {guaranteesList
        .filter((i: Guarantee) => i.guarantee_type === "property")
        .map((item: Guarantee) => (
          <IonItem routerLink={`/guarantees/property/edit/${item._id}`} key={item._id}>
            <IonButton color="light">Ver</IonButton>
            <p> {item.property.description}</p>
          </IonItem>
        ))}
    </div>
  );
};
