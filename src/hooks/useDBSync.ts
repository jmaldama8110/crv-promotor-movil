import { useIonToast } from "@ionic/react";
import { useContext } from "react";
import { db, remoteDB } from "../db";
import { AppContext } from "../store/store";
import jwt_decode from "jwt-decode";
import { Preferences } from "@capacitor/preferences";
import { LOGIN_KEY_PREFERENCES } from "../pages/Session/Login";

interface SyncInfo {
  local_target: string;
  remote_target: string;
  sync_expiration: Date;
}

export function useDBSync () {

    const { dispatchSession, session } = useContext(AppContext)
    const [showToast] = useIonToast();
    
    async function couchDBSyncUpload () {
    try{
        dispatchSession({ type: "SET_LOADING", loading: true, loading_msg: "Subiendo datos..."});
        db.replicate.to(remoteDB).on('complete', function () {
          console.log('Local => RemoteDB, Ok!')
          showToast("Sincronizacion OK! (local -> Remoto)",1500);
    
        }).on('error', function (err) {
          console.log(err);
          showToast("Ok, se guardo el registro!, pero sin conexion!",1500);
        });
      }
    
      catch(error){
        console.log(error);
      }           
        dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
    }

    async function couchDBSyncDownload () {
      dispatchSession({
        type: "SET_LOADING",
        loading: true,
        loading_msg: "Bajando cambios ...",
      });
      try{
        await db.replicate.from(remoteDB);
        dispatchSession({type: "SET_LOADING",loading: false,loading_msg: ""});
        console.log('Remote => Local, Ok!');
      }
      catch(e:any){
        console.log(e);
        dispatchSession({type: "SET_LOADING",loading: false,loading_msg: ""});
        showToast('Estas en modo sin conexion...'+e.message, 1500)
      }
      // db.replicate.from( remoteDB).on('complete', ()=>{
        
      //   dispatchSession({type: "SET_LOADING",loading: false,loading_msg: ""});
      //   console.log('Remote => Local, Ok!');
        
      // }).on('error', (err:any)=>{
        
      //   dispatchSession({type: "SET_LOADING",loading: false,loading_msg: ""});
      //   showToast('Estas en modo sin conexion...'+err.message, 1500)
      // })
    }


    async function evaluateTokenExpiration () {
    /**
     * Evaluar si el token aun esta vigente
     */
    let hoursDiff = 0;

    if( session.current_token ){
      const decoded:any = jwt_decode(session.current_token);
      const sync: SyncInfo = decoded.sync_info
      if( sync.sync_expiration ){
        const queryDate = new Date(sync.sync_expiration);
        const now = new Date();
        const timeDiff =  queryDate.getTime() - now.getTime();
          // To calculate the no. of Hours between two dates
        hoursDiff = timeDiff / (1000 * 3600 );
        if( hoursDiff <= 0 ){
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
                officer_rank:  [0,""],
                current_token: "",
                token_expiration: ""
              });
              
        
            },3000)
          
        }
      }

    }
    }
    
    return { couchDBSyncUpload, couchDBSyncDownload , evaluateTokenExpiration }
}