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
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useDBSync } from "../../hooks/useDBSync";
import { AppContext } from "../../store/store";
import { Login, LOGIN_KEY_PREFERENCES } from "../Session/Login";
import { App, AppInfo } from '@capacitor/app';

export const MyProfile: React.FC<RouteComponentProps> = (props) => {

  const { session,dispatchSession } = useContext(AppContext);
  const [info,setInfo] = useState<AppInfo>();
  const [envs, setEnvs] = useState<[string,string]>(['',''])
  const { couchDBSyncDownload } = useDBSync();

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
        current_token: "",
        token_expiration: ""
      });

    },3000)
  }

  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    await couchDBSyncDownload();
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
          <IonTitle>Mi Perfil</IonTitle>
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
          <p>Nombre: {session.name} {session.lastname}</p>
          <p>Usuario: {session.user}</p>
          <p>Expira el: {session.token_expiration}</p>
          <p>Centro de Costo: { !!session.branch ? session.branch[1]: '<No  />'}</p>
          
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
