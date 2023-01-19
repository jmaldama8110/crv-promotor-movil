import { IonButton, IonItem } from "@ionic/react";
import { useContext, useState } from "react";
import { RelatedPeople } from "../../../reducer/RelatedpeopleReducer";
import { AppContext } from "../../../store/store";

export const BeneficiariesList = () => { 

    const { relatedpeopleList } = useContext(AppContext);

    return (
        <div>
            {
            relatedpeopleList
            .filter( (i:RelatedPeople) => i.relation_type === 'beneficiary')
            .map( (item:RelatedPeople,n:number)=>             
            <IonItem routerLink={`related-people/beneficiaries/edit/${item._id}`} key={n}>
                <IonButton color="light">Ver</IonButton>
                <p> {item.fullname}</p>
            </IonItem>

            )
            }
        </div>
    );

}