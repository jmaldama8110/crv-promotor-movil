import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonProgressBar,
    IonTitle,
    IonToolbar,
    useIonToast,
  } from "@ionic/react";
  import { useContext, useEffect, useState } from "react";
  import { RouteComponentProps } from "react-router";
  import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
  
  import { AppContext } from "../../store/store";
  import { GroupForm } from "./GroupForm";
  
  export const GroupEdit: React.FC<RouteComponentProps> = (props) => {
    
    const { dispatchGroupData, dispatchSession } = useContext(AppContext);
    const [progress, setProgress] = useState(0.1);
    const { couchDBSyncUpload } = useDBSync();
  
    let render = true;
    useEffect(() => {
        if( render ){
            render = false;
            const itemId = props.match.url.replace("/groups/edit/", "");
            dispatchSession({ type: "SET_LOADING", loading_msg: 'Cargando...',loading: true});
            db.get(itemId)
                .then( (data:any) => {
                  dispatchSession( { type: "SET_LOADING", loading_msg: "", loading: false})
                    dispatchGroupData( {
                        type: 'SET_GROUP_DATA',
                        ...data
                    })
            
                })
                .catch((err) => {
                alert("No fue posible recuperar datos del grupo: " + itemId);
                });
        }
                
    }, []);

    const onUpdate = (data:any) => {
        // Update selected Client
        const itemId = props.match.url.replace("/groups/edit/", "");
        dispatchSession({ type:"SET_LOADING", loading_msg: "Guardando...", loading: true});
        db.get(itemId).then( async (clientDbData:any) => {
          return db.put({
            ...clientDbData,
            ...data,
            
          }).then( async ()=>{
            await couchDBSyncUpload();
            dispatchSession({ type:"SET_LOADING", loading_msg: "", loading: false});
            props.history.goBack();
          })
        })
        
      };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
              <IonTitle>Editar Grupo</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <GroupForm onSubmit={onUpdate} {...props} />
        </IonContent>
      </IonPage>
    );
  };
  