import { IonButton, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { db } from '../../db';

import './ClientsHome.css';
import {
  SearchData,
  SelectDropSearch,
} from "../../components/SelectDropSearch";
import { AppContext } from '../../store/store';

const ClientsHome: React.FC = () => {


  const { session, dispatchSession } = useContext(AppContext);
  let render = true;

  const [clientSearchData,setClientSearchData ] = useState<SearchData[]>([]);
  const [clientSelected, setClientSelected] = useState<SearchData>({
    id: 0,
    etiqueta: "",
  });

  useEffect( ()=>{
    if( render ){
      /// run once
      db.find({
        selector: { couchdb_type: 'HF_CLIENT'}
      }).then( data =>{
            const newData = data.docs.map( (i:any)=>( {id: i._id, etiqueta: `${i.name} ${i.lastname} ${i.second_lastname}`} ))
            setClientSearchData( newData);
            console.log('Clients Loaded: ',newData.length)
      }).catch(err =>{
        alert('No fue posible cargar clientes...')
      })

      render = false;
    }
  },[])

  useEffect( ()=>{
    if( clientSelected.id ){
      /// if selected a Client
      
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

        <IonList className='ion-padding height-full'>
        
        <IonButton color='medium' className='width-md margin-bottom-sm' expand='block' routerLink='/clients/add'>Agregar</IonButton>

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
