import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonAlert, useIonToast } from "@ionic/react";
import { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { db, dbX } from "../../db";
import { GeneralPhoto } from "../../hooks/useCameraTaker";
import { useDBSync } from "../../hooks/useDBSync";
import { createAction } from "../../model/Actions";
import { AppContext } from "../../store/store";
import { ClientForm } from "./ClientForm";

export const ClientsAdd: React.FC<RouteComponentProps> = ( {history} ) => {
  
  const {  session,dispatchClientData, dispatchSession } = useContext(AppContext);
  const [showToast] = useIonToast();
  const [showAlert] = useIonAlert();
  const { couchDBSyncUpload }  = useDBSync();

  async function onClientAdd (data: any){
    
  
    /// Save new record
    dispatchSession({ type: "SET_LOADING", loading_msg: 'Guardando...', loading: true});

            /// validates whether the client exist locally or not
            const searchData = await db.find( { selector: { couchdb_type: "CLIENT"}});
            const checkCoincidences = searchData.docs.find( (i:any) =>( 
              (i.curp === data.curp )  ||
              (`${i.name}${i.lastname}${i.second_lastname}` === `${data.name}${data.lastname}${data.second_lastname}` ) ));
            if( !checkCoincidences ){
              const clientIdNew = Date.now().toString()
              db.put({
                ...data,
                _id: clientIdNew,
                comprobante_domicilio_pics: data.comprobante_domicilio_pics.map( (x:GeneralPhoto) => ({ _id: x._id, title: x.title })),
                identity_pics: data.identity_pics.map( (x:GeneralPhoto) => ({ _id: x._id, title: x.title })),
                client_type:[2,'INDIVIDUAL'],
                loan_cycle: 0,
                status: [1,'Pendiente'],
                branch: session.branch,
              }).then( async (doc)=>{
                  await dbX.bulkDocs(data.identity_pics);
                  await dbX.bulkDocs(data.comprobante_domicilio_pics);
                  // creates the new action when new client is added
                  await createAction( "CREATE_UPDATE_CLIENT" , { _id: clientIdNew },session.user )
                  await couchDBSyncUpload();
                  dispatchSession({ type: "SET_LOADING", loading_msg: '', loading: false});
                  history.goBack();
              }).catch( e =>{
                showToast("NO se guardo el registro!",1500);
              })
          
            } else {
              showAlert({
                header: 'Ya existe en la App',
                subHeader: 'Se encontro que ya esta registrado',
                message: 'No fue posible registrar a la persona: se encontro algun homonimo o con el mismo curp',
                buttons: ['OK'],
              })
            }

    
    
  }
  useEffect( ()=>{
    return () =>{
      dispatchClientData({ type:"RESET_CLIENT" })
    }
  },[])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>        
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
