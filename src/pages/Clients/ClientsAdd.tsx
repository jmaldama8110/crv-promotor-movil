import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";
import { ClientsForm } from "./ClientsForm";

export const ClientsAdd: React.FC<RouteComponentProps> = ( {history} ) => {
  function onClientAdd (data: any){

    /// Save new record
    db.put({
      couchdb_type: 'CLIENT',
      _id: Date.now().toString(),
      ...data
    }).then( (doc)=>{
      history.push('/clients');
      alert('Se guardo el cliente!');

    }).catch( e =>{
      alert('No se pudo guardar el dato del cliente')
    })

    
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Alta de Clientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mis Clientes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ClientsForm onSubmit={onClientAdd} />
      </IonContent>
    </IonPage>
  );
};
