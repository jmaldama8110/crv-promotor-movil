import { useIonToast } from "@ionic/react";
import { useContext } from "react";
import { db, remoteDB } from "../db";
import { AppContext } from "../store/store";


export function useDBSync () {

    const { dispatchSession } = useContext(AppContext)
    const [showToast] = useIonToast();

    async function couchDBSync () {
    try{
        dispatchSession({ type: "SET_LOADING", loading: true, loading_msg: "Subiendo datos..."});
        db.replicate.to(remoteDB).on('complete', function () {
          console.log('Local => RemoteDB, Ok!')
          showToast("Ok, se guardo el registro!",1500);
    
        }).on('error', function (err) {
          showToast("Ok, se guardo el registro!, pero no estas conectado!",1500);
        });
      }
      catch(error){
        console.log(error);
      }           
        dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
    }
    return { couchDBSync }
}