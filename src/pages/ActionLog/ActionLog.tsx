import { IonHeader, IonToolbar, IonContent, IonList, IonTitle, IonItem, IonIcon, IonLabel, IonPage, IonButtons, IonBackButton, useIonLoading, IonButton, useIonAlert } from "@ionic/react"
import { useContext, useEffect, useState } from "react";
import { ellipse  } from 'ionicons/icons';
import { db } from "../../db";
import { AppContext } from "../../store/store";
import api from "../../api/api";
export const ActionLog = () => {

  
  const { session, updatesLog, dispatchUpdatesLog } = useContext(AppContext);
  const [showAlert] = useIonAlert();
  const [showLoading, dismissLoading] = useIonLoading();
  const [allValid, setAllValid] = useState(false);

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

    
  useEffect(() => {
    async function onPopulate() {
      try {
        const data = await db.find({ selector: { couchdb_type: "ACTION" }, limit: 1000 });
        const userActions:any = data.docs.filter( 
          (i:any) => 
          i.created_by === session.user && 
          i.status ==='Pending'
          );
          
        dispatchUpdatesLog( { type: 'POPULATE_UPDATE_LOGS', data: userActions})
      }
      catch(e){
        console.log(e);
        alert('No fue posible recuperar datos')
      }
    }
  
    if (!loaded) {
      loaded = true;
      onPopulate();
    }
    return ()=> {
      dispatchUpdatesLog({ type: "POPULATE_UPDATE_LOGS", data: []})
    }
  }, []);

  async function onApplyAll() {

    showLoading({ message: 'Validando...' });

    api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
    let apiCalls = 0, noErrors = true; /// when noErrors is false, ends the buckle

    try {

      while( apiCalls < updatesLog.length && noErrors ){
        const idTrx = updatesLog[apiCalls]._id
        const apiRes = await api.get(`/actions/validate?id=${idTrx}`);
        
        if( apiRes.data.errors.length > 0){
          noErrors = false;
          const docTrx:any = await db.get(idTrx);
          const docData:any = await db.get(docTrx.data._id); /// retrieves the document with the presented error

          try {
              // sends email with
            api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
            await api.post(`/sendemail?toEmail=${session.user}&templateId=d-ad5b9e1906714eecba6f75766d510df8&fromEmail=soporte.hf@grupoconserva.mx`,{
              actionType: mapActionsTypes(docTrx.name),
              clientName: `${docData.name} ${docData.lastname} ${docData.second_lastname}`,
              errors:  apiRes.data.errors.map( (e:any) => (`Dato incorrecto: ${e.property}`))
            })
            
  
          } catch (err) {
            alert('Error al intentar enviar el correo...')
          }
        }
        dispatchUpdatesLog( {
            type: "UPDATE_UPDATE_LOG",
            idx: idTrx,
            status: 'Pending',
            isOk: apiRes.data.errors.length == 0,
            errors: apiRes.data.errors
          });
        apiCalls ++;
      }
    
      setAllValid( noErrors ); /// assigns final value
      dismissLoading();
      if( !noErrors ){
        showAlert({
          header: 'Importante',
          subHeader: 'Actualizaciones al sistema HF',
          message: `Debes salir de esta ventana y volver a intentar esta accion. Corrige los datos de acuerdo al correo enviado a: ${session.user} y a soporte.hf@grupoconserva.mx`,
          buttons: ['OK'],
        })
      }
    }
    catch(e){
      dismissLoading();
      alert(`Algunas validaciones no fueron superadas al actualizar el sistema, se ha generado un ticket de seguimiento: ${session.user}`);
    }
  }

  async function onExecAll () {

    showLoading({ message: 'Ejecutando...' });
    let apiCalls = 0, noErrors = true; /// when noErrors is false, ends the buckle
    api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  

    while( apiCalls < updatesLog.length && noErrors ){
 
      const idTrx = updatesLog[apiCalls]._id
      try {
        const apiRes = await api.get(`/actions/exec?id=${idTrx}`);
        
        dispatchUpdatesLog( {
          type: "UPDATE_UPDATE_LOG",
          idx: idTrx,
          status: 'Done',
          isOk: true,
          errors: []
        });

      }
      catch(e){
        
        dismissLoading();
        dispatchUpdatesLog( {
          type: "UPDATE_UPDATE_LOG",
          idx: idTrx,
          status: 'Pending',
          isOk: false,
          errors: ['Error al hacer update en el HF']
        });

        alert('Hubo un error al intentar la acción EXEC, contacte a Soporte técnico')
      }
      dismissLoading();
      apiCalls ++;
    }

  }

  function onIgnoreAction (e:any) {
    
    const idx = e.target.id
    dispatchUpdatesLog({
      type: "REMOVE_UPDATE_LOG",
      idx:idx
    })
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

      <IonContent className="ion-padding">
        
          {!allValid &&<IonButton color='warning' onClick={onApplyAll} disabled={!updatesLog.length}>Validar Todo</IonButton>}
          {allValid && <IonButton color='success' onClick={onExecAll} disabled={!updatesLog.length}>Aplicar Todo</IonButton>}
          
        <IonList>
          { updatesLog.reverse().map( (item) => (
            <IonItem key={item._id}>
              <IonIcon slot="start" color={ item.isOk ? 'success' : 'danger'} icon={ item.status === 'Pending'  ? ellipse : '' }></IonIcon>
              <IonLabel>
                <h2>{ item.name }</h2>
                <p> Estatus: { item.status } / {item._id.slice(-6)} </p>
                { item.errors!.length > 0 &&<IonButton color='light' id={`${item._id}`} onClick={onIgnoreAction}>Ignorar</IonButton>}
                <ul>
                  {item.errors?.map( (e:any, n:number) => <li key={n}>{e.property}</li>)}
                </ul>
              </IonLabel>
            </IonItem>
          ))}
          {!updatesLog.length && <p>...No hay datos pendientes de actualizar!</p> }
        </IonList>
          

      </IonContent>
    </IonPage>
    )
}