import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, useIonLoading } from "@ionic/react";
import { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";

import { db } from "../db";

import { formatLocalCurrency } from "../utils/numberFormatter";

interface loanData {
    id: string;
    productName: string;
    productLogo: string;
    applyAmount: string;
    status: number;
    term: number;
    frequency: string;
}


export const LoanAppCard: React.FC<RouteComponentProps> = ({match}) => {
    const [presentLoading, dismissLoading] = useIonLoading();
    // const { loginInfo } = useContext(AppContext);
    const [loans, setLoans] = useState<loanData[]>([])

    useEffect( () => {
        
        db.createIndex( {
            index: { fields: [ "couchdb_type"] }
           }).then( function (){
              db.find({
                selector: {
                  couchdb_type: "LOANAPP",
                }
              }).then( (data:any) =>{
            //// once all docs are loaded, filter by ClientId
            const clientId = match.url.split("/")[2];
            const clientLoans = data.docs.filter( (i:any)=>(i.apply_by === clientId ))
            
            const newData = clientLoans.map( (x:any) => ({  id: x._id, 
                                                            applyAmount: x.apply_amount,
                                                            status: x.status[0],
                                                            term: x.term,
                                                            frequency: x.frequency[1]
                                                         }))
            setLoans(newData);
            })
        })

      }, []);

      function getStatus (status:number) {
        switch(status) {
            case 1: 
                return 'light';
            case 2:
                return 'warning';
            case 3: 
                return 'secondary'
            case 4: 
                return 'success';
            default:
                return 'ligth';
        }
        
      }

    return  (
        <div>
            {
                !(loans.length) ? <p>No hay solicitudes...</p> :<p></p>
            }        
        {
            loans.map( (i:loanData,n) =>
            <IonCard 
                button={true}
                color={ getStatus(i.status) }
                routerLink={`loanapps/edit/${i.id}`}
                key={n}>
                    {/* <img
                        src={`data:image/png;base64,${i.productLogo}`}
                    ></img> */}
                    <IonCardHeader>
                        <h1>Product Name</h1>
                    </IonCardHeader>
                    <IonCardContent>
                        {formatLocalCurrency(parseFloat(i.applyAmount)) } / {i.term} {i.frequency}
                    </IonCardContent>
            </IonCard>
                
            )
            
        }
        </div>
        );
        
}