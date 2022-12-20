import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonInput,
  IonLabel,
  IonButton,
  IonItem,
} from "@ionic/react";
import { useContext, useState } from "react";
import { RouteComponentProps } from "react-router";
import { AppContext } from "../../store/store";

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { dispatchSession } = useContext(AppContext);

  const [user,setUser] = useState<string>('josman@gmail.com');
  const [pass,setPass] = useState<string>('s0m3t0ughpassw0rd1!');

  function onLogin() {
    dispatchSession({
      type: "SET_LOADING",
      loading: true,
      loading_msg: "Iniciando sesion",
    });
    setTimeout(() => {
      dispatchSession({
        type: "LOGIN",
        name: "JOSMAN",
        lastname: "Gmz",
        user: "josman@gmail.com",
        current_token: "e3u29e2839",
      });
      dispatchSession({
        type: "SET_LOADING",
        loading: false,
        loading_msg: "",
      });
      history.push("/myprofile");
    }, 3000);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inicio de Sesion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList className="ion-padding">
          <IonItem>
            <IonLabel position="floating">Usuario</IonLabel>
            <IonInput type="text" value={user}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput type="password" value={pass}></IonInput>
          </IonItem>

          <IonButton expand="block" onClick={onLogin}>Login</IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
