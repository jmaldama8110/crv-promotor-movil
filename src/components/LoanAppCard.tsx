import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";

import { db } from "../db";
import { AppContext } from "../store/store";

import { formatLocalCurrency } from "../utils/numberFormatter";



export const LoanAppCard: React.FC<RouteComponentProps> = ({match}) => {

    const [loans, setLoans] = useState<any[]>([]);
    const { dispatchSession } = useContext(AppContext)
    let render = true;
    useEffect(() => {
      if (render) {
        render = false;
        dispatchSession({ type:"SET_LOADING", loading_msg: "Cargando...", loading: true });
        db.createIndex({
          index: { fields: ["couchdb_type"] },
        }).then(function () {
          db.find({
            selector: {
              couchdb_type: "LOANAPP",
            },
          }).then((data: any) => {
            //// once all docs are loaded, filter by ClientId
            const clientId = match.url.split("/")[2];
            const clientLoans = data.docs.filter(
              (i: any) => i.apply_by === clientId
            );
            const newData = clientLoans.map( (i:any) =>({
                ...i
            }))
            setLoans(newData);
            dispatchSession({ type:"SET_LOADING", loading_msg: "", loading: false });
  
            
          });
        });
  
  
      }
  
  
    }, []);
  
    function getStatus(status: number) {
      switch (status) {
        case 1:
          return "medium";
        case 2:
          return "warning";
        case 3:
          return "secondary";
        case 4:
          return "success";
        default:
          return "ligth";
      }
    }
  
    return (
      <div>
        {!loans.length ? <p>No hay solicitudes...</p> : <p></p>}
        {loans.map((i: any, n) => (
          <IonCard
            button={true}
            color={getStatus(i.status[0])}
            routerLink={`loanapps/edit/${i._id}`}
            key={n}
          >
            <IonCardHeader>
              <h1>{i.product.product_name}</h1>
              <IonCardSubtitle>{i.status[1]}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {formatLocalCurrency(i.apply_amount)} / {i.term} {i.frequency[1]}
            </IonCardContent>
          </IonCard>
        ))}
      </div>
    );
        
}