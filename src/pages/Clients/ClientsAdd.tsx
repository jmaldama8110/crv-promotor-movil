import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { db, remoteDB } from "../../db";
import { AppContext } from "../../store/store";
import { ClientForm } from "./ClientForm";

export const ClientsAdd: React.FC<RouteComponentProps> = ( {history} ) => {
  
  const { dispatchSession, session } = useContext(AppContext);
  const [showToast] = useIonToast();
  
  function onClientAdd (data: any){
    
    /// Save new record
    
    db.put({
      ...data,
      _id: Date.now().toString(),
      client_type:[2,'INDIVIDUAL'],
      status: [1,'Pendiente'],
      branch: session.branch,
    }).then( (doc)=>{

      try{
        dispatchSession({ type: "SET_LOADING", loading: true, loading_msg: "Subiendo datos..."});
        db.replicate.to(remoteDB).on('complete', function () {
          console.log('Local => RemoteDB, Ok!')
          dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
          history.goBack();
          showToast("Ok, se guardo el registro!",1500);
    
        }).on('error', function (err) {
          dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
          history.goBack();
          showToast("Ok, se guardo el registro!, pero no estas conectado!",1500);
        });
      }
      catch(error){
        console.log(error);
      }

    }).catch( e =>{
      showToast("NO se guardo el registro!",1500);
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
        <ClientForm onSubmit={onClientAdd} />
      </IonContent>
    </IonPage>
  );
};
