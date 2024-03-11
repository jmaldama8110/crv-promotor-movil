import { IonBadge, IonButton, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonSelect, IonSelectOption, useIonLoading } from "@ionic/react";
import { useContext, useEffect, useState } from "react";

import { db } from "../../db";
import { AppContext } from "../../store/store";
import { getCurpInfo } from "../../utils/getCurpInfo";
import { SearchData } from "../SelectDropSearch";
import { ButtonSlider } from "../SliderButtons";
import api from "../../api/api";

interface iSelectOptionItem {
    id: number;
    etiqueta: string;
}

export const ClientFormPersonalData: React.FC< {onNext?:any}> = ( {onNext} ) => {

    const [name, setName] = useState<string>("");
    const [nameError, setNameError] = useState<boolean>(false);

    const [lastname, setLastname] = useState<string>("");
    const [lastnameError, setLastnameError] = useState<boolean>(false);

    const [second_lastname, setSecondLastName] = useState<string>("");
    const [clave_ine, setClaveIne] = useState<string>("");
    const [claveIneError, setClaveIneError] = useState<boolean>(false);
    const [claveIneIsNew, setClaveIneIsNew] = useState<boolean>(false);

    const [numero_emisiones, setNumeroEmisiones] = useState<string>("");
    const [numeroEmisionesError, setNumeroEmisionesError] = useState<boolean>(false);

    const [numero_vertical, setNumeroVertical] = useState<string>("");
    const [numeroVerticalError, setNumeroVerticalError] = useState<boolean>(false);


    const [sex,setSex] = useState<[number, string]>([3,'Mujer']);
    const [sexCatalog, setSexCatalog] = useState<any[]>([]);

    const [provinceOfBirth, setProvinceOfBirth ] = useState<[string,string]>(['','']);
    const [provinces, setProvinces] = useState<any[]>([]);

    const [countryOfBirth, setCountryOfBirth] = useState<string>('');
    const [ countries, setCountries] = useState<any[]>([]);

    const [nationality, setNationality] = useState<number>(0);
    const [nationCatalog, setNationCatalog] = useState<iSelectOptionItem[]>([]);

    const [dob,setDob ] = useState<string>('');

    const [phone, setPhone] = useState<string>("");
    const [phoneStatus, setPhoneStatus] = useState<boolean>(false);
    const [curp, setCurp] = useState<string>("");
    const [curpStatus, setCurpStatus] = useState<boolean>(false);
    const [curpIsNew, setCurpIsNew] = useState(false);

    const { clientData, session } = useContext(AppContext);

    const [showLoading, dismissLoading] = useIonLoading();


    let render = true;

    useEffect( ()=> {

      if( render ){
        render = false;
      db.createIndex( { index: { fields: ['couchdb_type','name']}})
        .then( function () {
          db.find( { 
            selector: {
              couchdb_type: "CATALOG",
              name: "CATA_sexo"
            }
          }).then( dataSexCatalog =>{
            setSexCatalog(dataSexCatalog.docs);
            
            db.find( {
              selector: {
                couchdb_type: "PROVINCE"
              }
            }).then( dataProvices =>{
              setProvinces(dataProvices.docs);
              db.find({
                selector: {
                  couchdb_type: "CATALOG",
                  name: "CATA_nacionalidad"
                }
              }).then( dataNationCatalog =>{
                setNationCatalog( dataNationCatalog.docs.map( (i:any) => ({ id: i.id, etiqueta: i.etiqueta })) );
                db.find({
                  selector: {
                    couchdb_type: "COUNTRY"
                  }
                }).then( dataCountries =>{
                  setCountries(dataCountries.docs)
                  
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
        setCurpIsNew(false);
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

      useEffect(()=>{
          const cveIne = new RegExp("^([A-Z]{6}[0-9]{8}[H,M][0-9]{3})$");
          setClaveIneIsNew(false);
          if( clave_ine.match( cveIne )){
              setClaveIneError(false);
          } else setClaveIneError(true);
      },[clave_ine])
    
      async function onVerifyCurp (){
        showLoading({ message: 'Validando...' });
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;
          const apiRes = await api.get(`/clients/exists?identityNumber=${curp}`);
          const idCliente = apiRes.data.id_cliente;
          if( idCliente ){
            
            alert(`OJO: El CURP ${curp} arrojo el Id de Cliente:${idCliente}`);

          }
          else
            setCurpIsNew(true);

          dismissLoading();
        }
        catch(e){
          alert("Ocurrio un error, puede que no tengas conexion con datos")
          dismissLoading();
        }
      }
    
      async function onVerifyClaveElector (){

        showLoading({ message: 'Validando INE...' });
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;
          const apiRes = await api.get(`/clients/exists?claveIne=${clave_ine}`);
          const data = apiRes.data.ids;
          if( data ){
            alert(`OJO: La CLAVE Ine ${clave_ine} arrojo existente los siguientes: ${data.toString()}`);
          }
          else
            setClaveIneIsNew(true);

          dismissLoading();
        }
        catch(e){
          alert("Ocurrio un error, puede que no tengas conexion con datos")
          dismissLoading();
        }
      }

      function onNumeroVerticalBlur (e:any){
        if( e.target.value && 
          e.target.value.length >=12 && e.target.value.length <=13 ){
            setNumeroVerticalError(false)
        } else 
          setNumeroVerticalError(true);
      }


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
        nationality: nationality ? [ nationality, nationCatalog.find( (i:iSelectOptionItem) =>(i.id == nationality))!.etiqueta] : [0,'']
      }
      
      onNext(newData);
  
    }

    function onNameBlur (e:any) {
      if( e.target.value )
        setName(e.target.value.toUpperCase());
      else      
        setNameError(true);
    }



    return (
        <IonList className="ion-padding">


            <IonItemDivider>
                <IonLabel>Datos personales</IonLabel>
            </IonItemDivider>
            <IonItem>
                <IonLabel position="stacked">Nombre(s)</IonLabel>
                <IonInput type="text" value={name} onIonChange={(e=>setName(e.detail.value!))} onIonBlur={onNameBlur} style={ nameError ? { border: "1px dotted red"} :{ } } onIonFocus={()=> setNameError(false)}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">Apellido Paterno</IonLabel>
                <IonInput type="text" value={lastname} onIonChange={(e=>setLastname(e.detail.value!))} onIonBlur={(e:any)=> e.target.value ? setLastname(e.target.value.toUpperCase()): setLastnameError(true)} onIonFocus={ ()=> setLastnameError(false)} style={ lastnameError ? { border: "1px dotted red"} :{ } }></IonInput>
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
                { !clientData._id && curpStatus && !curpIsNew &&<IonButton color='primary' onClick={onVerifyCurp}>Verificar</IonButton>}
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
          style={ !countryOfBirth ? {border: "1px dotted red"}: {}}
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
          onIonChange={(e) =>setNationality(e.detail.value) }
          style={ !nationality ? {border: "1px dotted red"}: {}}
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
                  <IonInput type="text" value={clave_ine} placeholder="CLAVE Elector" onIonChange={(e=>setClaveIne(e.detail.value!))} onIonBlur={(e:any)=> e.target.value ? setClaveIne(e.target.value.toUpperCase()): setClaveIneError(true)} onIonFocus={ ()=> setClaveIneError(false)} style={ claveIneError ? {border: "1px dotted red"}: {} }></IonInput>
                  {clave_ine && <IonBadge color={ !claveIneError ? "success" : "warning"}>{!claveIneError ? "Ok" : "No valida"}</IonBadge>}
                  { !clientData._id && !claveIneError && !claveIneIsNew &&<IonButton color='primary' onClick={onVerifyClaveElector}>Verificar</IonButton>}
        </IonItem>
        <IonItem>
                  <IonLabel position="stacked">Numero Emisiones</IonLabel>
                  <IonInput type="text" value={numero_emisiones} onIonChange={(e=>setNumeroEmisiones(e.detail.value!))} onIonBlur={(e:any)=> e.target.value && e.target.value.length == 2 ? setNumeroEmisiones(e.target.value.toUpperCase()): setNumeroEmisionesError(true)} onIonFocus={ ()=> setNumeroEmisionesError(false)} style={ numeroEmisionesError ? { border: "1px dotted red"}: {} }></IonInput>
        </IonItem>
        <IonItem>
                  <IonLabel position="stacked">Numero Vertical</IonLabel>
                  <IonInput type="text" value={numero_vertical} onIonChange={(e=>setNumeroVertical(e.detail.value!))} 
                    onIonBlur={onNumeroVerticalBlur} 
                    onIonFocus={ ()=> setNumeroVerticalError(false)} style={ numeroVerticalError? {border: "1px dotted red"}: {}}
                  ></IonInput>
        </IonItem>
        <p>
          {nameError && <i style={{color: "gray"}}>* El nombre proporcionado es invalido <br/></i>}
          {lastnameError && <i style={{color: "gray"}}>* El apellido proporcionado es invalido: al menos un apellido es necesario<br/></i>}
          {!curpStatus && <i style={{color: "gray"}}>* CURP No valido, verifique la secuencia de caracteres<br/></i>}
          {!phoneStatus && <i style={{color: "gray"}}>* Numero de celular no valido, verifique que 10 digitos (999)9999999<br/></i>}
          
          {claveIneError && <i style={{color: "gray"}}>* Clave del IFE/INE invalida<br/></i>}
          {numeroEmisionesError && <i style={{color: "gray"}}>* Numero de emisiones invalido (2 digitos, ej 00)<br/></i>}
          {numeroVerticalError && <i style={{color: "gray"}}>* Numero vertical es invalido (12 o 13 posiciones)<br/></i>}

          {!countryOfBirth && <i style={{color: "gray"}}>* País de Nacimiento es obligatorio<br/></i>}
          {!nationality && <i style={{color: "gray"}}>* Nacionalidad es obligatorio<br/></i>}
          {!clientData._id && !curpIsNew && <i style={{color: "gray"}}>La CURP se debe verificar dando click el boton<br/></i> }
          {!clientData._id && !claveIneIsNew && <i style={{color: "gray"}}>La CLAVE Elector se debe verificar dando click el boton<br/></i> }

        </p>
        <ButtonSlider color='medium' expand="block" onClick={onSubmit} label={'Siguiente'} slideDirection='F' disabled={ nameError || lastnameError || !curpStatus ||!phoneStatus || !countryOfBirth || !nationality || claveIneError || numeroVerticalError || numeroEmisionesError}  />

      </IonList>
    

    );
}