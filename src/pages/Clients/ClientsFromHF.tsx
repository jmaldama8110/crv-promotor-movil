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
    
    const [fullname, setFullName ] = useState<string>('');
    const [externalId, setExternalId ] = useState<string>('');
    const [presentAlert] = useIonAlert();
    const [ present, dismiss] = useIonLoading();
    const { session, dispatchClientData, dispatchSession } = useContext(AppContext);
    const [hide, setHide] = useState<boolean>(false)
    
    const { couchDBSyncUpload }  = useDBSync();
    
    async function onSearchByCurpOrIdCliente () {
    
        try {
          present({message: 'Buscando en el HF...'})
          // converts Id into number
          let IdCliente = externalId !== '0' ? parseInt(externalId): 0;
            if( !IdCliente) {
              /// Id Cliente is not provided, try to obtain
              api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
              const apiRes = await api.get(`/clients/hf/search?branchId=${session.branch[0]}&clientName=${fullname}`);
              if( apiRes.data.length){
                //// tries to retrive the last record with sub_estatus = PRESTAMO ACTIVO
                const clientInfoApi = apiRes.data.find( (i:any) => i.sub_estatus ==='PRESTAMO ACTIVO' ||'PRESTAMO FINALIZADO' );
                if( clientInfoApi ){
                  IdCliente = parseInt(clientInfoApi.idCliente);
                } else {
                  throw new Error('Not found');
                }
               
              }
            }
            const apiRes2 = await api.get(`/clients/hf?externalId=${IdCliente}`);
            const newData = apiRes2.data as ClientData

            /// validates whether the client exist locally or not
            const searchData = await db.find( { selector: { couchdb_type: "CLIENT"}});
            const checkCoincidences = searchData.docs.find( (i:any) =>( 
              (i.curp === newData.curp )  ||
              (`${i.name}${i.lastname}${i.second_lastname}` === `${newData.name}${newData.lastname}${newData.second_lastname}` ) ||
              (i.id_cliente == IdCliente) ));
            if( checkCoincidences ){
              throw new Error('Found already locally!')
            }            
            
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
      dispatchSession({ type:"SET_LOADING", loading_msg: "Guardando...", loading: true});
            // Save new record
            db.put({
              ...data,
              couchdb_type: 'CLIENT',
              _id: Date.now().toString(),
              status: [2,'Aprovado'],
            }).then(async (doc)=>{
              await couchDBSyncUpload();
              dispatchSession({ type:"SET_LOADING", loading_msg: "", loading: false}); 
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
                <IonItemDivider><IonLabel>Nombre del cliente:</IonLabel></IonItemDivider>
                  <IonLabel position="floating">Ingresa nombre completo</IonLabel>
                  <IonInput type='text' value={fullname}  onIonChange={ (e) => setFullName(e.detail.value!)} ></IonInput>
              </IonItem>}
              { externalId !== '0' &&
                <IonItem>
                <IonItemDivider><IonLabel>ID Cliente HF:</IonLabel></IonItemDivider>
                  <IonLabel position="floating">Ingresa el ID Cliente HF</IonLabel>
                  <IonInput type='text' value={externalId}  onIonChange={ (e) => setExternalId(e.detail.value!)}></IonInput>
              </IonItem>}
              <IonButton onClick={onSearchByCurpOrIdCliente} disabled={(!fullname && !externalId)}>Buscar</IonButton>
            </div>
            }
            {hide && <ClientForm onSubmit={onSave} />}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
