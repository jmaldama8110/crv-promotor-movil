import {
  IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    useIonAlert,
  } from "@ionic/react";
  import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";

import { db } from "../../db";
import { AppContext } from "../../store/store";
import { formatDate, formatLocalCurrency } from "../../utils/numberFormatter";

  export const ContractsHome: React.FC<RouteComponentProps> = ({match}) => {
    

    const [contracts, setContracts] = useState<any[]>([]);
    const { dispatchSession } = useContext(AppContext);
    const [showAlert] = useIonAlert();

    let render = true;
    useEffect(() => {
      
      async function loadData() {
        if( render) {
          render = false
          const clientId = match.url.split("/")[2];

          try{
            dispatchSession({ type: "SET_LOADING", loading_msg: "Cargando contratos...", loading: true});
            const prods = await db.find( { selector: { couchdb_type: "PRODUCT" }})
            const data:any = await db.find({ selector: { couchdb_type: "CONTRACT"}})
            
            const newData = data.docs.filter( (i:any) => i.client_id === clientId)
            
            const contractsData = newData.map( (i:any) =>{
              const prod:any = prods.docs.find( (x:any) => x.external_id == i.id_producto_maestro );

              return {
                _id: i._id,
                contractId: i.idContrato,
                productName: prod.product_name,
                clientName: i.nombreCliente,
                term: i.plazo,
                frequency: i.periodicidad,
                lastTrx: i.fechaUltimoPago,
                membersNumber:i.numeroMiembros,
                status: i.estatus,
                originalAmount: i.montoTotalAutorizado,
                repaymentAmt: i.montoReembolso,
                currentBalance: i.saldoActual,
              }
            })
            
            setContracts(contractsData);
            dispatchSession({ type: "SET_LOADING", loading_msg: "", loading: false});
          }
          catch(e){
            console.log(e);
            showAlert({
              header: ':( Oops! ocurrio un problema',
              subHeader: 'Al procesar la solicitud',
              message: `Se ha guardado un informe de error`,
              buttons: ['OK'],
            });
          }
        
          
        }
      }

      loadData();

  
    }, []);
  
  
    function getStatus(status: string) {
      switch (status) {
        case "DESEMBOLSADO":
          return "ligth";
        default:
          return "ligth";
      }
    }
  
    return (
      
      <div>
        {
          contracts.length ?
        contracts.map((i: any, n) => (
          <IonCard
            button={false}
            color={getStatus(i.status)}
            key={n}
            
          >
            <IonCardHeader>
              <h1>{i.clientName}</h1>
            </IonCardHeader>
            <IonCardContent>
              <p>Ultimo Pago: {formatDate(i.lastTrx)}</p>
              <p>Cuota: {formatLocalCurrency(i.repaymentAmt)}</p>
              <p>Saldo: {formatLocalCurrency(i.currentBalance)}</p>
              <p>
                {formatLocalCurrency(i.originalAmount)} / {i.term} {i.frequency}
              </p>
              
              <IonButton color='success' routerLink={`/contracts/${i._id}/visits`}>Visitas</IonButton>
              <IonButton color='warning' routerLink={`/contracts/${i.contractId}`}>Movimientos</IonButton>
              
            </IonCardContent>
          </IonCard>
        )) : <div><p>No tienes créditos activos...</p></div>
      }
        
      </div>
    );
  };
  