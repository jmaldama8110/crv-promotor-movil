import {
  IonList,
  IonInput,
  IonLabel,
  IonButton,
  IonItem,
  IonImg,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Preferences } from "@capacitor/preferences";
import { AppContext } from "../../store/store";
import api from "../../api/api";
import jwt_decode from "jwt-decode";
import logoConserva from '../../assets/logo-conserva-new.png';


export const LOGIN_KEY_PREFERENCES = 'promotor-movil-preferences';

/// UserSession and UserInfo combine API format response when login
interface UserInfo {
  name: string;
  lastname: string;
  second_lastname: string;
  email: string;  
  branch: [number, string];
  officer_rank: [number, string];
  token: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { dispatchSession } = useContext(AppContext);

  const [user,setUser] = useState<string>('');
  const [pass,setPass] = useState<string>('');

  async function onLogin() {

    try {
     const apiResponse =  await api.post("/users/hf/login",{
        user,
        password: pass
      });
      
      let usrInfo: UserInfo = apiResponse.data;
      
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
          name: usrInfo.name,
          lastname: usrInfo.lastname,
          user: usrInfo.email,
          branch: usrInfo.branch,
          current_token: usrInfo.token,
          officer_rank: usrInfo.officer_rank,
          token_expiration: `${localDate.toLocaleDateString() },${localDate.toLocaleTimeString()}`
        });
  
        dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "",});
      }, 1500);
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
            name: userLocalStorage.name,
            lastname: userLocalStorage.lastname,
            user: userLocalStorage.email,
            branch: userLocalStorage.branch,
            officer_rank: userLocalStorage.officer_rank,
            current_token: userLocalStorage.token,
            token_expiration: `${localDate.toLocaleDateString() },${localDate.toLocaleTimeString()}`
          });
      } 
    }

    loadDataFromLocalStorage();

  }, []);
  

  return (
        <IonList className="ion-padding">
          <div className="image-container shadow margin-left-md margin-right-md">
            <IonImg src={logoConserva} alt='Certification social'></IonImg>
            <p>Conserva Movil </p>
          </div>
          <p></p>
          <IonItem>
            <IonLabel position="floating">Usuario</IonLabel>
            <IonInput type="text" value={user} onIonChange={(e:any) => setUser(e.detail.value)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput type="password" value={pass} onIonChange={(e:any)=> setPass(e.detail.value)}></IonInput>
          </IonItem>
          <p></p>
          <IonButton expand="block" onClick={onLogin}>Login</IonButton>
      
        </IonList>
  );
};
