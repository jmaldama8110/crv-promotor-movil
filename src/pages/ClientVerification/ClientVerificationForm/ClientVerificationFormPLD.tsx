import { IonButton, IonCheckbox, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonTextarea } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { SearchData, SelectDropSearch } from "../../../components/SelectDropSearch";
import { ButtonSlider } from "../../../components/SliderButtons";
import { db } from "../../../db";
import { AppContext } from "../../../store/store";


export const ClientVerificationFormPLD: React.FC<{ onNext:any, onSetProgress:any}> = ({onNext, onSetProgress})=>{

    const { clientVerification } = useContext(AppContext);

    const [professionCatalog, setProfessionCatalog] = useState<SearchData[]>([]);
    const [profession, setProfession] = useState<SearchData>({id: "",etiqueta: ""});
  
    const [economicActivityCatalog, setEconomicActivityCatalog] = useState<SearchData[]>([]);
    const [economicActivity, setEconomicActivity] = useState<SearchData>({id: "",etiqueta: ""});
  
    const [detectOtherActivity, setDetectOtherActivity] = useState<string>('');
    const [linksOtherSociety, setLinksOtherSociety] = useState<boolean>(false);
    const [linksOtherAssociation, setLinksOtherAssociation] = useState<boolean>(false);

    const [ppeLevel, setPpeLevel] = useState<string>('');
    const [ppeCharge, setPpeCharge] = useState<string>('');
    const [gobernmentWorkName, setGobernmentWorkName] = useState<string>('');
    const [gobernmentWorkAddress, setGobernmentWorkAddress] = useState<string>('');
    const [gobernmentFunctions, setGobernmentFunctions] = useState<string>('');
    const [gobernmentResponsabilities, setGobernmentResponsibilities] = useState<string>('');
    const [detectExternalProvider, setDetectExternalProvider] = useState<boolean>(false);
    const [detectRealOwner, setDetectRealOwner] = useState<boolean>(false);
    const [detectCommets, setDetectCommets] = useState<string>('');


    const onSend = () =>{
      const data = {
        profession,
        economicActivity,
        detectOtherActivity,
        linksOtherSociety,
        linksOtherAssociation,
        ppeLevel,
        ppeCharge,
        gobernmentWorkName,
        gobernmentWorkAddress,
        gobernmentFunctions,
        gobernmentResponsabilities,
        detectExternalProvider,
        detectRealOwner,
        detectCommets
      }

      onNext(data);
    }

    let render = true;
    useEffect(()=>{
        async function loadData() {
            const profession:any = await db.find( { selector: { couchdb_type:"CATALOG" , name: 'CATA_profesion'}});
            const activity:any = await db.find( { selector: { couchdb_type:"CATALOG" , name: 'CATA_ActividadEconomica'}});
            setProfessionCatalog( profession.docs.map( (i:SearchData)=>({ id: i.id, etiqueta: i.etiqueta})));
            setEconomicActivityCatalog( activity.docs.map( (i:SearchData)=>({id: i.id, etiqueta: i.etiqueta})));

        }
        if( render){
            render = false
            loadData();
        }
    },[])

    useEffect( ()=>{
      if( clientVerification._id){
        setProfession( clientVerification.profession);
        setEconomicActivity(clientVerification.economicActivity);
        setDetectOtherActivity(clientVerification.detectOtherActivity);
        setLinksOtherAssociation(clientVerification.linksOtherAssociation);
        setLinksOtherSociety(clientVerification.linksOtherSociety);
        setPpeCharge(clientVerification.ppeCharge);
        setPpeLevel(clientVerification.ppeLevel);
        setGobernmentFunctions(clientVerification.gobernmentFunctions);
        setGobernmentResponsibilities(clientVerification.gobernmentResponsabilities);
        setGobernmentWorkAddress(clientVerification.gobernmentWorkAddress);
        setGobernmentWorkName(clientVerification.gobernmentWorkName);
        setDetectExternalProvider(clientVerification.detectExternalProvider);
        setDetectOtherActivity(clientVerification.detectOtherActivity);
        setDetectRealOwner(clientVerification.detectRealOwner);
        setDetectCommets(clientVerification.detectCommets);
      }
    },[clientVerification])

    return (
        <IonList>
          <IonItemDivider><IonLabel>EXCLUSIVO COORDINADOR O GERENTE (PLD)</IonLabel></IonItemDivider>
          <SelectDropSearch
        dataList={professionCatalog}
        setSelectedItemFx={setProfession}
        currentItem={profession}
        description={"Profesion..."}
      />
      <SelectDropSearch
        dataList={economicActivityCatalog}
        setSelectedItemFx={setEconomicActivity}
        currentItem={economicActivity}
        description={"Actividad economica..."}
      />
          <IonItem>
                <IonLabel position="floating">¿Detecta otro Destino del Crédito? ¿Cuál?</IonLabel>
                <IonInput type="text" placeholder="" value={detectOtherActivity} onIonChange={ (e)=>setDetectOtherActivity(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem><IonLabel>¿Tiene usted vínculos patrimoniales con alguna sociedad?</IonLabel>
            <IonCheckbox checked={linksOtherSociety} onIonChange={async (e) =>setLinksOtherSociety(e.detail.checked)} />
          </IonItem>

          <IonItem><IonLabel>¿Tiene usted vínculos patrimoniales con alguna sociedad?</IonLabel>
            <IonCheckbox checked={linksOtherAssociation} onIonChange={async (e) =>setLinksOtherAssociation(e.detail.checked)} />
          </IonItem>

          <IonItemDivider><IonLabel>Cliente Persona Políticamente Expuesta</IonLabel></IonItemDivider>
          <IonItem>
                <IonLabel position="floating">Nivel</IonLabel>
                <IonInput type="text" placeholder="" value={ppeLevel} onIonChange={(e)=> setPpeLevel(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
                <IonLabel position="floating">Cargo</IonLabel>
                <IonInput type="text" placeholder="" value={ppeCharge} onIonChange={(e)=> setPpeCharge(e.detail.value!)}></IonInput>
          </IonItem>

          <IonItem>
                <IonLabel position="floating">Nombre de la Dependencia donde trabaja</IonLabel>
                <IonInput type="text" placeholder="" value={gobernmentWorkName} onIonChange={(e)=> setGobernmentWorkName(e.detail.value!)}></IonInput>

          </IonItem>
          <IonItem>
                <IonLabel position="floating">Dirección de la dependencia</IonLabel>
                <IonInput type="text" placeholder="" value={gobernmentWorkAddress} onIonChange={(e)=> setGobernmentWorkAddress(e.detail.value!)}></IonInput>
          </IonItem>

          <IonItem>
              <IonLabel position="floating">Describa sus funciones</IonLabel>
              <IonTextarea placeholder="ingrese aqui una descripción de sus funciones" value={gobernmentFunctions} onIonChange={(e)=> setGobernmentFunctions(e.detail.value!)}></IonTextarea>
          </IonItem>
          <IonItem>
              <IonLabel position="floating">Describa sus responsabilidades</IonLabel>
              <IonTextarea placeholder="ingrese aqui una descripción de sus responsabilidades" value={gobernmentResponsabilities} onIonChange={(e)=> setGobernmentResponsibilities(e.detail.value!)}></IonTextarea>
          </IonItem>

          <IonItem><IonLabel>¿Se detectó un Proveedor de recursos?</IonLabel>
            <IonCheckbox checked={detectExternalProvider} onIonChange={async (e) =>setDetectExternalProvider(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>¿Se detectó un Propietario real?</IonLabel>
            <IonCheckbox checked={detectRealOwner} onIonChange={async (e) =>setDetectRealOwner(e.detail.checked)} />
          </IonItem>
          <IonItem>
              <IonLabel position="floating">Observaciones de la Verificación:</IonLabel>
              <IonTextarea placeholder="ingrese aqui una descripción de sus responsabilidades" value={detectCommets} onIonChange={(e)=> setDetectCommets(e.detail.value!)}></IonTextarea>
          </IonItem>
          <p></p>
            <IonButton color="primary" expand="block" onClick={onSend} disabled={!!clientVerification._id}>Guardar</IonButton>
            <ButtonSlider color="medium" expand="block" label='Anterior' onClick={() => { onSetProgress(0.5)} } slideDirection={"B"}></ButtonSlider>

        </IonList>
    );
}