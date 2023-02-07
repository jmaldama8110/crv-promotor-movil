import { IonButton, IonContent, IonHeader, IonItemDivider, IonItemGroup, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, RefresherEventDetail, useIonActionSheet } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { db } from '../../db';
import type { OverlayEventDetail } from '@ionic/core';

import './ClientsHome.css';
import {
  SearchData,
  SelectDropSearch,
} from "../../components/SelectDropSearch";
import { useHistory } from 'react-router';
import { AppContext } from '../../store/store';
import { useDBSync } from '../../hooks/useDBSync';



const ClientsHome: React.FC = () => {


  const [present] = useIonActionSheet();
  const [actions, setActions] = useState<OverlayEventDetail>();
  
  const { dispatchClientData } = useContext(AppContext);
  const { prepareIndex } = useDBSync();
  let history = useHistory();
  
  const [clientSearchData,setClientSearchData ] = useState<SearchData[]>([]);
  const [clientSelected, setClientSelected] = useState<SearchData>({
    id: '',
    rev: "",
    etiqueta: "",
  });



  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(async () => {
      await prepareIndex("CLIENT", ["couchdb_type"])
      event.detail.complete();
    }, 2000);
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
      { text: 'Datos Bancarios', data: { action: '' } },
      { text: 'Cancelar', role: 'cancel', data: { action: 'cancel'} },
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

        
      }
    }
  },[actions])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Clientes</IonTitle>
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

        <IonButton onClick={onShowActions} color='medium'>Acciones</IonButton>


        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default ClientsHome;
