import { IonHeader, IonToolbar, IonContent, IonList, IonTitle, IonRefresher, IonRefresherContent, RefresherEventDetail, IonItem, IonIcon, IonLabel, IonPage, IonButtons, IonBackButton, useIonLoading, IonButton } from "@ionic/react"
import { useContext, useEffect, useState } from "react";
import { ellipse  } from 'ionicons/icons';
import { db } from "../../db";
import { AppContext } from "../../store/store";
import api from "../../api/api";
import { useDBSync } from "../../hooks/useDBSync";

interface ActionItem {

  _id: string;
  name: string, 
  status:string, // pending | done
  isOk: boolean | undefined;
  errors?: []; // thrown errors by validation

}

export const ActionLog = () =>{

  const { couchDBSyncDownload } = useDBSync();
  const { session } = useContext(AppContext);

  const [actionItem, setActionItems] = useState<ActionItem[]>([]);
  const [showLoading, dismissLoading] = useIonLoading();

  let loaded = false;

  function mapActionsTypes ( actionName: string ) {
        switch( actionName) {
          case 'CREATE_UPDATE_LOAN':
            return 'Solicitud (nueva/actualizar)'
          case 'CREATE_UPDATE_CLIENT':
            return 'Cliente (nuevo/actualizar)'
          case 'MEMBER_DROPOUT':
            return 'Baja (de integrante en un grupo)';
          case 'MEMBER_NEW':
            return 'Ingreso/Reingreso'
          default: 
            return ''
        }
  }

  function mapActionsStatus ( action: ActionItem ) {
        if( !action.errors ){
          
        }
  }

  async function populateActions (actions:any) {
    const newData = actions.map( (i:ActionItem) => (
      {
        _id: i._id,
        name: mapActionsTypes(i.name),
        status: i.status,
        isOk: i.isOk,
        
      }
    ));
    setActionItems(newData);
  }

  async function loadActions () {

    try{

      const data = await db.find({ selector: { couchdb_type: "ACTION" }, limit: 1000 });
      const userActions = data.docs.filter( (i:any) => i.created_by === session.user && i.status ==='Pending' );
      populateActions(userActions)
    }
    catch(err){
      alert('No fue posible recuperar datos, solicite ayuda!')
    }
  }
  useEffect(() => {

    if (!loaded) {
      loaded = true;
      
      loadActions();
    }
  }, []);

  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    

    setTimeout( async ()=>{
      await couchDBSyncDownload();
      await loadActions();
      
      event.detail.complete();
    },2000)
    
    
  }

  async function onValidate(e:any) {
      
      await onApiValidation(e.target.id);
      await couchDBSyncDownload();
      loadActions();
  }

  async function onApiValidation (id:string) {
  
    try {
      showLoading( {message: 'Validando...'})
      api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
      const apiRes = await api.get(`/actions/validate?id=${id}`);
      dismissLoading();
      await couchDBSyncDownload();
      loadActions();

    }
    catch(err){
      alert('Ups, no fue posible procesar la solicitud, verifica tu conexion a Internet')
    }

  }


  async function onUpdateAll() {
    

  }
  async function onUpdateAction(e:any){
    try {
      showLoading( {message: 'Actualizando...'})
      api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
      const apiRes = await api.get(`/actions/exec?id=${e.target.id}`);
      if( apiRes.data.status === 'ERROR') {
        throw new Error('No fue posible procesar la peticion')
        
      }
      dismissLoading();
      await couchDBSyncDownload();
      loadActions();

    }
    catch(err){
      dismissLoading();
      alert('Ups, algo salio mal. Solicita ayuda')
    }

  }

    return (
      <IonPage>
      <IonHeader>

      <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>        
          <IonTitle>Bitácora de Acciones</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonList>
          { actionItem.reverse().map((item) => (
            <IonItem key={item._id}>
              <IonIcon slot="start" color={ item.isOk ? 'success' : 'danger'} icon={ item.isOk !== undefined ? ellipse : '' }></IonIcon>
              <IonLabel>
                <h2>{ item.name }</h2>
                <p> Estatus: { item.status } / {item._id.slice(-6)} { item.errors ? item.errors.toString():'' }</p>
              </IonLabel>
              { !item.isOk &&<IonButton color='light' onClick={onValidate} id={item._id}>Validar</IonButton>}
              { item.isOk && <IonButton color='success' onClick={onUpdateAction} id={item._id}>Exec</IonButton>}
            </IonItem>
          ))}
          {!actionItem.length && <p>...No hay datos pendientes de actualizar!</p> }
        </IonList>
        <div className="ion-padding"> {/**  All items are validated */}
          { !actionItem.find( (x:ActionItem) => 
            (x.isOk == false || x.isOk === undefined)) && 
            <IonButton onClick={onUpdateAll}>Actualizar TODO</IonButton> }
        </div>

      </IonContent>
    </IonPage>
    )
}