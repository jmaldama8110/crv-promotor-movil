import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, RefresherEventDetail, useIonActionSheet, useIonAlert } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { db } from '../../db';
import type { OverlayEventDetail } from '@ionic/core';
import { Browser } from '@capacitor/browser';

import './ClientsHome.css';
import {
  SearchData,
  SelectDropSearch,
} from "../../components/SelectDropSearch";
import { useHistory } from 'react-router';
import { AppContext } from '../../store/store';
import { useDBSync } from '../../hooks/useDBSync';
import {locationOutline, personAddOutline} from 'ionicons/icons';

const ClientsHome: React.FC = () => {

  const [present] = useIonActionSheet();
  const [actions, setActions] = useState<OverlayEventDetail>();
  const [geoActions, setGeoActions] = useState<OverlayEventDetail>();
  const { dispatchClientData, session } = useContext(AppContext);
  const { couchDBSyncUpload } = useDBSync();

  let history = useHistory();
  
  const [clientSearchData,setClientSearchData ] = useState<SearchData[]>([]);
  const [clientSelected, setClientSelected] = useState<SearchData>({
    id: '',
    rev: "",
    etiqueta: "",
  });

  const [ clientDetail, setClientDetail] = useState<{
    id_cliente: number;
    location: string;
    coords: [number, number]
  }>({id_cliente: 0, location: '', coords:[0,0]})


  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(async () => {
      await couchDBSyncUpload();
      const data:any = await db.find({ selector: { couchdb_type:"CLIENT" }});
      const query = data.docs.filter( (i:any) => i.branch[0] === session.branch[0] );
      
      const newData: SearchData[] = query.map( (i:any) =>( { id: i._id, rev: i._rev, etiqueta: `${i.name} ${i.lastname} ${i.second_lastname}` }))
      setClientSearchData(newData);
      event.detail.complete();
    },2000);
    
  }


  function onShowActions(){
    const buttons = clientSelected.id ? 
    [
      { text: 'Nuevo', role:"destructive",data: { action: 'add', routerLink:'/clients/add' } },
      { text: 'Editar', data: { action:"edit", routerLink: `/clients/edit/${clientSelected.id}` } },
      { text: 'Solicitudes & Creditos', data: { action: 'loanapps', routerLink: `/clients/${clientSelected.id}/loanapps`} },
      { text: 'Datos Socioseconomicos', data: { action: 'edit-socioeconomics', routerLink:`/clients/socioeconomics/edit/${clientSelected.id}` } },
      { text: 'Prendas en Garantia', data: { action: 'guarantees', routerLink:  `/clients/${clientSelected.id}/guarantees` } },
      { text: 'Referencias & Personas', data: { action: 'related-people', routerLink:  `/clients/${clientSelected.id}/related-people` } },
      { text: 'Tarjeton de Pago', data: { action: 'tarjeton', routerLink:  `/wheretopay/${clientSelected.id}` } },
      { text: 'Expediente Digital', data: { action: 'digital-archive', routerLink:  `/digitalachive/${clientSelected.id}` } },
    ] :
      [
        { text: 'Nuevo', role:"destructive",data: { action: 'add', routerLink:'/clients/add' } },
        { text: 'Traer Desde...',data: { action: 'add-hf', routerLink:'/clients/add-from-hf/0' } },
        { text: 'Cancelar', role: 'cancel', data: { action: 'cancel'} },  
      ]
      present(
        { header: 'Mis Clientes',
          subHeader: 'Acciones / tareas:',
          buttons,
            onDidDismiss: ({ detail }) => setActions(detail),
          })
  }
  
  useEffect( ()=>{
    if( actions ){
      if( actions.data){
        if(actions.data.action === 'add'){
          dispatchClientData({type:'RESET_CLIENT'});
          history.push(actions.data.routerLink);
        }
        if(actions.data.action === 'add-hf')
          history.push(actions.data.routerLink);
        if(actions.data.action === 'edit')
          history.push(actions.data.routerLink);
        if( actions.data.action === 'edit-socioeconomics')
          history.push(actions.data.routerLink);
        if( actions.data.action === 'loanapps')
            history.push(actions.data.routerLink);
        if( actions.data.action === 'guarantees')
            history.push(actions.data.routerLink);
        if( actions.data.action === 'related-people')
            history.push(actions.data.routerLink);
        if( actions.data.action === 'tarjeton')
            history.push(actions.data.routerLink);
        if( actions.data.action === 'digital-archive')
            history.push(actions.data.routerLink);


      }
    }
  },[actions])


  useEffect( ()=>{

    async function loadOptions (){
      if( geoActions) {
        if( geoActions.data ){
            if( geoActions.data.action === 'directions'){
              await Browser.open({ url: `https://www.google.com/maps/dir/?api=1&destination=${clientDetail.coords[0]}%2C${clientDetail.coords[1]}` });
            }
            if( geoActions.data.action === 'map-view'){
              await Browser.open({ url: `https://www.google.com/maps/@?api=1&map_action=map&zoom=18&center=${clientDetail.coords[0]}%2C${clientDetail.coords[1]}` });            
            }
        }
      }
        
    }
    loadOptions();
  },[geoActions])

  useEffect( ()=>{
    async function loadClientData(){
      const data = await db.find( { selector: { couchdb_type: "CLIENT"}});
      const foundClient:any = data.docs.find( (i:any) => i._id === clientSelected.id )
      if( foundClient) {
        const addrs = foundClient.address.find((i:any) => i.type ==="DOMICILIO")
        setClientDetail( {
          id_cliente: foundClient.id_cliente,
          location: !!addrs ? `${addrs.colony[1]}, ${addrs.city[1]}`: '',
          coords: foundClient.coordinates
        } );
      }
    }

    loadClientData();

  },[clientSelected])

  function onShowGeoActions () {
    const buttons = [ 
                      { text: 'Indicaciones', role:"destructive",data: { action: 'directions'}},
                      { text: 'Ver Mapa', data: { action: "map-view" } }
                    ]
                    present(
                      { header: 'Ubicacion',
                        subHeader: 'Indique modo del mapa:',
                        buttons,
                          onDidDismiss: ({ detail }) => setGeoActions(detail),
                        })
  }



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle><IonIcon icon={personAddOutline}  /> Clientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mis Clientes</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList className='ion-padding height-full'>
          <IonItemGroup>
                <IonItemDivider><IonLabel>Clientes</IonLabel></IonItemDivider>
                              
                <SelectDropSearch
                  dataList={clientSearchData}
                  setSelectedItemFx={setClientSelected}
                  currentItem={clientSelected}
                  description={'Buscar...'}                  
                />
        </IonItemGroup>

        {!!clientSelected.id &&
        <div>
          <IonItem>
            <IonLabel style={ clientDetail.id_cliente ? {}: { backgroundColor: "yellow"} }>Id Cliente: {clientDetail.id_cliente ? clientDetail.id_cliente : 'Sin Registro HF'} </IonLabel>
          </IonItem>
          <IonItem button onClick={onShowGeoActions}>
            <IonIcon icon={locationOutline}></IonIcon> 
            <IonLabel>{clientDetail.location} </IonLabel>
          </IonItem>
        </div>
        }
        
        <IonButton onClick={onShowActions} color='success'>Acciones</IonButton>
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default ClientsHome;
