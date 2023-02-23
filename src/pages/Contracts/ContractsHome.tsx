import {
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
   
  /***
   *     {
        "idCliente": 311317,
        "idContrato": 275207,
        "id_producto_maestro": 1,
        "nombreCliente": "CIRUELAS",
        "numeroMiembros": 6,
        "Ciclo": 9,
        "montoTotalAutorizado": 45000,
        "plazo": 12,
        "periodicidad": "Catorcenal",
        "fechaPrimerPago": "2022-12-15T00:00:00.000Z",
        "fechaUltimoPago": "2023-05-18T00:00:00.000Z",
        "montoReembolso": 4815,
        "saldoActual": 32316.36,
        "SaldoEnMora": 3499.93,
        "SaldoInteres": 1133.68,
        "SaldoImpuesto": 181.39,
        "NoPagosVencidos": 1,
        "fechaProximoPago": "2023-02-09T00:00:00.000Z",
        "diasDeMora": 0,
        "idOficialCredito": 355168,
        "nombreOficialCredito": "CRISTHIAN ALEXANDER MOLINA AGUILAR",
        "provision": 0,
        "estatus": "DESEMBOLSADO",
        "fechaUltimoReembolso": "2023-01-26T00:00:00.000Z",
        "idOficina": 1,
        "nombreOficina": "ORIENTE",
        "idEstado": 1,
        "nombreEstado": "CHIAPAS ORIENTE",
        "RowNum": "1",
        "diasAtrasoAcumulados": 0,
        "Par 1": 0,
        "tipo_contrato": "SIMPLE GRUPAL"
    }
   * 
   */

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
            button={true}
            color={getStatus(i.status)}
            key={n}
            routerLink={`/contracts/${i.contractId}`}
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
            </IonCardContent>
          </IonCard>
        )) : <div><p>No tienes créditos activos...</p></div>
      }
        
      </div>
    );
  };
  