import { IonCheckbox, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonSelect, IonSelectOption } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { db } from "../../db";
import { AppContext } from "../../store/store";
import { SearchData } from "../SelectDropSearch";
import { ButtonSlider } from "../SliderButtons";

export const ClientFormEconomics: React.FC< {onNext:any}> = ({onNext}) => {
    
    const [econocmicDeps, setEconomicDeps] = useState<number>(0);
    const [internetAccess, setInternetAccess] = useState<boolean>(false);
    const [hasDisable, setHasDisable] = useState<boolean>(false);
    const [speaksDialect, setSpeaksDialect] = useState<boolean>(false);
    const [hasImprovedIncome, setHasImprovedIncome] = useState<boolean>(false);
    
    const [socialMediaCat, setSocialMediaCat] = useState<any[]>([]);
    const [socialMediaPrefered, setSocialMediaPrefered] = useState<number>(0);
    const [socialMediaUser, setSocialMediaUser] = useState<string>('');

    const [rolHogar,setRolHogar] = useState<number>(0);
    const [rolHogarCatalog, setRolHogarCatalog] = useState<any[]>([]);
    
    const [householdFloor, setHouseholdFloor] = useState<boolean>(false);
    const [householdRoof, setHouseholdRoof] = useState<boolean>(false);
    const [householdToilet, setHouseholdToilet] = useState<boolean>(false);
    const [householdLatrine, setHouseholdLatrine] = useState<boolean>(false);
    const [householdBrick, setHouseholdBrick] = useState<boolean>(false);

    
    const [educationLevel, setEducationLevel] = useState<string>('');
    const [ educationLevelCatalog, setEducationLevelCatalog] = useState<SearchData[]>([]);
    const [maritalStatus, setMaritalStatus] = useState<number>(0);
    const [ maritalStatusCatalog, setMaritalStatusCatalog] = useState<SearchData[]>([]);
    const { clientData, dispatchSession } = useContext(AppContext);

useEffect( ()=>{
  
  db.createIndex( { index: { fields: ["couchdb_type", "name"]}} )
  .then( function (){
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
                
                const newData = data.docs.map( (i:any)=>({ id: i.id, etiqueta: i.etiqueta, eliminar: i.eliminar })).filter( (x:any) => !x.eliminar )
                setMaritalStatusCatalog(newData )
                db.find( {
                  selector: {
                    couchdb_type: "CATALOG",
                    name:"CATA_RedesSociales"
                  }
                }).then( (data:any) =>{
                  setSocialMediaCat( data.docs.map( (i:any)=> ({id: i.id, etiqueta: i.nombre})));

                  db.find({
                    selector: {
                      couchdb_type: "CATALOG",
                      name: "CATA_rolHogar"
                    }
                  }).then( (data:any) => {
                    setRolHogarCatalog( data.docs.map( (i:any) => ({ id:i.id, etiqueta: i.alias_1 })))
                      if( clientData._id){
                        setMaritalStatus(clientData.marital_status[0]);
                        setEducationLevel(clientData.education_level[0]);
                        setRolHogar( clientData.rol_hogar[0]);
                        setHasDisable( clientData.has_disable);
                        setHasImprovedIncome( clientData.has_improved_income);
                        setSpeaksDialect( clientData.speaks_dialect);
                        setHouseholdFloor( clientData.household_floor);
                        setHouseholdRoof( clientData.household_roof );
                        setHouseholdToilet( clientData.household_toilet);
                        setHouseholdLatrine( clientData.household_latrine);
                        setHouseholdBrick( clientData.household_brick);
                        setEconomicDeps( clientData.economic_dependants);
                        setInternetAccess( clientData.internet_access);
                        setSocialMediaPrefered( clientData.prefered_social[0]);
                        setSocialMediaUser( clientData.user_social);
                      }
                  })


                })

              })
            })
        })

},[clientData])


  function onSubmit(){
    const data = {
      education_level: [educationLevel, educationLevel ? educationLevelCatalog.find( (i)=> i.id == educationLevel)?.etiqueta: ''],
      marital_status: [maritalStatus,maritalStatus ? maritalStatusCatalog.find((i: any) => i.id == maritalStatus)!.etiqueta: "",],
      rol_hogar: rolHogar ? [ rolHogar, rolHogarCatalog.find( (i:any) => ( i.id == rolHogar )).etiqueta] :[0,""],
      household_floor: householdFloor,
      household_roof: householdRoof,
      household_toilet: householdToilet,
      household_latrine: householdLatrine,
      housegold_brick: householdBrick,
      economic_dependants: econocmicDeps,
      internet_access: internetAccess,
      prefered_social: [socialMediaPrefered, socialMediaPrefered ? socialMediaCat.find( (i)=> i.id == socialMediaPrefered).etiqueta : ''],
      user_social: socialMediaUser,
      has_disable: hasDisable,
      speaks_dialect: speaksDialect,
      has_improved_income: hasImprovedIncome
    }
    onNext(data);
  }


  return (
    <IonList className="ion-padding">

<IonItemDivider><IonLabel>Condiciones de su vivienda</IonLabel></IonItemDivider>
      <IonItem>
        <IonLabel>Piso Firme</IonLabel>
        <IonCheckbox
          checked={householdFloor}
          onIonChange={(e) => setHouseholdFloor(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Techo Losa</IonLabel>
        <IonCheckbox
          checked={householdRoof}
          onIonChange={(e) => setHouseholdRoof(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Baño</IonLabel>
        <IonCheckbox
          checked={householdToilet}
          onIonChange={(e) => setHouseholdToilet(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Letrina</IonLabel>
        <IonCheckbox
          checked={householdLatrine}
          onIonChange={(e) => setHouseholdLatrine(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Muro de Tabique/Block</IonLabel>
        <IonCheckbox
          checked={householdBrick}
          onIonChange={(e) => setHouseholdBrick(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>

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
          type="number"
          value={econocmicDeps}
          onIonChange={(e) => setEconomicDeps(parseFloat(e.detail.value!))}
          onIonBlur={(e) => !e.target.value ? setEconomicDeps(0) : ''}
        ></IonInput>
      </IonItem>
      <IonItem>
          <IonLabel position="stacked">Rol en el Hogar</IonLabel>
          <IonSelect
            value={rolHogar}
            okText="Ok"
            cancelText="Cancelar"
            onIonChange={(e) => setRolHogar(e.detail.value)}
          >
            {
              rolHogarCatalog.map( (i:any) => (
              <IonSelectOption key={i.id} value={i.id}>
                {i.etiqueta}
              </IonSelectOption>))
            }
          </IonSelect>
        </IonItem>

        <IonItem>
        <IonLabel>Ha mejorado sus ingresos?</IonLabel>
        <IonCheckbox
          checked={hasImprovedIncome}
          onIonChange={(e) => setHasImprovedIncome(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>

      <IonItem>
        <IonLabel>Habla alguna lengua indigena?</IonLabel>
        <IonCheckbox
          checked={speaksDialect}
          onIonChange={(e) => setSpeaksDialect(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Tiene habilidades diferentes?</IonLabel>
        <IonCheckbox
          checked={hasDisable}
          onIonChange={(e) => setHasDisable(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>


      <IonItem>
        <IonLabel>Acceso a Internet?</IonLabel>
        <IonCheckbox
          checked={internetAccess}
          onIonChange={(e) => setInternetAccess(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>

      <IonItem>
          <IonLabel position="stacked">Red Social preferida</IonLabel>
          <IonSelect
            value={socialMediaPrefered}
            okText="Ok"
            cancelText="Cancelar"
            onIonChange={(e) => setSocialMediaPrefered(e.detail.value)}
          >
            {
              socialMediaCat.map( (i:any) => (
              <IonSelectOption key={i.id} value={i.id}>
                {i.etiqueta}
              </IonSelectOption>))
            }
          </IonSelect>
        </IonItem>
      <IonItem>
        <IonLabel position="stacked">Indique el usuario de la red social</IonLabel>
        <IonInput type="text" value={socialMediaUser} onIonChange={ (e)=> setSocialMediaUser( e.detail.value!)}></IonInput>
      </IonItem>
  
      <p>
        {!educationLevel && <i style={{color: "gray"}}>* Escolaridad es un dato obligatorio<br/></i>}
        {!maritalStatus && <i style={{color: "gray"}}>* Estado civil es un dato obligatorio<br/></i>}
        { (econocmicDeps < 0 || econocmicDeps > 99) && <i style={{color: "gray"}}>* Numero de dependientes es un dato obligatorio y un valor entre 0 y 99<br/></i>}
      </p>
          <ButtonSlider
            disabled={ !educationLevel || !maritalStatus || (econocmicDeps < 0 || econocmicDeps > 99)} 
            onClick={onSubmit} 
            slideDirection={'F'} 
            color='medium' 
            expand="block" 
            label="Siguiente" />
          <ButtonSlider onClick={()=>{}} slideDirection={'B'} color="light" expand="block" label="Anterior" />

    </IonList>
  );
};
