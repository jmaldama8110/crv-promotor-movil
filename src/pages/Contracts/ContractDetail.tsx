import { IonContent,IonHeader,IonPage,IonToolbar,IonButtons,IonItem,IonCard,useIonLoading,IonSegment,IonSegmentButton,IonLabel,IonCardContent,IonCardHeader,IonCardSubtitle,IonCardTitle,IonButton, IonBackButton, IonTitle, IonInput, } from "@ionic/react";
import { useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import api from "../../api/api";
import PdfUrlViewer from "../../components/PdfViewer/PdfUrlViewer";
import { Browser } from '@capacitor/browser';

import { AppContext } from "../../store/store";

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
    const expiredPaymentNo = useRef<any>(0);

    const url = useRef<string>('');
    const [showPdf, setShowPdf] = useState(false);
    const [scale, setScale] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const windowRef = useRef<any>();
    
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

          //// Evalua el Plan para obtener las fechas vencidas ////
          const pPlan = apiRes.data[3];
          const expiredDates = pPlan.filter( (x:any) => {
            const fromDate = new Date(x.fecha_vencimiento);
            const now = new Date();
            return (fromDate.getTime() < now.getTime() )
          });
          if( expiredDates )
            expiredPaymentNo.current = expiredDates.length
          ///////////////////////////////////
          


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


    async function onOpenLinkPdf() {
      try{
        const contractIdUrl = match.url.split("/")[2];
        present({message: "Descargando pdf..."});
        const apiRes = await api.get(`/docs/pdf/account-statement?contractId=${contractIdUrl}`);
        const url = `${process.env.REACT_APP_BASE_URL_API}/${apiRes.data.downloadPath}`;
        await Browser.open({ url } );
        dismiss();
      }
      catch(error){
        console.log(error);
        dismiss();
        alert('Se presento un problema al intentar crear el archivo')
      }

    }


  async function onViewAccountStatement(){

    const contractId = match.url.split("/")[2];
    const now = new Date();
      
    try{
        present( {message: 'Cargando Estado de Cuenta...'});

        const apiRes = await api.get(`/docs/pdf/account-statement`);
        url.current = apiRes.data
        setShowPdf(true);
        dismiss();
    }
    catch(e){
        dismiss();
        console.log(e);
        alert('No fue posible obtener el documento PDF solicitado')
    }

    } 
  
    /// evaluador para ordenar por No de pago
    function evaluarOrdenNoPago (a:any,b:any){
      if( a.no < b.no) return 1;
      if( a.no > b.no) return -1;
      return 0;
    }
  
  
    const scrollToItem = () => {
      windowRef.current && windowRef.current.scrollToItem(page - 1, "start");
    };
   
    return (
      <IonPage id="principal">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Detalles del Contrato</IonTitle>
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
                  <IonCardSubtitle>Semana / Periodo:</IonCardSubtitle>
                  <IonCardTitle>{expiredPaymentNo.current} de {plazo} {periodicidad}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Saldo Capital: {saldoActual}</p>
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
              
              {!showPdf &&
                <>
                  <IonButton onClick={onViewAccountStatement} color='medium' disabled>Ver PDF</IonButton>
                  <IonButton onClick={onOpenLinkPdf} color='success' disabled>Abrir PDF</IonButton>
                </>
              }
              { showPdf &&
              <div>
                <div>
                  <IonInput value={page} onIonChange={(e:any) => setPage(e.detail.value)} />
                  <IonButton onClick={scrollToItem}>goto</IonButton>
                  <IonButton  onClick={() => setScale(v => v + 0.1)}>+</IonButton>
                  <IonButton onClick={() => setScale(v => v - 0.1)}>-</IonButton>
                </div>
                <br />
                <PdfUrlViewer url={url.current} scale={scale} windowRef={windowRef} />
              </div>}
            </div>
          )}
        </IonContent>
      </IonPage>
    );
  };
  