import {
    IonContent,IonHeader,IonPage,IonToolbar,IonButtons,IonMenuButton,IonItem,IonCard,useIonLoading,IonSegment,IonSegmentButton,IonLabel,IonCardContent,IonCardHeader,IonCardSubtitle,IonCardTitle,IonButton, IonBackButton, IonTitle, } from "@ionic/react";
  import { useContext, useEffect, useState } from "react";
  import { RouteComponentProps } from "react-router";
  import api from "../../api/api";
//   import { PDFViewer } from "../../components/PDFViewer";
  import { AppContext } from "../../store/store";
//   import { base64toBlob } from "../../utils/base64toBlob";
  import { formatLocalDate,formatLocalDateShort } from "../../utils/numberFormatter";
  import { formatLocalCurrency } from "../../utils/numberFormatter";
  
  export const ContractDetail: React.FC<RouteComponentProps> = ({ match }) => {
    const { session } = useContext(AppContext);
    const [present, dismiss] = useIonLoading();
    const [cuotasInfo, setCuotasInfo] = useState([]);
    const [totalPendiente, setTotalPendiente] = useState<string>('0.0')
    const [status, setStatus] = useState('Al Corriente');
    const [statusColor, setStatusColor ] = useState('success');
    const [saldoActual, setSaldoActual] = useState('0.0');
    const [sucursal, setSucursal] = useState('');
    const [promotor, setPromotor] = useState('');
    const [plazo,setPlazo] = useState('');
    const [periodicidad, setPeriodicidad] = useState('');
    const [fechaLimitePago, setFechaLimitePago ] = useState('');
    const [fechaUltPago, setFechaUltPago ] = useState('');
    const [currSegment, setSegment] = useState<string>("resumen");

    // const [pdfDoc, setPdfDoc] = useState<string>('');
    
    let render = true;
  
    useEffect(() => {
      async function loadData() {
        present({ message: "Cargando estado de cuenta..." });
        try {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${session.current_token}`;
          const now = new Date();
          const contractIdUrl = match.url.split("/")[2];
          const apiRes = await api.get(
            `/clients/hf/accountstatement?contractId=${contractIdUrl}&dateFrom=2000-01-01&dateEnd=${now.toISOString()}`
          );
          const loanSummary = apiRes.data[0][0];
          /// arreglo con las cuotas y pagos amortizados
          const dataCuotas = apiRes.data[3].filter((i: any) => {
            const hoy = new Date();
            const expired = new Date(i.fecha_vencimiento);
            return expired < hoy;
          }).sort(evaluarOrdenNoPago);
  
          // recorre todo el arreglo para calcular todo lo que ya se vencio para pago
          let totalVencido = 0,
              totalPagado = parseFloat(loanSummary.capital_pagado + 
                                      loanSummary.interes_pagado +
                                      loanSummary.impuesto_pagado);
          let fUltimoPago='';
          //// Dado que el arreglo ya esta ordenado por No pago, debe recorrer de forma inversa
          //// para encontrar la fecha del pago completo mas reciente
          for(let i=(dataCuotas.length - 1); i >=0 ; i--){
              totalVencido = totalVencido + parseFloat(dataCuotas[i].total);
              if( dataCuotas[i].estatus === 'PAGADO' ) fUltimoPago = dataCuotas[i].fecha_pago;
          }
          const totalpending = totalVencido > totalPagado ? totalVencido - totalPagado: 0;
          setFechaUltPago(fUltimoPago);
          ////////////////////////////////////////////////////////
          setTotalPendiente(formatLocalCurrency(totalpending))
          setCuotasInfo(dataCuotas);
          setSaldoActual(formatLocalCurrency(parseFloat(loanSummary.saldo_capital_actual)));
          setSucursal(loanSummary.nombre_oficina);
          setPromotor(loanSummary.nombre_oficial);
          setPlazo(loanSummary.plazo_credito);
          setPeriodicidad(loanSummary.periodicidad);
          setFechaLimitePago(formatLocalDate(loanSummary.FechaLimitePago));
          if( loanSummary.dias_atraso > 7){
              setStatusColor('warning');
              setStatus('Atraso')
          }
          if( loanSummary.dias_atraso > 30){
              setStatusColor('danger');
              setStatus('Vencido')
          }
                  
          dismiss();

        } catch (error:any) {
          
          dismiss();
          alert("Error:"+error.message);
        }

    }
    if( render ){
      render = false;
      loadData();
    }

    }, []);



    async function onViewAccountStatement(){

    //   const contractId = match.url.replace("/contracts/", "");
    //   const now = new Date();
      
    // try{
    //     present( {message: 'Cargando Estado de Cuenta...'});
    //     const apiRes = await api.get(`/contract?contractId=${contractId}&dateFrom=2000-01-01&dateEnd=${now.toISOString()}`);
    //     const blob = base64toBlob(apiRes.data.base64File);
    //     const url = URL.createObjectURL(blob);    
    //     setPdfDoc(url);
    //     dismiss();
    // }
    // catch(e){
    //     dismiss();
    //     console.log(e);
    //     alert('No fue posible obtener el documento PDF solicitado')
    // }
      


    } 
  
    /// evaluador para ordenar por No de pago
    function evaluarOrdenNoPago (a:any,b:any){
      if( a.no < b.no) return 1;
      if( a.no > b.no) return -1;
      return 0;
    }
  
   
    return (
      <IonPage id="principal">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Detalles del contracto</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen id="principal">
          <IonSegment
            value={currSegment}
            onIonChange={(e) => setSegment(e.detail.value!)}
          >
            <IonSegmentButton value="resumen">
              <IonLabel>Resumen</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="movimientos">
              <IonLabel>Movimientos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="edocuenta">
              <IonLabel>Edo de Cuenta</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          {currSegment === "resumen" && (
            <div className="ion-padding">
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>Pago Pendiente:</IonCardSubtitle>
                  <IonCardTitle color={statusColor}>{totalPendiente}</IonCardTitle>
                  <IonCardSubtitle>Saldo del Credito:</IonCardSubtitle>
                  <IonCardTitle>{saldoActual}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Estatus: {status}</p>
                  <p>Fecha Limite: {fechaLimitePago}</p>
                  <p>Plazo: {plazo} {periodicidad}</p>
                  <p>Ultimo pago Completo: {fechaUltPago}</p>
                  <p>Sucursal: {sucursal}</p>
                  <p>Mi Asesor es: {promotor}</p>
                </IonCardContent>
              </IonCard>
            </div>
          )}
          {currSegment === "movimientos" && (
            <div className="ion-padding">
              <IonItem>
                <IonLabel>Fecha</IonLabel>
                <IonLabel>Importe</IonLabel>
                <IonLabel>Estatus</IonLabel>
                
              </IonItem>
              {   cuotasInfo.length ?
                  cuotasInfo.map((c: any, n) => (
                  <IonItem key={n}>
                    <IonLabel color='medium'>{ formatLocalDateShort(c.fecha_vencimiento)}</IonLabel>
                    <IonLabel color='medium'>{formatLocalCurrency(parseFloat(c.total))}</IonLabel>
                    <IonLabel color={c.estatus    === 'PAGADO'? 'medium': c.estatus === 'PARCIAL'? 'warning': 'danger' }>{c.estatus + ' >'} </IonLabel>
                    
                  </IonItem>
                
              )) : <IonItem><p>No tienes movimientos aun...</p></IonItem>
              }
            </div>
          )}
          {currSegment === "edocuenta" && (
            <div className="ion-padding">
                <p>Ver Estado de Cuenta Aqui</p>
              {/* { !pdfDoc && <IonButton onClick={onViewAccountStatement}>Ver Estado de Cuenta</IonButton>}
              <PDFViewer fileURL={pdfDoc}/> */}
            </div>
          )}
        </IonContent>
      </IonPage>
    );
  };
  