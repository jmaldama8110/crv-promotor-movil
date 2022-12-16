import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonLoading,

} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { peopleOutline, personCircleOutline, lockClosedOutline, personAddOutline, notificationsCircleOutline } from 'ionicons/icons';

import ClientsHome from './pages/Home/ClientsHome';


import GroupsHome from './pages/Home/GroupsHome';
import SupervisorHome from './pages/Home/SupervisorHome';
import { Notifications } from './pages/Home/Notifications';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './globalstyles.css';
import { MyProfile } from './pages/Home/MyProfile';
import { useContext, useEffect } from 'react';
import { AppContext } from './store/store';
import { ClientsEdit } from './pages/Clients/ClientsEdit';
import { ClientsAdd } from './pages/Clients/ClientsAdd';

setupIonicReact();

const App: React.FC = () => {

  let render = true;
  const [ present, dismiss] = useIonLoading();
  const { session, dispatchSession } = useContext(AppContext);

  useEffect(()=>{ 
    if( session.loading){
      present({message: session.loading_msg});
    } else{
      dismiss();
    }
  },[session]);

  useEffect( ()=>{
    const loadRender = () =>{
      if( render ){
          ///// what needs to be rendered once goes here!  
          dispatchSession({ type:'SET_LOADING', loading: true,loading_msg: 'Sincronizando...'});
          // cuando se ejecute la sincronizacion en segundo plano

          setTimeout( ()=>{
            dispatchSession({type:'SET_LOADING',loading: false, loading_msg:''})
          },2000)
          render = false
      }
    }
    loadRender();
  },[])
  return (<IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/clients" component={ClientsHome}></Route>
          <Route path="/clients/edit/:id" component={ClientsEdit}></Route>
          <Route path="/clients/add" component={ClientsAdd}></Route>
          
          <Route exact path="/groups"><GroupsHome /></Route>
          <Route path="/supervisor"><SupervisorHome /></Route>
          <Route exact path='/notifications'><Notifications /></Route>
          <Route exact path='/myprofile'><MyProfile /></Route>
          
          <Route exact path="/"><Redirect to="/myprofile" /></Route>

        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="tab4" href="/myprofile">
            <IonIcon icon={personCircleOutline} />
            <IonLabel>Mi Perfil</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab1" href="/clients">
            <IonIcon icon={personAddOutline} />
            <IonLabel>Clientes</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/groups">
            <IonIcon icon={peopleOutline} />
            <IonLabel>Grupos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/supervisor">
            <IonIcon icon={lockClosedOutline} />
            <IonLabel>Supervisor</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab5" href="/notifications">
            <IonIcon icon={notificationsCircleOutline} />
            <IonLabel>Mensajes</IonLabel>
          </IonTabButton>

        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);
}
export default App;
