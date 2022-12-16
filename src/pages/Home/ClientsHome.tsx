import { IonButton, IonContent, IonHeader, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { db } from '../../db';

import './ClientsHome.css';
import {
  SearchData,
  SelectDropSearch,
} from "../../components/SelectDropSearch";
// import { AppContext } from '../../store/store';
import { useHistory } from 'react-router';


const ClientsHome: React.FC = () => {

  // const { session, dispatchSession } = useContext(AppContext);
  let history = useHistory();
  let render = true;


  const [ clients, setClients] = useState<SearchData[]>([]);

  const [clientSearchData,setClientSearchData ] = useState<SearchData[]>([]);
  const [clientSelected, setClientSelected] = useState<SearchData>({
    id: 0,
    etiqueta: "",
  });

  useEffect( ()=>{
    if( render ){

      /// Llena datos de clientes HF
      db.createIndex({
        index: { fields: ['couchdb_type'] }
      }).then( function() {
        console.log('Index, created...');
        db.find({
          selector:{
            couchdb_type: "HF_CLIENT"
          }
        }).then( data =>{
            const newData = data.docs.map( (i:any)=>( {id: i._id, etiqueta: `${i.name} ${i.lastname} ${i.second_lastname}`} ))
            setClientSearchData( newData);
            console.log('Clients Loaded: ', newData.length)

        })
      }).catch(e =>{
        console.log('Index creation error...',e);
      });



      render = false;
    }
  },[])

  useEffect( ()=>{
    if( clientSelected.id ){
      /// if selected a Client
      history.push(`/clients/edit/${clientSelected.id}`);
    }
  },[clientSelected])


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

        <IonButton color='medium' className='width-md margin-bottom-sm' expand='block' routerLink='/clients/add'>Agregar</IonButton>
        <IonItemDivider><IonLabel>Clientes Recientes</IonLabel></IonItemDivider>

        <IonList className='ion-padding'>
          <IonLabel>No hay busquedas recientes...</IonLabel>
        </IonList>

        <IonList>
          <IonItemDivider><IonLabel>Buscar</IonLabel></IonItemDivider>
          <SelectDropSearch
                dataList={clientSearchData}
                setSelectedItemFx={setClientSelected}
                currentItem={clientSelected}
                description={'Buscar...'}
              />
   
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ClientsHome;
