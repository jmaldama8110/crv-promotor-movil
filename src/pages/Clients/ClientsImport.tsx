import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import api from "../../api/api";
import { AppContext } from "../../store/store";
import { db } from "../../db";
import { clientDataDef } from "../../reducer/ClientDataReducer";
import { useDBSync } from "../../hooks/useDBSync";


let clientDataFromApi:any = undefined;

export function ClientsImport() {

  const [fullname, setFullName] = useState<string>("");
  const [curp,setCurp] = useState<string>('');
  const [branch,setBranch] = useState<[number,string]>([0,'']);

  const { session } = useContext(AppContext);
  const [ present, dismiss] = useIonLoading();
  const { couchDBSyncDownload, couchDBSyncUpload } = useDBSync();
  let render = true;

  async function onSearchByCurp() {
    try {
        present({ message: "Buscando..."})

        await db.createIndex({ index: { fields: ["couchdb_type"]}});

        const query = await db.find( { selector: { couchdb_type: "CLIENT" }})
        const clientFound = query.docs.find( (i:any) => i.curp === curp);

        if( clientFound){
          alert('Cliente ya existe en la App');
          dismiss();
          return ;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
        const apiRes = await api.get(`/clients/exists?identityNumber=${curp}`);
        /// solo si existen resultados, procede a traer todos los datos del cliente
        
        const idCliente = apiRes.data.id_cliente
        if( !!idCliente ){ // if not undefined
            const apiRes2 = await api.get(`/clients/hf?externalId=${idCliente}`);
            setBranch( apiRes2.data.branch);
            setFullName(`${apiRes2.data.name} ${apiRes2.data.lastname} ${apiRes2.data.second_lastname}`)
            clientDataFromApi = apiRes2.data;
        } else {
          alert('No hay coincidencias...')
        }


        
        dismiss();
    } catch (e) {
        dismiss();
        alert('Ocurrio un error, intentelo de nuevo...')
    }
  }

  async function onImportClient(){

    try{

      if( clientDataFromApi.branch[0] != session.branch[0] ){
        throw new Error('El cliente corresponde a otra sucursal, solicite ayuda')
      }

      present({ message: "Guardando..."});
      const newClientId = Date.now().toString();    
      await db.put({  ...clientDataDef,
                      ...clientDataFromApi, 
                      business_data: {
                        ...clientDataDef.business_data,
                        ...clientDataFromApi.business_data
                      },
                      couchdb_type: 'CLIENT',
                      _id: newClientId,
                      status: [2,'Aprovado'] }); 
      await couchDBSyncUpload(); 
      onClearAll();
      dismiss();
      
    }
    catch(e){
      alert(e);
      dismiss();
    }
                    
  }

  function onClearAll(){
    setCurp('');
    setBranch([0,'']);
    setFullName('');
  }

  useEffect( ()=>{
    async function LoadData(){
      await couchDBSyncDownload();
    }
    if( render ){
      render = false;
      LoadData();
    } 
  },[])
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Buscar Cliente en Sistema</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList className="ion-padding">
          <IonItem>
            <IonItemDivider>
              <IonLabel>CURP del cliente:</IonLabel>
            </IonItemDivider>
            <IonLabel position="floating">Ingresa el CURP</IonLabel>
            <IonInput
              type="text"
              value={curp}
              onIonChange={(e) => setCurp(e.detail.value!)}
              onIonFocus={ ()=> onClearAll()}
              onIonBlur={(e: any) => setCurp(e.target.value.toUpperCase())}
            ></IonInput>
          </IonItem>
          
          {!fullname && <IonButton onClick={onSearchByCurp} disabled={!curp}>Buscar</IonButton>}
          {!!fullname && <IonButton color='success' onClick={onImportClient}>Importar</IonButton>}

          <IonItemDivider><IonLabel>Resultados</IonLabel></IonItemDivider>
          <IonItem> <IonLabel>Nombre completo: {fullname}</IonLabel></IonItem>
          <IonItem><IonLabel>Sucursal: {branch[1]}</IonLabel></IonItem>

        </IonList>
      </IonContent>
    </IonPage>
  );
}
