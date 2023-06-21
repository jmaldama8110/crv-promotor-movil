import { Browser } from '@capacitor/browser';
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, RefresherEventDetail, useIonActionSheet } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { locationOutline } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { SearchData, SelectDropSearch } from '../../components/SelectDropSearch';
import { db } from '../../db';
import { useDBSync } from '../../hooks/useDBSync';
import { AppContext } from '../../store/store';
import './GroupsHome.css';

const GroupsHome: React.FC<RouteComponentProps> = ({history}) => {

  const [present] = useIonActionSheet();
  const [actions, setActions] = useState<OverlayEventDetail>();
  const [geoActions, setGeoActions] = useState<OverlayEventDetail>();
  const { couchDBSyncUpload } = useDBSync();

  const { dispatchGroupData, dropoutMembers } = useContext(AppContext);
  const [clientSearchData, setClientSearchData ] = useState<SearchData[]>([]);
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

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    
    setTimeout(async () => {
      await couchDBSyncUpload();
      const data:any = await db.find({ selector: { couchdb_type:"GROUP" }});
      const newData: SearchData[] = data.docs.map( (i:any) =>( { id: i._id, rev: i._rev, etiqueta: `${i.group_name}` }))
      setClientSearchData( newData)
      event.detail.complete();
    }, 2000);
  }

  function onShowActions(){

    const buttons = clientSelected.id ? 
    [
      { text: 'Nuevo Grupo', role:"destructive",data: { action: 'add', routerLink:'/groups/add' } },
      { text: 'Editar', data: { action:"edit", routerLink: `/groups/edit/${clientSelected.id}` } },
      { text: 'Solicitudes & Creditos', data: { action: 'loanapps', routerLink: `/groups/${clientSelected.id}/loanapps`} },
      { text: 'Tarjeton de Pago', data: { action: 'tarjeton', routerLink:  `/wheretopay/${clientSelected.id}` } },
      { text: 'Ver Documentos', data: { action: 'docs', routerLink:  `/docs` } },
      { text: 'Cancelar', role: 'cancel', data: { action: 'cancel'} },
    ] :
      [
        { text: 'Nuevo Grupo', role:"destructive",data: { action: 'add', routerLink:'/groups/add' } },
        { text: 'Traer Desde...',data: { action: 'add-hf', routerLink:'/groups/import' } },
        { text: 'Cancelar', role: 'cancel', data: { action: 'cancel'} },  
      ]
      present(
        { header: 'Mis Clientes',
          subHeader: 'Acciones / tareas:',
          buttons,
            onDidDismiss: ({ detail }) => setActions(detail),
          })
  }

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

  

  useEffect( ()=>{

    if( actions ){
      if( actions.data){
        if(actions.data.action === 'add'){
          dispatchGroupData({ type: "RESET_GROUP_DATA"});
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
        if( actions.data.action === 'tarjeton')
            history.push(actions.data.routerLink);
        if( actions.data.action === 'related-people')
            history.push(actions.data.routerLink);
        if( actions.data.action === 'docs')
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
      const data = await db.find( { selector: { couchdb_type: "GROUP"}});
      const foundClient:any = data.docs.find( (i:any) => i._id === clientSelected.id )
      if( foundClient) {
        
        setClientDetail( {
          id_cliente: foundClient.id_cliente,
          location: `${foundClient.address.colony[1]}, ${foundClient.address.city[1]}`,
          coords: foundClient.coordinates
        } );
      }
    }

    loadClientData();
  },[clientSelected])


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Grupos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Grupos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList className='ion-padding height-full'>
          <IonItemGroup>
                <IonItemDivider><IonLabel>Mis Grupos</IonLabel></IonItemDivider>
                              
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
            <IonLabel>Id Cliente: {clientDetail.id_cliente ? clientDetail.id_cliente: 'Sin Registro HF'} </IonLabel>
          </IonItem>
          <IonItem button onClick={onShowGeoActions}>
            <IonIcon icon={locationOutline}></IonIcon> 
            <IonLabel>{clientDetail.location} </IonLabel>
          </IonItem>
        </div>
        }
        
        <IonButton onClick={onShowActions} color='medium'>Acciones</IonButton>
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default GroupsHome;
