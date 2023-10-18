import { Preferences } from "@capacitor/preferences";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonButton,
    RefresherEventDetail,
    IonRefresher,
    IonRefresherContent,
    IonFooter,
    IonItem,
    IonLabel,
    IonImg, IonIcon,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router"; 
import { useDBSync } from "../../hooks/useDBSync";
import { AppContext } from "../../store/store";
import { Login, LOGIN_KEY_PREFERENCES } from "../Session/Login";
import { App, AppInfo } from '@capacitor/app';


import officerRankN1 from '../../assets/officer_rank_n1.png';
import officerRankN2 from '../../assets/officer_rank_n2.png';
import officerRankN3 from '../../assets/officer_rank_n3.png';
import {personCircleOutline} from "ionicons/icons";

export const MyProfile: React.FC<RouteComponentProps> = (props) => {

  const { session,dispatchSession } = useContext(AppContext);
  const [info,setInfo] = useState<AppInfo>();
  const [envs, setEnvs] = useState<[string,string]>(['',''])
  const { couchDBSyncDownload, couchDBSyncUpload } = useDBSync();

  function onCloseSession (){

    dispatchSession({
      type: "SET_LOADING",
      loading: true,
      loading_msg: "Cerrando la sesion..."
    })

    setTimeout( async ()=> {

      dispatchSession({
        type: "SET_LOADING",
        loading: false,
        loading_msg: ""
      })
      await Preferences.remove({ key: LOGIN_KEY_PREFERENCES });

      dispatchSession({
        type: "LOGIN",
        name: "",
        lastname: "",
        user: "",
        branch: [0,""],
        officer_rank: [0,""],
        current_token: "",
        token_expiration: ""
      });

    },3000)
  }

  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    await couchDBSyncUpload();
    // await couchDBSyncDownload();
      event.detail.complete();
   }

   useEffect(()=>{
    async function LoadAppInfo(){
      const data: AppInfo = await App.getInfo();
      setInfo(data); 
      
    }
    setEnvs([`Host: ${process.env.REACT_APP_COUCHDB_HOST}`, `DB: ${process.env.REACT_APP_COUCHDB_NAME}`])
    
    LoadAppInfo();
   },[])

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonTitle><IonIcon icon={personCircleOutline}  /> Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mi Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
        {!session.user &&
        <Login {...props}/>

        }
        {session.user &&
          <IonList className="ion-padding">
            <IonItem> <IonLabel>Hola! {session.name} </IonLabel> </IonItem>
            <IonItem><IonLabel>Usuario: {session.user}</IonLabel></IonItem>
            <IonItem><IonLabel>Sesion Expira: {session.token_expiration}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Sucursal: { !!session.branch ? session.branch[1]: 'No'}</IonLabel>
            </IonItem>
          <p></p>
          <div className="image-container">
            { session.officer_rank[0] == 4 && <IonImg src={officerRankN1} alt='Certification social Nivel 1'></IonImg>}
            { session.officer_rank[0] == 5 && <IonImg src={officerRankN2} alt='Certification social Nivel 2'></IonImg>}
            { session.officer_rank[0] == 6 && <IonImg src={officerRankN3} alt='Certification social Nivel 3'></IonImg>}
            { (session.officer_rank[0] == 4 ||
              session.officer_rank[0] == 5 ||
              session.officer_rank[0] == 6) && <p>Felicidades! has alcando el nivel de certificacion </p>}
          </div>
          <IonButton onClick={onCloseSession} expand="block" color="tertiary">Cerrar Sesion</IonButton>
        </IonList>}
        
      </IonContent>
      <IonFooter>
        <IonToolbar>
            <p className="margin-auto text-center xs">{envs[0]}</p>
            <p className="margin-auto text-center xs">{envs[1]}</p>
            <p className="margin-auto text-center xs">{ info ? `${info?.name} (${info?.version}) - build ${info?.build}`: 'Web version'}  </p>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
