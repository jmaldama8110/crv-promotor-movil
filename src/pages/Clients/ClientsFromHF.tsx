import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import api from "../../api/api";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { ClientData } from "../../reducer/ClientDataReducer";
import { AppContext } from "../../store/store";
import { ClientForm } from "./ClientForm";


export const ClientsFromHF: React.FC<RouteComponentProps> = ({ history, match }) => {
    
    const [curp, setCurp ] = useState<string>('');
    const [externalId, setExternalId ] = useState<string>('');
    const [presentAlert] = useIonAlert();
    const [ present, dismiss] = useIonLoading();
    const { session, dispatchClientData } = useContext(AppContext);
    const [hide, setHide] = useState<boolean>(false)
    
    const { couchDBSyncUpload }  = useDBSync();
    
    async function onSearchByCurpOrIdCliente () {
    
        try {
          present({message: 'Buscando en el <HF></HF>...'})
          // converts Id into number
          let IdCliente = externalId !== '0' ? parseInt(externalId): 0;
            if( !IdCliente) {
              /// Id Cliente is not provided, try to obtain
              api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
              const apiRes = await api.get(`/clients/exits?identityNumber=${curp}`);
              if( apiRes.data.id_cliente){
                IdCliente = parseInt(apiRes.data.id_cliente);
              } else {
                throw new Error('Not found');
              }
            }
              
            const apiRes2 = await api.get(`/clients/hf?externalId=${IdCliente}`);
            const newData = apiRes2.data as ClientData                
            if( !(newData.branch[0] == session.branch[0]) ){
                  throw new Error('No puedes modificar datos fuera de tu sucursal');
            }
            dispatchClientData({ type: 'SET_CLIENT',
                    ...newData,
                    _id:'0' });
            setHide(true);  
            dismiss();

        }
        catch(err){
            dismiss();
            console.log(err);
            presentAlert({
                header: 'Este registro no fue encontrado o ya existe en la App',
                subHeader: 'No existe este CURP en el HF o ya fue dado de alta en la App por otra persona',
                message: 'No fue posible!',
                buttons: ['OK'],
              })
        }
    }

    async function onSave( data:any) {
      /// Save new record

        db.put({
          ...data,
          couchdb_type: 'CLIENT',
          _id: Date.now().toString(),
          status: [2,'Aprovado'],
        }).then(async (doc)=>{

          await couchDBSyncUpload();      
          history.goBack();

        }).catch( e =>{
          presentAlert({
            header: 'No fue posible guardar',
            subHeader: 'Ooops algo paso',
            message: 'No fue posible guardar!',
            buttons: ['OK'],
          })
        })

    }

    useEffect( ()=>{
      setExternalId( match.url.split("/")[3] ) ;

    },[])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>

          <IonTitle>Buscar Cliente en Sistema</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList className='ion-padding'>
            { !hide &&
              <div>
              { externalId === '0' &&
              <IonItem>
                <IonItemDivider><IonLabel>CURP:</IonLabel></IonItemDivider>
                  <IonLabel position="floating">Ingresa el CURP del Cliente</IonLabel>
                  <IonInput type='text' value={curp}  onIonChange={ (e) => setCurp(e.detail.value!)} onIonBlur={(e:any)=>setCurp(e.target.value.toUpperCase())}></IonInput>
              </IonItem>}
              { externalId !== '0' &&
                <IonItem>
                <IonItemDivider><IonLabel>ID Cliente HF:</IonLabel></IonItemDivider>
                  <IonLabel position="floating">Ingresa el ID Cliente HF</IonLabel>
                  <IonInput type='text' value={externalId}  onIonChange={ (e) => setExternalId(e.detail.value!)}></IonInput>
              </IonItem>}
              <IonButton onClick={onSearchByCurpOrIdCliente} disabled={(!curp && !externalId)}>Buscar</IonButton>
            </div>
            }
            {hide && <ClientForm onSubmit={onSave} />}
        </IonList>
      </IonContent>
    </IonPage>
  );
};