import { IonButton, IonContent, IonHeader, IonItemDivider, IonItemGroup, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonActionSheet } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { SearchData, SelectDropSearch } from '../../components/SelectDropSearch';
import { db } from '../../db';
import { AppContext } from '../../store/store';
import './GroupsHome.css';

const GroupsHome: React.FC<RouteComponentProps> = ({history}) => {

  const [present] = useIonActionSheet();
  const [actions, setActions] = useState<OverlayEventDetail>();
  const { dispatchGroupData } = useContext(AppContext);
  const [clientSearchData,setClientSearchData ] = useState<SearchData[]>([]);
  const [clientSelected, setClientSelected] = useState<SearchData>({
    id: '',
    rev: "",
    etiqueta: "",
  });
  let render = true;

  useEffect( ()=>{
    if( render ){
     db.createIndex( {
      index: { fields: [ "couchdb_type"] }
     }).then( function (){
        console.log('Index, created...');
        db.find({
          selector: {
            couchdb_type: "GROUP"
          }
        }).then( data =>{
          const newData = data.docs.map( (i:any)=>( {id: i._id, rev: i._rev, etiqueta: `${i.group_name}`} ))
          
          setClientSearchData( newData);
          console.log('Groups Loaded: ', newData.length)
      })
     })
      render = false;
    }
  },[])


  function onShowActions(){

    const buttons = clientSelected.id ? 
    [
      { text: 'Nuevo Grupo', role:"destructive",data: { action: 'add', routerLink:'/groups/add' } },
      { text: 'Editar', data: { action:"edit", routerLink: `/groups/edit/${clientSelected.id}` } },
      { text: 'Solicitudes & Creditos', data: { action: 'loanapps', routerLink: `/groups/${clientSelected.id}/loanapps`} },
      { text: 'Garantia Liquida', data: { action: 'guarantees', routerLink:  `/groups/${clientSelected.id}/guarantees` } },
      { text: 'Cancelar', role: 'cancel', data: { action: 'cancel'} },
    ] :
      [
        { text: 'Nuevo Grupo', role:"destructive",data: { action: 'add', routerLink:'/groups/add' } },
        { text: 'Traer Desde...',data: { action: 'add-hf', routerLink:'/groups/add-from-hf' } },
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
          <IonTitle>Grupos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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

        <IonButton onClick={onShowActions} color='medium'>Acciones</IonButton>


        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default GroupsHome;
