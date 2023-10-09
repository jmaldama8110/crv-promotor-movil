import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import api from "../../api/api";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { createAction } from "../../model/Actions";
import { ClientData } from "../../reducer/ClientDataReducer";
import { AppContext } from "../../store/store";
import { ClientForm } from "./ClientForm";


export const ClientsFromHF: React.FC<RouteComponentProps> = ({ history, match }) => {
    
    const [fullname, setFullName ] = useState<string>('');
    const [clientName, setClientName ] = useState<string>('');
    const [loanAppStatus, setLoanAppStatus ] = useState<string>('');
    const [createNewLoanApp, setCreateNewLoanApp] = useState<boolean>(false);
    const [idLoanApplication, setIdLoanApplication] = useState<number>(0);
    const [idClient, setIdClient] = useState<number>(0);
    const [ClientIdLocal, setClientIdLocal] = useState<string>('');
    const [clientExistLocal, setClientExistLocal ] = useState<boolean>(false);

    /// externalId manages form Mode when searching clients for groups or individuals
    const [externalId, setExternalId ] = useState<string>('');
    const [presentAlert] = useIonAlert();
    const [ present, dismiss] = useIonLoading();
    const { session, dispatchClientData, dispatchSession } = useContext(AppContext);
    const [hide, setHide] = useState<boolean>(false)
    const { couchDBSyncUpload }  = useDBSync();
    

    function clearAll(){
      setFullName('');
      setClientName('');
      setLoanAppStatus('');
      
      setCreateNewLoanApp(false);
      setIdLoanApplication(0);
      setIdClient(0);
      setClientIdLocal('');
      setClientExistLocal(false);
    }
    async function onSearchByCurpOrIdCliente () {
      clearAll();
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
                let clientInfoApi = apiRes.data.find( (i:any) => i.sub_estatus ==='PRESTAMO ACTIVO' );
                if( !clientInfoApi) {
                  clientInfoApi = apiRes.data.find( (i:any)=> i.sub_estatus === 'PRESTAMO FINALIZADO');
                }
                if( clientInfoApi ){
                  IdCliente = parseInt(clientInfoApi.idCliente);
                  setIdClient(clientInfoApi.idCliente);
                  setIdLoanApplication(clientInfoApi.idSolicitud);
                  setClientName(clientInfoApi.nombreCliente);
                  setLoanAppStatus(clientInfoApi.sub_estatus)
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
              setClientExistLocal(true);
              setClientIdLocal(checkCoincidences._id);
              
            }
            setClientName(`${newData.name} ${newData.lastname} ${newData.second_lastname}`);

            dispatchClientData({ type: 'SET_CLIENT',
                    ...newData,
                    _id:'0' });
            
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

    async function onSaveOnlyClient (data:any){
      try{
        dispatchSession({ type:"SET_LOADING", loading_msg: "Guardando...", loading: true}); 
        // saves de Client info, this is already checked if locally exists by SearchByCurpOrId
        const clientNewId = Date.now().toString()
        await db.put({
          ...data,
          couchdb_type: 'CLIENT',
          _id: clientNewId,
          status: [2,'Aprovado'],
        });

        ////// Finally, puts ans Syncs
        await couchDBSyncUpload();
        dispatchSession({ type:"SET_LOADING", loading_msg: "", loading: false}); 
        history.goBack();

      }
      catch(error){
        dispatchSession({ type:"SET_LOADING", loading_msg: "", loading: false}); 
        console.log(error);
        alert('No fue posible guardar!')
      }
    }


    async function onSaveWithRenovation( data:any) {
    
      try {
        dispatchSession({ type:"SET_LOADING", loading_msg: "Guardando...", loading: true}); 
        // saves de Client info, this is already checked if locally exists by SearchByCurpOrId
        const newClientId = Date.now().toString()
        if( !clientExistLocal ){
          await db.put({
            ...data,
            couchdb_type: 'CLIENT',
            _id: newClientId,
            status: [2,'Aprovado'],
          });
        }
        //// active contract List
        const apiRes2 = await api.get(`/clients/hf/getBalance?idCliente=${idClient}`);
        const contractList = apiRes2.data;

        for( let x = 0; x < contractList.length; x++){
          /// iterates through the contract list
          const contractExist = await contractNewExist( contractList[x].idContrato);
          if( !contractExist ){
              /// if the contract does not exists, create it
              const newContract = {
                  ...apiRes2.data[0],
                  _id: Date.now().toString(),
                  client_id: clientExistLocal ? ClientIdLocal : newClientId,
                  created_by: session.user,
                  created_at: new Date().toISOString(),
                  branch: session.branch,
                  couchdb_type: "CONTRACT",
               }
               await db.put(newContract);
          }

        }
        const apiRes = await api.get(`/clients/hf/loanapps?branchId=${session.branch[0]}&applicationId=${idLoanApplication}`);
        const contractLoanAppExist = await solicitudIdExist(apiRes.data.id_solicitud);
        const contractLoanAppId= Date.now().toString();

        if( !contractLoanAppExist ) {
          const activeLoanApp: any = {
            ...apiRes.data,
            _id: contractLoanAppId,
            dropout: [],
            apply_by: clientExistLocal ? ClientIdLocal : newClientId,
            renovation: false,
            apply_at: new Date().toISOString(),
            created_by: session.user,
            created_at: new Date().toISOString(),
            branch: session.branch,
            couchdb_type: "LOANAPP",
          }
          await db.put(activeLoanApp);

        }

        if( createNewLoanApp ){
          const newLoanAppId= Date.now().toString();
          const newMembersData = convertMembersDataFromActiveToNew(apiRes.data.members);
          
          const newLoaApp: any = {
            ...apiRes.data,
            _id: newLoanAppId,
            dropout: [],
            apply_by: clientExistLocal ? ClientIdLocal : newClientId,
            GL_financeable: false,
            liquid_guarantee: 10,
            renovation: true,
            apply_at: new Date().toISOString(),
            created_by: session.user,
            created_at: new Date().toISOString(),
            branch: session.branch,
            couchdb_type: "LOANAPP",
            estatus: "TRAMITE",
            sub_estatus: "NUEVO TRAMITE",
            status: [1,"NUEVO TRAMITE"],
            members: newMembersData 
          };

          await db.put(newLoaApp);
          await createAction( "CREATE_UPDATE_LOAN" , 
          {
            id_loan: newLoanAppId,
            _id: '',
            client_name: `${data.name} ${data.lastname} ${data.second_lastname}`,
            id_cliente: apiRes.data.id_cliente ? apiRes.data.id_cliente : 0,
            id_solicitud: apiRes.data.id_solicitud? apiRes.data.id_solicitud: 0
          },
          session.user )

        }


        ////// Finally, puts ans Syncs
        await couchDBSyncUpload();
        dispatchSession({ type:"SET_LOADING", loading_msg: "", loading: false}); 
        history.goBack();

      }
      catch(error){
        dispatchSession({ type:"SET_LOADING", loading_msg: "", loading: false}); 
        console.log(error);
        alert('No fue posible guardar!')
      }
      

    }

    useEffect( ()=>{
      setExternalId( match.url.split("/")[3] ) ;

    },[])


    function convertMembersDataFromActiveToNew( membersData: any[]){
      return membersData.map( (i:any)=>(
        {
          _id: i._id,
          id_member: i.id_member,
          id_cliente: i.id_cliente,
          fullname: i.fullname,
          estatus: "TRAMITE",
          sub_estatus: "NUEVO TRAMITE",
          position: i.position,
          apply_amount: i.apply_amount,
          approved_amount: i.approved_amount,
          previous_amount: i.previous_amount,
          loan_cycle: i.loan_cycle,
          disbursment_mean: i.disbursment_mean,
          insurance: i.insurance
        }  ))
    }
   
   async function contractNewExist(IdContract: number){
      try{
          await db.createIndex( {index: { fields: ["couchdb_type"]}});
          const data = await db.find({selector: {
            couchdb_type: 'CONTRACT'
          }})
          const contract = data.docs.find((i:any) => i.idContrato == IdContract  )
          return !!contract;
      }
      catch(e){
        console.log(e);
        return false;
      }
    }
  async function solicitudIdExist( idsol: number) {
    try{
      await db.createIndex( {index: { fields: ["couchdb_type"]}});
      const data = await db.find({selector: {
        couchdb_type: 'LOANAPP'
      }})
      const loanApp = data.docs.find((i:any) => i.id_solicitud == idsol  )
      return !!loanApp;
    }
    catch(e){
      return false
    }
  }

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
              { externalId === '0' && /// search by Client Name
              <IonItem>
                <IonItemDivider><IonLabel>Nombre del cliente:</IonLabel></IonItemDivider>
                  <IonLabel position="floating">Ingresa nombre completo</IonLabel>
                  <IonInput type='text' value={fullname}  onIonChange={ (e) => setFullName(e.detail.value!)} ></IonInput>
              </IonItem>}
              { externalId !== '0' && /// search by Id Cliente HF
                <IonItem>
                <IonItemDivider><IonLabel>ID Cliente HF:</IonLabel></IonItemDivider>
                  <IonLabel position="floating">Ingresa el ID Cliente HF</IonLabel>
                  <IonInput type='text' value={externalId}  onIonChange={ (e) => setExternalId(e.detail.value!)}></IonInput>
              </IonItem>}
              <p></p>
              <IonButton onClick={onSearchByCurpOrIdCliente} disabled={(!fullname && !externalId)}>Buscar</IonButton>
              <p></p>
                        <IonButton color='success' onClick={ ()=>setHide(true)}>Ver</IonButton>
            </div>
            }
            {!hide && 
                        <>
                        <IonItem><p>{clientName}</p></IonItem>
                        {clientExistLocal ? <IonItem><p>Id Local: {ClientIdLocal}</p></IonItem> : ''}
                        <IonItem><p>Solicitud: {idLoanApplication}</p></IonItem>
                        <IonItem><p>Estatus: {loanAppStatus}</p></IonItem>
                        <IonItem>
                          <IonLabel>Renovar del credito</IonLabel>
                          <IonCheckbox
                          checked={createNewLoanApp}
                          onIonChange={async (e) =>setCreateNewLoanApp(e.detail.checked)} />
                        </IonItem>
                        </>
            }

            { hide && <ClientForm onSubmit={ externalId === '0' ? onSaveWithRenovation : onSaveOnlyClient} /> }
            
        </IonList>
      </IonContent>
    </IonPage>
  );
};
