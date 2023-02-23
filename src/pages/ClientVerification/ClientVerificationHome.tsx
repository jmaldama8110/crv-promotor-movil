import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonButton, IonItem, IonLabel } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { AppContext } from "../../store/store";
import { formatDate, formatLocalDateShort } from "../../utils/numberFormatter";


export const ClientVerificationHome: React.FC<RouteComponentProps> = ({match, history})=> {

  const [verificationsList, setVerificationsList] = useState<any[]>([])
  const { dispatchSession } = useContext(AppContext);

  useEffect( ()=>{
    async function loadData(){
      try{
        const clientId = match.url.split("/")[2];
        const data = await db.find({ selector: { couchdb_type: "CLIENT_VERIFICATION"}});
        const verifs = data.docs.filter( (i:any) => i.client_id === clientId );
        setVerificationsList(verifs); 
      }
      catch(e){
        alert('Error al leer verificaciones...')
      }
      
    }
    loadData();
  },[])

    const onAddNew =  () =>{
        const clientId = match.url.split("/")[2];
        history.push(`/clients/${clientId}/verfications/add`);
      }
    return (
        <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/clients" />
            </IonButtons>
            <IonTitle>Verificaciones Oculares</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList className="ion-padding">
            {
              verificationsList.map( (i:any) =>(
                <IonItem key={i._id} button routerLink={`verfications/edit/${i._id}`}>
                  <IonLabel>{formatDate( i.created_at)} | {i.loanAmount}</IonLabel>
                </IonItem>
              ))
            }

          </IonList>
            <IonButton onClick={onAddNew} color='tertiary'>Realizar Verificacion</IonButton>
        </IonContent>
      </IonPage>
    );
}