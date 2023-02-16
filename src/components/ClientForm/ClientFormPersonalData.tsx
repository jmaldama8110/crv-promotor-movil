import { IonBadge, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonSelect, IonSelectOption } from "@ionic/react";
import { useContext, useEffect, useState } from "react";

import { db } from "../../db";
import { AppContext } from "../../store/store";
import { getCurpInfo } from "../../utils/getCurpInfo";
import { SearchData } from "../SelectDropSearch";
import { ButtonSlider } from "../SliderButtons";


export const ClientFormPersonalData: React.FC< {onNext?:any}> = ( {onNext} ) => {

    const [name, setName] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [second_lastname, setSecondLastName] = useState<string>("");
    const [clave_ine, setClaveIne] = useState<string>("");
    const [numero_emisiones, setNumeroEmisiones] = useState<string>("");
    const [numero_vertical, setNumeroVertical] = useState<string>("");


    const [sex,setSex] = useState<[number, string]>([3,'Mujer']);
    const [sexCatalog, setSexCatalog] = useState<any[]>([]);

    const [provinceOfBirth, setProvinceOfBirth ] = useState<[string,string]>(['','']);
   
    const [provinces, setProvinces] = useState<any[]>([]);

    const [countryOfBirth, setCountryOfBirth] = useState<string>('');
    const [ countries, setCountries] = useState<any[]>([]);

    const [nationality, setNationality] = useState<number>(0);
    const [nationCatalog, setNationCatalog] = useState<any[]>([]);

    const [dob,setDob ] = useState<string>('');

    const [phone, setPhone] = useState<string>("");
    const [phoneStatus, setPhoneStatus] = useState<boolean>(false);
    const [curp, setCurp] = useState<string>("");
    const [curpStatus, setCurpStatus] = useState<boolean>(false);
    const { clientData,dispatchSession } = useContext(AppContext);

    let render = true;

    useEffect( ()=> {

      if( render ){
        render = false;

      dispatchSession({type: 'SET_LOADING', loading_msg: 'Cargando...', loading: true })
      db.createIndex( { index: { fields: ['couchdb_type','name']}})
        .then( function () {
          db.find( { 
            selector: {
              couchdb_type: "CATALOG",
              name: "CATA_sexo"
            }
          }).then( data =>{
            setSexCatalog(data.docs);
            
            db.find( {
              selector: {
                couchdb_type: "PROVINCE"
              }
            }).then( data =>{
              setProvinces(data.docs);
              db.find({
                selector: {
                  couchdb_type: "CATALOG",
                  name: "CATA_nacionalidad"
                }
              }).then( data =>{
                setNationCatalog( data.docs );
                db.find({
                  selector: {
                    couchdb_type: "COUNTRY"
                  }
                }).then( data =>{
                  setCountries(data.docs)
                  if(clientData._id){
                    setName(clientData.name);
                    setLastname( clientData.lastname);
                    setSecondLastName( clientData.second_lastname);
                    if( clientData.phones ){
                      const phoneMobile = clientData.phones.find( (i:any)=> (i.type === 'Móvil'))
                      if( phoneMobile)
                        setPhone(phoneMobile.phone);
                    }
                    setCurp(clientData.curp);
                    setClaveIne(clientData.clave_ine);
                    setNumeroEmisiones(clientData.numero_emisiones);
                    setNumeroVertical(clientData.numero_vertical);
                    setNationality(clientData.nationality[0])
                    setCountryOfBirth( clientData.country_of_birth[0]);
                  }                  
                })
                dispatchSession( {type: 'SET_LOADING', loading_msg: '', loading:false });
              })

            })
            
          })
        })
        render = false;
      }
    },[clientData])
 

    useEffect(() => {
        if (phone) {
          const phoneNumber = phone;
          const phoneRE = new RegExp(process.env.REACT_APP_PHONE_REGEX!);
          const phoneMatch = phoneNumber.match(phoneRE);
          phoneMatch ? setPhoneStatus(true) : setPhoneStatus(false);
        }
      }, [phone]);
    
      useEffect(() => {
        const curpInput = curp;
        if (curp) {
          const curpRE = new RegExp(process.env.REACT_APP_CURP_REGEX!);
          const curpMatch = curpInput.match(curpRE);
          curpMatch ? setCurpStatus(true) : setCurpStatus(false);
          if( curpMatch) {
            const curpData = getCurpInfo(curp)
            setDob( curpData.dob);
            if( sexCatalog.length ){
              const sexVal = sexCatalog.find( (i:any) => i.codigo === curpData.sex)
              setSex( [sexVal.id, sexVal.etiqueta] );
            }
            if( provinces.length ){
              const provSel = provinces.find( (i:any) => i.abreviatura === curpData.prov)
              if(provSel)
              setProvinceOfBirth( [provSel._id, provSel.etiqueta] );
            }
          }
        }
      }, [curp]);

    function onSubmit () {
      const newData = {
        name,
        lastname,
        second_lastname,
        curp,
        sex,
        phones: [{
          _id: 1,
          type: 'Móvil',
          phone,
          company: 'Desconocida',
          validated: false }],
        dob,
        clave_ine,
        numero_vertical,
        numero_emisiones,
        ife_details: [{
          id_identificacion_oficial: clave_ine,
          numero_emision: numero_emisiones,
          numero_vertical_ocr: numero_vertical
        }],
        province_of_birth: provinceOfBirth ,
        country_of_birth: countryOfBirth ? [countryOfBirth, countries.find( (i:SearchData)=> ({id: i.id, etiqueta: i.etiqueta}) ).etiqueta] : ['',''],
        nationality: nationality ? [ nationality, nationCatalog.find( (i:any) =>(i.id == nationality)).etiqueta] : [0,'']
      }
      
      onNext(newData);
  
    }

    return (
        <IonList className="ion-padding">
            <IonItemDivider>
                <IonLabel>Datos personales</IonLabel>
            </IonItemDivider>
            <IonItem>
                <IonLabel position="stacked">Nombre(s)</IonLabel>
                <IonInput type="text" value={name} onIonChange={(e=>setName(e.detail.value!))} onIonBlur={(e:any)=>setName(e.target.value.toUpperCase())}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">Apellido Paterno</IonLabel>
                <IonInput type="text" value={lastname} onIonChange={(e=>setLastname(e.detail.value!))} onIonBlur={(e:any)=>setLastname(e.target.value.toUpperCase())}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">Apellido Materno</IonLabel>
                <IonInput type="text" value={second_lastname} onIonChange={(e=>setSecondLastName(e.detail.value!))} onIonBlur={(e:any)=>setSecondLastName(e.target.value.toUpperCase())}></IonInput>
            </IonItem>
            <IonItem>
                <IonInput
                type="text"
                placeholder="Telefono Movil"
                required
                value={phone}
                onIonChange={(e) => setPhone(e.detail.value!)}
                ></IonInput>
                <IonBadge color={phoneStatus ? "success" : "warning"}>
                {phoneStatus ? "Ok" : "No valido"}
                </IonBadge>
            </IonItem>
            <IonItem>
                <IonInput
                type="text"
                placeholder="Ingresa tu CURP"
                value={curp}
                onIonChange={(e) => setCurp(e.detail.value!)}
                ></IonInput>
                <IonBadge color={curpStatus ? "success" : "warning"}>
                {curpStatus ? "Ok" : "No valida"}
                </IonBadge>
            </IonItem>
            { curpStatus && 
            <div>
                <IonItem><IonLabel>Fecha Nacimiento: {dob}</IonLabel></IonItem>
                <IonItem><IonLabel>Sexo: { sex[1] }</IonLabel></IonItem>
                <IonItem><IonLabel>Nacio en: { provinceOfBirth[1] }</IonLabel></IonItem>
                </div>
            }
                  <IonItem>
        <IonLabel position="stacked">País de Nacimiento</IonLabel>
        <IonSelect
          value={countryOfBirth}
          okText="Ok"
          cancelText="Cancelar"
          onIonChange={(e) => setCountryOfBirth(e.detail.value)}
        >
          {countries.map((c: any) => (
            <IonSelectOption key={c._id} value={c._id}>
              {c.etiqueta}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Nacionalidad</IonLabel>
        <IonSelect
          value={nationality}
          okText="Ok"
          cancelText="Cancelar"
          onIonChange={(e) => setNationality(e.detail.value)}
        >
          {nationCatalog.map((c: any) => (
            <IonSelectOption key={c.id} value={c.id}>
              {c.etiqueta}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

        <IonItemDivider><IonLabel>Datos del INE</IonLabel></IonItemDivider>
        <IonItem>
                  <IonLabel position="stacked">Clave INE</IonLabel>
                  <IonInput type="text" value={clave_ine} onIonChange={(e=>setClaveIne(e.detail.value!))} onIonBlur={(e:any)=>setClaveIne(e.target.value.toUpperCase())}></IonInput>
        </IonItem>
        <IonItem>
                  <IonLabel position="stacked">Numero Emisiones</IonLabel>
                  <IonInput type="text" value={numero_emisiones} onIonChange={(e=>setNumeroEmisiones(e.detail.value!))} onIonBlur={(e:any)=>setNumeroEmisiones(e.target.value.toUpperCase())}></IonInput>
        </IonItem>
        <IonItem>
                  <IonLabel position="stacked">Numero Vertical</IonLabel>
                  <IonInput type="text" value={numero_vertical} onIonChange={(e=>setNumeroVertical(e.detail.value!))} onIonBlur={(e:any)=>setNumeroVertical(e.target.value.toUpperCase())}></IonInput>
        </IonItem>
        

        <ButtonSlider color='medium' expand="block" onClick={onSubmit} label={'Siguiente'} slideDirection='F' />
      </IonList>
    

    );
}