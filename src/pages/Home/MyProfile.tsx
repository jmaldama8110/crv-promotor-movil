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
} from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { AppContext } from "../../store/store";
import { Login, LOGIN_KEY_PREFERENCES } from "../Session/Login";

export const MyProfile: React.FC<RouteComponentProps> = (props) => {

  const { session,dispatchSession } = useContext(AppContext);

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

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      
      event.detail.complete();
    }, 2000);
  }

  
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
    </IonPage>
  );
};
