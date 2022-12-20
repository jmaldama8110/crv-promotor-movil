import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonLabel,
  IonButton,
} from "@ionic/react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { AppContext } from "../../store/store";

export const MyProfile: React.FC<RouteComponentProps> = ({history}) => {

  const { session,dispatchSession } = useContext(AppContext);

  function onCloseSession (){

    dispatchSession({
      type: "SET_LOADING",
      loading: true,
      loading_msg: "Cerrando la sesion..."
    })

    setTimeout( ()=> {

      dispatchSession({
        type: "SET_LOADING",
        loading: false,
        loading_msg: ""
      })

      dispatchSession({
        type: "LOGIN",
        name: "",
        lastname: "",
        user: "",
        current_token: "",
      });

      history.push("/");
    },3000)

  }
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mi Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList className="ion-padding">
          <p>Nombre: {session.name} {session.lastname}</p>
          <p>Usuario: {session.user}</p>
          <p>token: {session.current_token}</p>
          <IonButton onClick={onCloseSession} expand="block" color="warning">Cerrar</IonButton>

        </IonList>
      </IonContent>
    </IonPage>
  );
};
