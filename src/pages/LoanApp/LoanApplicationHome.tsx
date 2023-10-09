import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonContent, IonHeader, IonItemDivider, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { ContractsHome } from "../Contracts/ContractsHome";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";
import { db } from "../../db";
import { formatLocalCurrency } from "../../utils/numberFormatter";


interface LoanAppDisplay {
  _id: string
  estatus: string
  product_name: string
  apply_amount: number
  term: number
  frequency: [string, string]
}

export const LoanApplicationHome: React.FC<RouteComponentProps> = (props) => {

  const onAddNew =  () =>{
    props.history.push(`loanapps/add`);
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/clients" />
          </IonButtons>
          <IonTitle>Solicitudes de Credito</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList className="ion-padding">
          <IonItemDivider><IonLabel>Solicitudes del cliente</IonLabel></IonItemDivider>
            <LoanAppCard {...props} />
            
            <IonButton onClick={onAddNew}>Nueva Solicitud</IonButton>
                
            <IonItemDivider><IonLabel>Contratos Activos</IonLabel></IonItemDivider>
                  <ContractsHome {...props} />
        </IonList>
      </IonContent>
    </IonPage>
  );
};


const LoanAppCard: React.FC<RouteComponentProps> = ({match}) => {

  const [loans, setLoans] = useState<LoanAppDisplay[]>([]);
  const { dispatchSession } = useContext(AppContext)
  let render = true;

  useEffect( ()=>{


    async function loadData (){
      const clientId = match.url.split("/")[2];
      dispatchSession({ type:"SET_LOADING", loading_msg: "Cargando...", loading: true });
      const query = await db.find({
        selector: {
          couchdb_type: "LOANAPP" }});
      const queryFiltered = query.docs.filter( (i:any)=>(i.apply_by === clientId )) 
        
      const loanList: LoanAppDisplay[] = queryFiltered.map( (i:any) =>({
        _id: i._id,
        estatus: i.estatus,
        product_name: i.product.product_name,
        term: i.term,
        frequency: i.frequency,
        apply_amount: i.apply_amount,
      }) ) 
      setLoans(loanList);
      dispatchSession({ type:"SET_LOADING", loading_msg: "", loading: false });
    }

    if( render ){
      render = false;
      loadData();
    }

  },[])

  function getStatus(status: string) {
    switch (status) {
      case "ACEPTADO":
        return "medium";
      case "TRAMITE":
        return "warning";

      default:
        return "ligth";
    }
  }

  return (
    <div>
      <h1>Solicitudes</h1>
      
      {loans.map((i: LoanAppDisplay, n) => (
        <IonCard
          button={true}
          color={getStatus(i.estatus)}
          routerLink={`loanapps/edit/${i._id}`}
          key={n}
        >
          <IonCardHeader>
            <h1>{i.product_name}</h1>
            <IonCardSubtitle>{i.estatus}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {formatLocalCurrency(i.apply_amount)} / {i.term} {i.frequency[1]}
          </IonCardContent>
        </IonCard>
      ))}
    </div>
  );
      
}