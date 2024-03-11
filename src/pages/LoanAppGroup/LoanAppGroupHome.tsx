import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonButton, IonItemDivider, IonLabel, useIonAlert, IonRefresher, IonRefresherContent, RefresherEventDetail, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, useIonLoading, IonItem, IonModal, IonSelect, IonInput, IonSelectOption } from "@ionic/react";
import { useContext, useState, useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router";

import { AppContext } from "../../store/store";
import { ContractsHome } from "../Contracts/ContractsHome";
import { db } from "../../db";
import { formatLocalCurrency } from "../../utils/numberFormatter";
import { LoanAppGroup } from "../../reducer/LoanAppGroupReducer";
import { Browser } from '@capacitor/browser';
import api from "../../api/api";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";



export const LoanAppGroupHome: React.FC<RouteComponentProps> = (props) => {

    const {  session }  = useContext( AppContext) ;
    const [loans, setLoans] = useState<LoanAppGroup[]>([]);
    const [present, dismiss] = useIonLoading();
    let render = true;
    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<HTMLIonInputElement>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [productId, setProductId] = useState<number>(0);
  


    async function LoadData(){

      present({message: 'Cargando solicitudes...'})
      
      db.createIndex({
        index: { fields: ["couchdb_type"] },
      }).then(function () {
        const clientId = props.match.url.split("/")[2];
        db.find({
          selector: {
            couchdb_type: "LOANAPP_GROUP",
            apply_by: clientId
          },
        }).then( async (data: any) => {
          //// once all docs are loaded, filter by ClientId
          const newData = data.docs.map( (i:LoanAppGroup) =>({
              ...i
          }));
          setLoans(newData);

          api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
          const apiRes = await api.get(`/products/hf?branchId=${session.branch[0]}&clientType=1`);
          
          setProducts( apiRes.data.map( (i:any) => ({
            GL_financeable: i.GL_financeable,
            liquid_guarantee: i.liquid_guarantee,    
            external_id: i.external_id,
            min_amount: i.min_amount,
            max_amount: i.max_amount,
            step_amount: i.step_amount,
            min_term: i.min_term,
            max_term: i.max_term,
            product_name: i.product_name,
            term_types: i.allowed_term_type,
            rate: i.rate,
            tax: i.tax
          })))

          dismiss();
          
        });
      });
    }


    function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
      setTimeout( async ()=>{
        await LoadData()
        event.detail.complete();  
      },1000) 
   }


   async function onPrintLoanApplications(e:any) {
    try{
      
      const loanAppId = e.target.id.split("-")[2];
      present({message: "Descargando pdf..."});
      api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;
      const apiRes = await api.get(`/docs/pdf/mujeres-de-palabra?loanId=${loanAppId}`);
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

  
   function getStatus(status: string) {
    switch (status) {
      case "PRESTAMO ACTIVO":
        return "ligth";
      case "NUEVO TRAMITE":
        return "medium";
      default:
        return "ligth";
    }
  }
  useEffect( ()=>{
    if( render) {
      render = false;
      LoadData();
    }
  },[]);


  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
    
  }
  
  async function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
      
    if (ev.detail.role === 'confirm') {
      /// creates the new Loan App

      const clientId = props.match.url.split("/")[2];
      const query = await db.find({
        selector: {
          couchdb_type: "LOANAPP_GROUP",
          apply_by: clientId
        }
      });
        const loanGroupActive:any = query.docs.find( (i:any) => i.estatus === 'ACEPTADO' && i.sub_estatus === 'PRESTAMO ACTIVO')
        const loanAppisNew = query.docs.find( (i:any) => i.estatus === 'TRAMITE' && i.sub_estatus === 'NUEVO TRAMITE')
        const productInfo: any = products.find( (i:any) => i.external_id == productId) ;
        

        if( !!loanGroupActive && !loanAppisNew ){
            const newId = Date.now().toString();
            const newLoanApp:any =  {
                ...loanGroupActive,
                _id: newId,
                apply_by: loanGroupActive.apply_by,
                apply_at: new Date().toISOString(),
                created_by: session.user,
                created_at: new Date().toISOString(),
                renovation: true,
                estatus: 'TRAMITE',
                sub_estatus: 'NUEVO TRAMITE',
                status: [1, "NUEVO TRAMITE"],
                dropout: [],
                coordinates: [0,0],
                product: {
                  GL_financeable: false,
                  liquid_guarantee: 10,
                  external_id: productInfo?.external_id,
                  min_amount: productInfo?.min_amount,
                  max_amount: productInfo?.max_amount,
                  step_amount: productInfo?.step_amount,
                  min_term: productInfo?.min_term,
                  max_term: productInfo?.max_term,
                  product_name: productInfo?.product_name,
                  term_types: productInfo?.term_types,
                  rate: productInfo?.rate,
                  tax: productInfo?.tax,
                }

            }
            delete newLoanApp._rev;                  
            db.put({
                ...newLoanApp
            }).then( async (doc)=>{
                await LoadData();
              }).catch( e =>{
                dismiss();
                console.log(e);
            })
      } else {
        alert('Solicitud en estatus: PRESTAMO ACTIVO no se encontro! o Ya existe un NUEVO TRAMITE')
      }
    }
  }


    return(
        <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/groups" />
            </IonButtons>
            <IonTitle>Solicitudes de Grupos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

          <IonList className="ion-padding">

            <IonItemDivider><IonLabel>Solicitudes</IonLabel></IonItemDivider>
                  {/* Lista de solicitudes */}
              {!loans.length ? <p>No hay solicitudes...</p> : <p></p>}
              {loans.map((i: LoanAppGroup, n) => (
                <IonCard
                  button={true}
                  color={getStatus(i.sub_estatus)}
                  key={n}
                >
                  <IonCardHeader>
                    <h1>{i.product.product_name}</h1>
                    <IonCardSubtitle>{i.sub_estatus}</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {formatLocalCurrency(i.apply_amount)} / {i.term} {i.frequency[1]}
                    <p>
                      {
                        i.sub_estatus === 'NUEVO TRAMITE' &&< IonButton color='success' id={`btn-printloanapp-${i._id}`} onClick={onPrintLoanApplications}>Imprimir</IonButton>
                      }
                      {
                        i.sub_estatus === 'NUEVO TRAMITE' &&<IonButton routerLink={`loanapps/edit/${i._id}`}>Editar</IonButton>
                      }
                    </p>
                  </IonCardContent>
                </IonCard>
              ))}

                <IonButton id="open-modal" color="light">Nueva Solicitud</IonButton>


            <IonItemDivider><IonLabel>Contratos Activos</IonLabel></IonItemDivider>
                  <ContractsHome {...props} />
          </IonList>


          <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Omitir</IonButton>
              </IonButtons>
              <IonTitle>Crear una nueva solictud de crédito</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()} disabled={!productId}>Ok</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <p>
                <i>¿Estas seguro de crear una nueva solicitud? <br/>
                  Con esta Acción estaras creando una nueva solictud con base 
                  en el credito anterior (estatus PRESTAMO ACTIVO)<br/>
                  Una vez creado, podrás depurar la renovación.
                </i>
              </p>
            </IonItem>

            <IonItem>
              <IonLabel>Elige el producto</IonLabel>
            <IonSelect
                value={productId}
                okText="Ok"
                cancelText="Cancelar"
                onIonChange={(e) => setProductId(e.detail.value)}
                >
                {products.map(  (c: any,n:number) => (
                    <IonSelectOption key={n} value={c.external_id}>
                    {c.product_name}
                    </IonSelectOption>
                ))}
                </IonSelect>              
            </IonItem>
              <IonInput ref={input} type="text" hidden/>
          </IonContent>
        </IonModal>

          
        </IonContent>
      </IonPage>
    );
}

