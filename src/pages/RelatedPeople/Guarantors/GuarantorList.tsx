import { IonButton, IonItem } from "@ionic/react";
import { useContext } from "react";
import { RelatedPeople } from "../../../reducer/RelatedpeopleReducer";
import { AppContext } from "../../../store/store";

export const GuarantorList = () => { 

    const { relatedpeopleList } = useContext( AppContext)
    return (
        <div>
            {
            relatedpeopleList
            .filter( (i:RelatedPeople) =>(i.relation_type === 'guarantor'))
            .map( (item:RelatedPeople,n:number)=>             
                <IonItem routerLink={`related-people/guarantor/edit/${item._id}`} key={n}>
                <IonButton color="light">Ver</IonButton>
            <p>{`${item.fullname}`}</p>
      
          </IonItem>
      
            )
            }
        </div>
    );

}