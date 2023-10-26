import { IonCheckbox, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonSelect, IonSelectOption } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { db } from "../../db";
import { AppContext } from "../../store/store";
import { SearchData, SelectDropSearch } from "../SelectDropSearch";
import { ButtonSlider } from "../SliderButtons";

export const ClientFormEconomics: React.FC< {onNext:any}> = ({onNext}) => {

    const [ocupationCatalog, setOcupationCatalog ] = useState<SearchData[]>([]);
    const [ocupation, setOcupation] = useState<SearchData>({ id: "", etiqueta: ""});
    const [professionCatalog, setProfessionCatalog] = useState<SearchData[]>([]);
    const [profession, setProfession] = useState<SearchData>({id: "",etiqueta: ""});
  
    const [economicActivityCatalog, setEconomicActivityCatalog] = useState<SearchData[]>([]);
    const [economicActivity, setEconomicActivity] = useState<SearchData>({id: "",etiqueta: ""});
    
    const [econocmicDeps, setEconomicDeps] = useState<string>('');
    
    const [educationLevel, setEducationLevel] = useState<string>('');
    const [ educationLevelCatalog, setEducationLevelCatalog] = useState<SearchData[]>([]);
    const [maritalStatus, setMaritalStatus] = useState<number>(0);
    const [ maritalStatusCatalog, setMaritalStatusCatalog] = useState<SearchData[]>([]);
    const { clientData, dispatchSession } = useContext(AppContext);

useEffect( ()=>{
  
  
  db.createIndex( { index: { fields: ["couchdb_type", "name"]}} )
  .then( function (){
    db.find({
      selector: {
        couchdb_type: 'CATALOG',
        name: 'CATA_ocupacionPLD'
      }
    }).then( (data:any) =>{
      
      setOcupationCatalog(data.docs.map( (i:SearchData)=>({id: i.id, etiqueta: i.etiqueta}) ));
      db.find({ 
        selector: {
          couchdb_type: 'CATALOG',
          name: 'CATA_profesion'
        }
      }).then( (data:any)=>{
        setProfessionCatalog( data.docs.map( (i:SearchData)=>({ id: i.id, etiqueta: i.etiqueta})));
        db.find({
          selector:{
            couchdb_type: "CATALOG",
            name: "CATA_ActividadEconomica"
          }
        }).then( (data:any) =>{
          
            setEconomicActivityCatalog( data.docs.map( (i:SearchData)=>({id: i.id, etiqueta: i.etiqueta})));
            db.find( {
              selector: {
                couchdb_type: "CATALOG",
                name: "CATA_escolaridad"
              }
            }).then( (data:any)=>{
              setEducationLevelCatalog( data.docs.map( (i:SearchData)=>({id: i.id, etiqueta: i.etiqueta})))
              db.find({
                selector:{
                  couchdb_type: "CATALOG",
                  name: "CATA_estadoCivil"
                }
              }).then( (data:any)=>{
                
                setMaritalStatusCatalog( data.docs.map( (i:SearchData)=>({ id: i.id, etiqueta: i.etiqueta})))
                if( clientData._id){
                  setMaritalStatus(clientData.marital_status[0]);
                  setEducationLevel(clientData.education_level[0]);
                  setOcupation({ id: clientData.ocupation[0], etiqueta: clientData.ocupation[1]})
                  setProfession( { id: clientData.business_data.profession[0], etiqueta: clientData.business_data.profession[1]});
                  setEconomicActivity( { id: clientData.business_data.economic_activity[0], etiqueta:clientData.business_data.economic_activity[1]})
                }
              })
            })
        })
      })
    })
  })

},[clientData])


  function onSubmit(){
    const data = {
      ocupation: [ocupation.id, ocupation.etiqueta],
      profession: [profession.id,profession.etiqueta],
      economic_activity: [economicActivity.id, economicActivity.etiqueta],
      education_level: [educationLevel, educationLevel ? educationLevelCatalog.find( (i)=> i.id == educationLevel)?.etiqueta: ''],
      marital_status: [maritalStatus,maritalStatus ? maritalStatusCatalog.find((i: any) => i.id == maritalStatus)!.etiqueta: "",],
    }
    onNext(data);
  }


  return (
    <IonList className="ion-padding">
      <IonItemDivider>
        <IonLabel>Ocupacion, profesion y Actividad Economica</IonLabel>
      </IonItemDivider>

      <SelectDropSearch
        dataList={ocupationCatalog}
        setSelectedItemFx={setOcupation}
        currentItem={ocupation}
        description={"Ocupacion..."}
      />
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
        <IonLabel position="stacked">Escolaridad</IonLabel>
        <IonSelect
          value={educationLevel}
          okText="Ok"
          cancelText="Cancelar"
          onIonChange={(e) => setEducationLevel(e.detail.value)}
        >
          {educationLevelCatalog.map((c: SearchData) => (
            <IonSelectOption key={c.id} value={c.id}>
              {c.etiqueta}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Estado civil</IonLabel>
        <IonSelect
          value={maritalStatus}
          okText="Ok"
          cancelText="Cancelar"
          onIonChange={(e) => setMaritalStatus(e.detail.value)}
        >
          {maritalStatusCatalog.map((c: SearchData) => (
            <IonSelectOption key={c.id} value={c.id}>
              {c.etiqueta}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Numero de Dependientes economicos</IonLabel>
        <IonInput
          type="text"
          value={econocmicDeps}
          onIonChange={(e) => setEconomicDeps(e.detail.value!)}
        ></IonInput>
      </IonItem>

      <IonItem>
        <IonLabel>Acceso a Internet?</IonLabel>
        <IonCheckbox
          // checked={bisOwnOrRent}
          // onIonChange={(e) => setOwnOrRent(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      <IonItem>
          <IonLabel position="stacked">Red Social preferida</IonLabel>
          <IonSelect
            // value={ownwerShipId}
            okText="Ok"
            cancelText="Cancelar"
            // onIonChange={(e) => setOwnerShipId(e.detail.value)}
            // style={ !ownwerShipId ? {border: "1px dotted red"}: {}}          
          >
            <IonSelectOption key={1} value='1'>WHATSAPP</IonSelectOption>
            <IonSelectOption key={2} value='2'>FACEBOOK</IonSelectOption>
            <IonSelectOption key={3} value='3'>INSTAGRAM</IonSelectOption>
          </IonSelect>
        </IonItem>
      <IonItem>
        <IonLabel position="stacked">Indique el usuario de la red social</IonLabel>
        <IonInput type="text"></IonInput>
      </IonItem>
      <IonItemDivider><IonLabel>Condiciones de su vivienda</IonLabel></IonItemDivider>
      <IonItem>
        <IonLabel>Piso Firme</IonLabel>
        <IonCheckbox
          // checked={bisOwnOrRent}
          // onIonChange={(e) => setOwnOrRent(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Techo Losa</IonLabel>
        <IonCheckbox
          // checked={bisOwnOrRent}
          // onIonChange={(e) => setOwnOrRent(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Baño</IonLabel>
        <IonCheckbox
          // checked={bisOwnOrRent}
          // onIonChange={(e) => setOwnOrRent(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Letrina</IonLabel>
        <IonCheckbox
          // checked={bisOwnOrRent}
          // onIonChange={(e) => setOwnOrRent(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Muro de Tabique/Block</IonLabel>
        <IonCheckbox
          // checked={bisOwnOrRent}
          // onIonChange={(e) => setOwnOrRent(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>


  
      <p>
        {!ocupation.id && <i style={{color: "gray"}}>* Ocupación es un dato obligatorio<br/></i>}
        {!profession.id && <i style={{color: "gray"}}>* Profesión es un dato obligatorio<br/></i>}
        {!economicActivity.id && <i style={{color: "gray"}}>* Actividad Económica es un dato obligatorio<br/></i>}
        {!educationLevel && <i style={{color: "gray"}}>* Escolaridad es un dato obligatorio<br/></i>}
        {!maritalStatus && <i style={{color: "gray"}}>* Estado civil es un dato obligatorio<br/></i>}
        {!econocmicDeps && <i style={{color: "gray"}}>* Numero de dependientes es un dato obligatorio<br/></i>}
      </p>
          <ButtonSlider
            disabled={ !ocupation.id || !profession.id || !economicActivity.id || !educationLevel || !maritalStatus || !econocmicDeps} 
            onClick={onSubmit} 
            slideDirection={'F'} 
            color='medium' 
            expand="block" 
            label="Siguiente" />
          <ButtonSlider onClick={()=>{}} slideDirection={'B'} color="light" expand="block" label="Anterior" />

    </IonList>
  );
};
