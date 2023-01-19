import {
  IonList,
  IonInput,
  IonLabel,
  IonButton,
  IonItem,
  useIonLoading,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Preferences } from "@capacitor/preferences";
import { AppContext } from "../../store/store";
import api from "../../api/api";
import jwt_decode from "jwt-decode";
export const LOGIN_KEY_PREFERENCES = 'promotor-movil-preferences';


/// UserSession and UserInfo combine API format response when login
interface UserInfo {
  name: string;
  lastname: string;
  second_lastname: string;
  email: string;
  current_token: string;
  branch: [number, string];
}

interface UserSession {
  user: UserInfo,
  token:string;
}



export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { dispatchSession } = useContext(AppContext);

  const [user,setUser] = useState<string>('promotor@grupoconserva.mx');
  const [pass,setPass] = useState<string>('123456');

  const [present, dismiss] = useIonLoading();

  async function onLogin() {

    try {
     const apiResponse =  await api.post("/users/login",{
        email: user,
        password: pass
      });
      
      let usrInfo: UserSession = apiResponse.data;
      
      dispatchSession({ type: "SET_LOADING", loading: true, loading_msg: "Iniciando sesion",});
      const decoded:any = jwt_decode(usrInfo.token);
      const localDate = new Date(decoded.sync_info.sync_expiration);

  
      setTimeout( async () => {
        await Preferences.set({
          key: LOGIN_KEY_PREFERENCES,
          value: JSON.stringify(usrInfo),
        });
        
        dispatchSession({
          type: "LOGIN",
          name: usrInfo.user.name,
          lastname: usrInfo.user.lastname,
          user: usrInfo.user.email,
          branch: apiResponse.data.user.employee_id.branch,
          current_token: usrInfo.token,
          token_expiration: `${localDate.toLocaleDateString() },${localDate.toLocaleTimeString()}`
        });
  
        dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "",});
      }, 3000);
    }
    catch(e){
      alert("No fue posible iniciar la sesion!, verifica tus credenciales");
    }

  }
  useEffect(() => {
    /// check wheter there is an user already saved localy
    async function loadDataFromLocalStorage() {
      
      const { value } = await Preferences.get({ key: LOGIN_KEY_PREFERENCES });
      
      if (value) {
          const userLocalStorage = JSON.parse(value);
          const decoded:any = jwt_decode(userLocalStorage.token);
          const localDate = new Date(decoded.sync_info.sync_expiration);
          
          dispatchSession({
            type: "LOGIN",
            name: userLocalStorage.user.name,
            lastname: userLocalStorage.user.lastname,
            user: userLocalStorage.user.email,
            branch: userLocalStorage.user.employee_id.branch,
            current_token: userLocalStorage.token,
            token_expiration: `${localDate.toLocaleDateString() },${localDate.toLocaleTimeString()}`
          });
      }
    }

    loadDataFromLocalStorage();

  }, []);

  return (
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
  );
};
