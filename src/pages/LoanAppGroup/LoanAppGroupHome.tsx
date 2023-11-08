import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonButton, IonItemDivider, IonLabel, useIonAlert, IonRefresher, IonRefresherContent, RefresherEventDetail, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, useIonLoading } from "@ionic/react";
import { useContext, useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";

import { AppContext } from "../../store/store";
import { ContractsHome } from "../Contracts/ContractsHome";
import { db } from "../../db";
import { formatLocalCurrency } from "../../utils/numberFormatter";
import { LoanAppGroup } from "../../reducer/LoanAppGroupReducer";
import { Browser } from '@capacitor/browser';
import api from "../../api/api";

export const LoanAppGroupHome: React.FC<RouteComponentProps> = (props) => {

    const {  session, dispatchSession }  = useContext( AppContext) ;
    const [showAlert] = useIonAlert();
    const [loans, setLoans] = useState<LoanAppGroup[]>([]);
    const [present, dismiss] = useIonLoading();
    let render = true;
    
    const onAddNew = async () =>{
            
      showAlert({
          header: 'IMPORTANTE',
          subHeader: '¿Estas seguro de registrar la solicitud de renovacion ahora?',
          message: `Una nueva solicitud para tramite sera creada con base en la informacion del contrato activo de este grupo`,
          buttons: [ { text: 'NO', role: 'cancel' }, { text: 'SI', role: 'confirm' }],
          onDidDismiss: async (e: CustomEvent) => {
            if( e.detail.role === 'confirm'){ /// only when the users ensures the OK action
              const clientId = props.match.url.split("/")[2];
              const query = await db.find({
                selector: {
                  couchdb_type: "LOANAPP_GROUP",
                  apply_by: clientId
                }
              });
              const loanGroupActive:any = query.docs.find( (i:any) => i.estatus === 'ACEPTADO' && i.sub_estatus === 'PRESTAMO ACTIVO')
                if( !!loanGroupActive ){
                  const newId = Date.now().toString();
                  const newLoanApp:any =  {
                      ...loanGroupActive,
                      _id: newId,
                      apply_by: loanGroupActive.apply_by,
                      apply_at: new Date().toISOString(),
                      created_by: session.user,
                      created_at: new Date().toISOString(),
                      estatus: 'TRAMITE',
                      sub_estatus: 'NUEVO TRAMITE',
                      status: [1, "NUEVO TRAMITE"],
                      dropout: [],
                      coordinates: [0,0]
                  }
                  delete newLoanApp._rev;
                  db.put({
                      ...newLoanApp
                  }).then( async (doc)=>{
                      props.history.push(`loanapps/edit/${newId}`);
                    }).catch( e =>{
                      console.log(e);
                  })
            } else{
              // alert('Solicitud en estatus: PRESTAMO ACTIVO no se encontro!')
              props.history.push('loanapps/add')
            }
            }
        }
      })


      
    }

    async function LoadData(){
      dispatchSession({ type:"SET_LOADING", loading_msg: "Cargando...", loading: true });
      db.createIndex({
        index: { fields: ["couchdb_type"] },
      }).then(function () {
        const clientId = props.match.url.split("/")[2];
        db.find({
          selector: {
            couchdb_type: "LOANAPP_GROUP",
            apply_by: clientId
          },
        }).then((data: any) => {
          //// once all docs are loaded, filter by ClientId
          const newData = data.docs.map( (i:LoanAppGroup) =>({
              ...i
          }))
          setLoans(newData);
          dispatchSession({ type:"SET_LOADING", loading_msg: "", loading: false });
          
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
  },[])

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

                <IonButton onClick={onAddNew} >Nuevo</IonButton>
            <IonItemDivider><IonLabel>Contratos Activos</IonLabel></IonItemDivider>
                  <ContractsHome {...props} />
          </IonList>
        </IonContent>
      </IonPage>
    );
}

