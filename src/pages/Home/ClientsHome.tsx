import { IonButton, IonContent, IonHeader, IonItemDivider, IonItemGroup, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonActionSheet } from '@ionic/react';
import { useEffect, useState } from 'react';
import { db } from '../../db';
import type { OverlayEventDetail } from '@ionic/core';

import './ClientsHome.css';
import {
  SearchData,
  SelectDropSearch,
} from "../../components/SelectDropSearch";
import { useHistory } from 'react-router';

import { Guarantee } from '../../reducer/GuaranteesReducer';


const ClientsHome: React.FC = () => {


  const [present] = useIonActionSheet();
  const [actions, setActions] = useState<OverlayEventDetail>();
  
  let history = useHistory();
  let render = true;

  const [clientSearchData,setClientSearchData ] = useState<SearchData[]>([]);
  const [clientSelected, setClientSelected] = useState<SearchData>({
    id: 0,
    rev: "",
    etiqueta: "",
  });


  

  useEffect( ()=>{

    

    if( render ){
     db.createIndex( {
      index: { fields: [ "couchdb_type"] }
     }).then( function (){
        console.log('Index, created...');
        db.find({
          selector: {
            couchdb_type: "CLIENT"
          }
        }).then( data =>{
          const newData = data.docs.map( (i:any)=>( {id: i._id, rev: i._rev, etiqueta: `${i.name} ${i.lastname} ${i.second_lastname}`} ))
          setClientSearchData( newData);
          console.log('Clients Loaded: ', newData.length)
      })
     })
      render = false;
    }
  },[])


  function onShowActions(){
    const buttons = clientSelected.id ? 
    [
      { text: 'Nuevo', role:"destructive",data: { action: 'add', routerLink:'/clients/add' } },
      { text: 'Editar', data: { action:"edit", routerLink: `/clients/edit/${clientSelected.id}` } },
      { text: 'Ver Solicitudes', data: { action: 'loanapps', routerLink: `/clients/${clientSelected.id}/loanapps`} },
      { text: 'Datos Socioseconomicos', data: { action: 'edit-socioeconomics', routerLink:`/clients/socioeconomics/edit/${clientSelected.id}` } },
      { text: 'Ver Garantias', data: { action: 'guarantees', routerLink:  `/clients/${clientSelected.id}/guarantees` } },
      { text: 'Personas Relacionadas', data: { action: '' } },
      { text: 'Cancelar', role: 'cancel', data: { action: 'cancel'} },
    ] :
      [
        { text: 'Nuevo', role:"destructive",data: { action: 'add', routerLink:'/clients/add' } },
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
        if(actions.data.action === 'add')
          history.push(actions.data.routerLink);
        if(actions.data.action === 'edit')
          history.push(actions.data.routerLink);
        if( actions.data.action === 'edit-socioeconomics')
          history.push(actions.data.routerLink);
        if( actions.data.action === 'loanapps')
            history.push(actions.data.routerLink);
        if( actions.data.action === 'guarantees')
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
      <IonContent fullscreen>
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
