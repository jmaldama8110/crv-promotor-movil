import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast } from "@ionic/react";
import { useContext, useState } from "react";
import { RouteComponentProps } from "react-router";
import api from "../../api/api";
import { db, remoteDB } from "../../db";
import { ClientData } from "../../reducer/ClientDataReducer";
import { AppContext } from "../../store/store";
import { ClientForm } from "./ClientForm";

export const ClientsFromHF: React.FC<RouteComponentProps> = ({ history}) => {

    
    const [curp, setCurp ] = useState<string>('');
    const [presentAlert] = useIonAlert();
    const [ present, dismiss] = useIonLoading();
    const { session, dispatchSession, dispatchClientData } = useContext(AppContext);
    const [hide, setHide] = useState<boolean>(false)
    const [showToast] = useIonToast();

    async function onSearch () {
      
        try {
            present( {message:'Buscando...'})
            db.createIndex( {
              index: { fields: ["couchdb_type"]}
            }).then( ()=>{
              db.find({
                selector: { 
                  couchdb_type:'CLIENT'
                }
              }).then( (data:any) =>{
                if( data.docs.find( (i:any)=>(i.curp === curp)) ){
                    throw new Error('Fallo, el regitra ya existe');
                }
              })
            })
            
            api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
            const apiRes = await api.get(`/clients/exits?identityNumber=${curp}`);
            if( !apiRes.data.id_cliente ){
              throw new Error('Fallo la busqueda');
            } else  {
              const apiRes2 = await api.get(`/clients/hf?identityNumber=${curp}&externalId=${apiRes.data.id_cliente}`);
              const newData = apiRes2.data as ClientData
              
              if( !(newData.branch[0] == session.branch[0]) )
              {
                throw new Error('No puedes modificar datos fuera de tu sucursal');
              }
              dispatchClientData({
                  type: 'SET_CLIENT',
                  ...newData,
                  _id:'0'
                });
                setHide(true);  
              }
              dismiss();
        }
        catch(err){
            dismiss();
            console.log(err);
            presentAlert({
                header: 'Este registro no fue encontrado o ya existe en la App',
                subHeader: 'No existe este CURP en el HF o ya fue dado de alta en la App por otra persona',
                message: 'No fue posible!',
                buttons: ['OK'],
              })
        }
    }

    async function onSave( data:any) {
      /// Save new record

        db.put({
          ...data,
          couchdb_type: 'CLIENT',
          _id: Date.now().toString(),
          status: [2,'Aprovado'],
        }).then( (doc)=>{

          try{
            dispatchSession({ type: "SET_LOADING", loading: true, loading_msg: "Subiendo datos..."});
            db.replicate.to(remoteDB).on('complete', function () {
              console.log('Local => RemoteDB, Ok!')
              dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
              history.goBack();
              showToast("Ok, se guardo el registro!",1500);
        
            }).on('error', function (err) {
              dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
              history.goBack();
              showToast("Ok, se guardo el registro!, pero no estas conectado!",1500);
            });
          }
          catch(error){
            console.log(error);
          }          

        }).catch( e =>{
          presentAlert({
            header: 'No fue posible guardar',
            subHeader: 'Ooops algo paso',
            message: 'No fue posible guardar!',
            buttons: ['OK'],
          })
        })

    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Buscar Cliente en Sistema</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Importar Datos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList className='ion-padding'>
            { !hide &&
              <div>
              <IonItem>
                  <IonLabel position="floating">Ingresa el CURP del Cliente</IonLabel>
                  <IonInput type='text' value={curp}  onIonChange={ (e) => setCurp(e.detail.value!)} onIonBlur={(e:any)=>setCurp(e.target.value.toUpperCase())}></IonInput>
              </IonItem>
              <IonButton onClick={onSearch} disabled={!curp}>Buscar</IonButton>
            </div>
            }
            {hide && <ClientForm onSubmit={onSave} />}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
