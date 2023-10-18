import { IonHeader, IonToolbar, IonContent, IonList, IonTitle, IonItem, IonIcon, IonLabel, IonPage, IonButtons, IonBackButton, useIonLoading, IonButton, useIonAlert } from "@ionic/react"
import { useContext, useEffect, useState } from "react";
import { ellipse  } from 'ionicons/icons';
import { db } from "../../db";
import { AppContext } from "../../store/store";
import api from "../../api/api";
import { useDBSync } from "../../hooks/useDBSync";
import { UpdateLog } from "../../reducer/UpdateLogsReducer";


export const ActionLog = () => {  
  const { session, updatesLog, dispatchUpdatesLog } = useContext(AppContext);
  const [showAlert] = useIonAlert();
  const [showLoading, dismissLoading] = useIonLoading();
  const [allValid, setAllValid] = useState(false);
  const { couchDBSyncDownload } = useDBSync();

  let loaded = true;

  function mapActionsTypes ( actionName: string ) {
        switch( actionName) {
          case 'CREATE_UPDATE_LOAN':
            return `SOLICITUD NUEVA O RENOVACION`
          case 'CREATE_UPDATE_CLIENT':
            return  `ACTUALIZAR O CREAR CLIENTE`
          default: 
            return ``
        }

    }

    
  useEffect(() => {
    async function onPopulate() {
      
      try {
        
        const queryData = await db.find({ selector: { couchdb_type: "ACTION" }, limit: 1000 });
        const userActions:any = queryData.docs.filter( 
          (i:any) => 
          i.created_by === session.user && 
          i.status ==='Pending'
          );

          
        const data: UpdateLog[] = userActions.map( (i:any) => ( {
                                                                        _id: i._id,
                                                                        name: `${mapActionsTypes(i.name)}`,
                                                                        status: i.status,
                                                                        hf_info: {
                                                                          client_name: i.data.client_name,
                                                                          hf_client_id: i.data.id_cliente,
                                                                          hf_application_id: i.data.id_solicitud
                                                                        },
                                                                        isOk: i.isOk,
                                                                        errors: !i.errors ? [] : i.errors }))
      
        dispatchUpdatesLog( { type: 'POPULATE_UPDATE_LOGS', data})
      }
      catch(e){
        console.log(e);
        alert('No fue posible recuperar datos')
      }
    }
  
    if (loaded) {
      loaded = false;
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
          

          try {
              // sends email with
            api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;
            const emailTo = process.env.NODE_ENV === 'development' ? 'josman.gomez.aldama@gmail.com' : session.user
            
            await api.post(`/sendemail?toEmail=${emailTo}&templateId=d-644621db309643f0aba469b4e229f776&fromEmail=soporte.hf@grupoconserva.mx`,
            { /// Data for email Template
              actionType: mapActionsTypes(updatesLog[apiCalls].name),
              clientName: updatesLog[apiCalls].hf_info?.client_name,
              errors:  apiRes.data.errors.map( (e:any) => (JSON.stringify(e)))
            })

          } catch (err) {
            alert('Error al intentar enviar el correo...')
          }
        }
        
        dispatchUpdatesLog( {
            type: "UPDATE_UPDATE_LOG",
            idx: idTrx,
            status: 'Pending',
            hf_info: {
              client_name: updatesLog[apiCalls].hf_info?.client_name,
              hf_client_id: updatesLog[apiCalls].hf_info?.hf_client_id,
              hf_application_id: updatesLog[apiCalls].hf_info?.hf_application_id
            },
            isOk: apiRes.data.errors.length == 0,
            errors: apiRes.data.errors.map( (e:any )=>(JSON.stringify(e)))
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
          type: "REMOVE_UPDATE_LOG",
          idx: idTrx          
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
          { updatesLog.reverse().map( (item:UpdateLog) => (
            <IonItem key={item._id}>
              <IonIcon slot="start" color={ item.isOk ? 'success' : 'danger'} icon={ item.status === 'Pending'  ? ellipse : '' }></IonIcon>
              <IonLabel>
                <h2>{ item.name }</h2>
                <p> Cliente: { item.hf_info?.client_name }   </p>
                { item.errors!.length > 0 &&<IonButton color='light' id={`${item._id}`} onClick={onIgnoreAction}>Ignorar</IonButton>}
                
              </IonLabel>
            </IonItem>
          ))}
          {!updatesLog.length && <p>...No hay datos pendientes de actualizar!</p> }
        </IonList>
          

      </IonContent>
    </IonPage>
    )
}