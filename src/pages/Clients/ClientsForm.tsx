import {
  IonBadge,
  IonButton,
  IonCheckbox,
  IonCol,
  IonDatetime,
  IonGrid,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPopover,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import { useContext, useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { Geolocation } from "@capacitor/geolocation";
import "../../../src/globalstyles.css";
import { SearchData, SelectDropSearch } from "../../components/SelectDropSearch";
import { db } from "../../db";
import { AppContext } from "../../store/store";

interface ClientsFormProps {
  client?: any;
  onSubmit: any;
}

interface ColonyType {
  _id: string;
  etiqueta: string;
  ciudad_localidad: string;
}

const formatDate = (value: string) => {
  const dateWithNoTime = value.toString().substring(0, 10);
  return format(parseISO(dateWithNoTime), "dd-MMM-yyyy");
};

export const ClientsForm: React.FC<ClientsFormProps> = ({
  client,
  onSubmit}) => {

  let render = useRef<boolean>(false);

  const [lat,setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const [name, setName] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [second_lastname, setSecondLastName] = useState<string>("");

  const [phone, setPhone] = useState<string>("");
  const [phoneStatus, setPhoneStatus] = useState<boolean>(false);
  const [curp, setCurp] = useState<string>("");
  const [curpStatus, setCurpStatus] = useState<boolean>(false);

  const [address_line1, setAddressL1] = useState<string>(""); 
  const [myCP, setMyCp] = useState<string>("");
  const [colonyId, setColonyId] = useState<string>("");
  const myColonySelectList = useRef<any>(null);

  const [colonyCat, setColonyCat] = useState<ColonyType[]>([]);
  const [colonyName, setColonyName] = useState<string>("");
  const [cityId, setCityId] = useState<string>('');
  const [cityName, setCityName] = useState<string>("");
  const [municipalityId, setMunicipalityId] = useState<string>('');
  const [municipalityName, setMunicipalityName] = useState<string>("");
  const [provinceId, setProvinceId] = useState<string>('');
  const [provinceName, setProvinceName] = useState<string>("");
  const [countryId, setCountryId] = useState<string>('');
  const [countryName, setCountryName] = useState<string>("");

  const [educationLevel, setEducationLevel] = useState<number>(0);
  const [maritalStatus, setMaritalStatus] = useState<number>(0);
  const [tributaryRegime, setTributaryRegime] = useState<number>(0);
  const [rfc, setRfc] = useState<string>("");
  const [ocupationCatalog, setOcupationCatalog ] = useState<SearchData[]>([]);
  const [ocupation, setOcupation] = useState<SearchData>({ id: 0, etiqueta: ""});
  const [professionCatalog, setProfessionCatalog] = useState<SearchData[]>([]);
  const [profession, setProfession] = useState<SearchData>({id: 0,etiqueta: ""});

  const [economicActivityCatalog, setEconomicActivityCatalog] = useState<SearchData[]>([]);
  const [economicActivity, setEconomicActivity] = useState<SearchData>({id: 0,etiqueta: ""});

  const [ educationLevelCatalog, setEducationLevelCatalog] = useState<SearchData[]>([]);
  const [ maritalStatusCatalog, setMaritalStatusCatalog] = useState<SearchData[]>([]);
  const [tributaryRegCatalog, setTributaryRegCatalog] = useState<SearchData[]>([
    { id:1, etiqueta: 'Persona Fisica AE'},
    { id:2, etiqueta: 'Persona Moral'},
  ]);

  const [bisCP, setBisCp] = useState<string>("");
  const [bisAddress_line1, setAddressL1Bis] = useState<string>("");

  const [colonyBisCat, setColonyBisCat] = useState<ColonyType[]>([]);
  const [bisColonyId, setColonyBisId] = useState<string>('');
  
  const myColonyBisSelectList = useRef<any>(null);
  const [bisColonyName, setColonyBisName] = useState<string>("");
  const [bisCityId, setCityBisId] = useState<number>(0);
  const [bisCityName, setCityBisName] = useState<string>("");
  const [bisMunicipalityId, setMunicipalityBisId] = useState<number>(0);
  const [bisMunicipalityName, setMunicipalityBisName] = useState<string>("");
  const [bisProvinceId, setProvinceBisId] = useState<number>(0);
  const [bisProvinceName, setProvinceBisName] = useState<string>("");
  const [bisCountryId, setCountryBisId] = useState<number>(0);
  const [bisCountryName, setCountryBisName] = useState<string>("");

  const [not_bis, setNotBis] = useState<boolean>(false);
  const [bis_address_same, setBisAddressSame] = useState<boolean>(false);
  const [bisOwnOrRent, setOwnOrRent] = useState(false);
  const [businessName, setBusinessName] = useState<string>("");

  const [bisStartedDate, setBisStartedDate] = useState("");
  const [bisStartedDateFormatted, setBiStartedDateFormatted] = useState("");

  const { dispatchSession } = useContext(AppContext);
  
  useEffect( ()=>{
    if( !render.current ){
      render.current = true;
      /// this codes runs only Once!
      db.createIndex( { index: { fields: ['couchdb_type','name']}}).then( function (){
        
        db.find( { selector: {
          couchdb_type: "CATALOG",
          name: "CATA_ActividadEconomica"
        }}).then( actEco =>{  
            setEconomicActivityCatalog(actEco.docs.map( (i:any)=>({ id: i.id, etiqueta: i.etiqueta})));
            db.find({ selector: {
              couchdb_type: "CATALOG",
              name: "CATA_escolaridad"
            }}).then( data =>{
              setEducationLevelCatalog( data.docs.map( (i:any)=>({id:i.id,etiqueta: i.etiqueta})))
              db.find({ selector: {
                couchdb_type: 'CATALOG',
                name: "CATA_estadoCivil"
              }}).then( data =>{
                setMaritalStatusCatalog(data.docs.map( (i:any)=>({id:i.id,etiqueta: i.etiqueta})))
                db.find({ selector: {
                  couchdb_type: 'CATALOG',
                  name: "CATA_ocupacion"
                }}).then( data =>{
                  setOcupationCatalog(data.docs.map( (i:any)=>({id:i.id,etiqueta: i.etiqueta})))
                  db.find({ selector: {
                    couchdb_type: 'CATALOG',
                    name: "CATA_profesion"
                  }}).then( data =>{
                    setProfessionCatalog(data.docs.map( (i:any)=>({id:i.id,etiqueta: i.etiqueta})))
                  }).catch(e=>{
                    console.log(e);
                  });

                }).catch(e=>{
                  console.log(e);
                });
              }).catch(e=>{
                console.log(e);
              });

            }).catch( err =>{
              alert('No fue posible cargar Escolaridad');
            });

        }).catch( err =>{
          alert( 'No fue posible cargar datos de Actividad Economica...');
        });
      }).catch(err =>{
        alert('Carga de datos (catalogos) no fue posible...');
      })
    }
    async function loadCoordinates (){
      const coordsData = await Geolocation.getCurrentPosition();
      setLat(coordsData.coords.latitude);
      setLng(coordsData.coords.longitude);
    }
    loadCoordinates();

  },[])
  useEffect(() => {
    // if client exists, means we are editing the client
    if (client) {
      setName(client.name);
      setLastname(client.lastname);
      setSecondLastName(client.second_lastname);
      setCurp(client.curp);
      
    }
  }, [client]);

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
    }
  }, [curp]);

  function onSave() {
    const data = {
      ...client,
    };

    onSubmit(data);
    
  }

  function populateColoniesByPostCode( cpData: string, updateFx: (value: React.SetStateAction<ColonyType[]>) => void, refComp: React.MutableRefObject<any> ) {
    if (!cpData) return;

    dispatchSession({
      type: "SET_LOADING",
      loading: true,
      loading_msg: "Cargando Asentamientos...",
    });

    db.createIndex({
      index: { fields: ['couchdb_type','codigo_postal']}
    }).then( function() {
      db.find({
        selector: {
          couchdb_type: "NEIGHBORHOOD",
          codigo_postal: cpData,
        },
      }).then((colonies) => {
          updateFx( colonies.docs.map((i: any) => ({
              _id: i._id,
              etiqueta: i.etiqueta,
              ciudad_localidad: i.ciudad_localidad,
            })));

        })
        .catch((err) => {
          console.log(err);
        });
        dispatchSession({
          type: "SET_LOADING",
          loading: false,
          loading_msg: "",
        });
        refComp.current.open();
    })
  }

  useEffect(() => {
    //// Populates City, municipality and provice based on Selected Colony
    const selectedColony = colonyCat.find((i: any) => i._id == colonyId);
    if (selectedColony) {
      setColonyName(selectedColony.etiqueta);
      db.get( selectedColony.ciudad_localidad ).then( (city: any) =>{
        setCityName(city.etiqueta);
        setCityId(city._id);
        db.get( city.municipio ).then( (mun:any) =>{
          setMunicipalityName(mun.etiqueta);
          setMunicipalityId(mun._id)
          db.get( mun.estado ).then( (prov:any) =>{              
              setProvinceName( prov.etiqueta);
              setProvinceId( prov._id);
              db.get( prov.pais).then( (cou:any)=>{
                setCountryName(cou.etiqueta);
                setCountryId(cou._id);
              })
          })
        })
      });

    }
  }, [colonyId]);

  useEffect( ()=>{
    const selectedColony = colonyBisCat.find( (i:any) => i._id == bisColonyId);
      if( selectedColony ){
        setColonyBisName(selectedColony.etiqueta);
        db.get( selectedColony.ciudad_localidad).then( (city:any)=>{
          setCityBisName( city.etiqueta);
          setCityBisId( city._id);
          db.get( city.municipio ).then( (mun:any)=>{
            setMunicipalityBisName( mun.etiqueta);
            setMunicipalityBisId( mun._id);
            db.get( mun.estado ).then( (prov:any)=>{
              setProvinceBisName(prov.etiqueta);
              setProvinceBisId(prov._id);
              db.get(prov.pais).then( (cou:any)=>{
                setCountryBisName(cou.etiqueta);
                setCountryBisId(cou._id);
              })
            })
          })
        })
      }
  },[bisColonyId])



  const onPopulateHomeColonies = async ()=>{
    populateColoniesByPostCode(myCP,setColonyCat, myColonySelectList);
  }

  const onPopulateBisColonies = async () =>{
    populateColoniesByPostCode(bisCP, setColonyBisCat, myColonyBisSelectList)
  }

  const sendData = () =>{

    let domicilioAddress = {
      _id: Date.now().toString(),
      type: 'DOMICILIO'
    }
    let negocioAddress = {
      _id: Date.now().toString(),
      type: "NEGOCIO"
    }
    if( client ){
        /// we editing a client
        
    }
    
    const newPhoneAdd = {
      _id: 1,
      type: 'Móvil',
      phone,
      company: 'Desconocida',
      validated: true,
    }

    const data = {
      id_cliente: client ? client.id_cliente : 0,
      id_persona: client  ? client.id_persona : 0,
      name,
      lastname,
      second_lastname,
      email:'',
      curp,
      ine_clave: "",
      ine_duplicates: "",
      ine_doc_number: "",
      ife_details: "",
      data_company: "",
      data_efirma: "",
      dob: "",
      loan_cycle: '',
      client_type: [1, "INDIVIDUAL"],
      branch: '',
      sex: '',
      not_bis,
      bis_address_same,
      education_level: [
        educationLevel,
        educationLevel
          ? educationLevelCatalog.find((i: any) => i.id == educationLevel)!
              .etiqueta
          : "",
      ],
      identities: "",
      address: [
        {
          _id: domicilioAddress._id,
          type: domicilioAddress.type,
          address_line1,
          
          country: [countryId, countryName],
          province: [provinceId, provinceName],
          municipality: [municipalityId, municipalityName],
          city: [cityId, cityName],
          colony: [colonyId, colonyName],
          post_code: myCP,
        },
        {
          _id: negocioAddress._id,
          type: negocioAddress.type,
          address_line1: bisAddress_line1,
          country: [bisCountryId, bisCountryName],
          province: [bisProvinceId, bisProvinceName],
          municipality: [bisMunicipalityId, bisMunicipalityName],
          city: [bisCityId, bisCityName],
          colony: [bisColonyId, bisColonyName],
          post_code: bisCP,
        },
      ],
      rfc,
      phones: [
        newPhoneAdd
      ],
      tributary_regime: [
        tributaryRegime,
        tributaryRegime
          ? tributaryRegCatalog.find((i: any) => i.id == tributaryRegime)!
              .etiqueta
          : "",
      ],
      nationality: "",
      province_of_birth: "",
      country_of_birth: "",
      ocupation: [ocupation.id, ocupation.etiqueta],
      marital_status: [
        maritalStatus,
        maritalStatus
          ? maritalStatusCatalog.find((i: any) => i.id == maritalStatus)!
              .etiqueta
          : "",
      ],
      identification_type: [],
      guarantor: [],
      business_data: {
        economic_activity: [economicActivity.id, economicActivity.etiqueta],
        profession: [profession.id, profession.etiqueta],
        business_start_date: bisStartedDate,
        business_name: businessName,
      },
      beneficiaries: [],
      personal_references: [],
      guarantee: [],
      coordinates: [lat,lng]
    };
    onSubmit(data);

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

      <IonItemDivider>
        <IonLabel>Domicilio</IonLabel>
      </IonItemDivider>
      <IonItem>
        <IonLabel position="stacked">Codigo Postal</IonLabel>
        <IonInput
          type="text"
          value={myCP}
          onIonChange={(e) => setMyCp(e.detail.value!)}
        ></IonInput>
      </IonItem>

      <IonButton onClick={onPopulateHomeColonies}>Buscar</IonButton>

      <IonItem>
        <IonLabel position="stacked">Colonia / Asentamiento</IonLabel>
        <IonSelect ref={myColonySelectList} value={colonyId} okText="Ok" cancelText="Cancelar" onIonChange={(e) => setColonyId(e.detail.value)}>
          {colonyCat.map((c: any) => ( <IonSelectOption key={c._id} value={c._id}>{c.etiqueta}</IonSelectOption>))}
        </IonSelect>
      </IonItem>
    
      <IonItem>
        <IonLabel position="stacked">Ciudad / Localidad</IonLabel>
        <IonInput type="text" value={cityName}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Municipio</IonLabel>
        <IonInput type="text" value={municipalityName}></IonInput>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Entidad Federativa</IonLabel>
        <IonInput type="text" value={provinceName + ", " + countryName}></IonInput>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Calle y numero (avenida, via, etc)</IonLabel>
        <IonInput type="text" value={address_line1} onIonChange={(e) => setAddressL1(e.detail.value!)} onIonBlur={(e:any)=>setAddressL1(e.target.value.toUpperCase())}></IonInput>
      </IonItem>

      <IonItemDivider>
        <IonLabel>Ocupacion, profesion y Actividad Economica</IonLabel>
      </IonItemDivider>
        <SelectDropSearch dataList={ocupationCatalog} setSelectedItemFx={setOcupation} currentItem={ocupation} description={'Ocupacion...'} />
        <SelectDropSearch dataList={professionCatalog} setSelectedItemFx={setProfession} currentItem={profession} description={'Profesion...'}/>
        <SelectDropSearch dataList={economicActivityCatalog} setSelectedItemFx={setEconomicActivity} currentItem={economicActivity}description={'Actividad economica...'}/>
            
            <IonItem>
              <IonLabel position="stacked">Escolaridad</IonLabel>
              <IonSelect value={educationLevel} okText="Ok" cancelText="Cancelar" onIonChange={(e) => setEducationLevel(e.detail.value)}>
                {educationLevelCatalog.map((c: any) => ( <IonSelectOption key={c.id} value={c.id}>{c.etiqueta}</IonSelectOption>))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Estado civil</IonLabel>
              <IonSelect value={maritalStatus} okText="Ok" cancelText="Cancelar" onIonChange={(e) => setMaritalStatus(e.detail.value)}>
                {maritalStatusCatalog.map((c: any) => (<IonSelectOption key={c.id} value={c.id}>{c.etiqueta}</IonSelectOption>))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">RFC</IonLabel><IonInput type="text" required value={rfc} onIonChange={(e) => setRfc(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Regimen Fiscal</IonLabel>
              <IonSelect value={tributaryRegime} okText="Ok" cancelText="Cancelar" onIonChange={(e) => setTributaryRegime(e.detail.value)}>
                {tributaryRegCatalog.map((c: any) => ( <IonSelectOption key={c.id} value={c.id}>{c.etiqueta}</IonSelectOption>))}
              </IonSelect>
            </IonItem>

      <IonItemDivider><IonLabel>¿Tiene Negocio?</IonLabel></IonItemDivider>
              <IonItem>
                <IonLabel>No Tiene Negocio</IonLabel>
                <IonCheckbox checked={not_bis} onIonChange={(e) => setNotBis(e.detail.checked)} />
              </IonItem>
          
              <IonItem>
                <IonLabel position="stacked">
                  Nombre de tu negocio
                </IonLabel>
                <IonInput type="text" value={businessName} onIonChange={(e) => setBusinessName(e.detail.value!)} disabled={not_bis}></IonInput>
              </IonItem>
              <IonItem button={true} id="open-bis-start-date-input" disabled={not_bis }>
                <IonLabel>Fecha de inicio de actividad</IonLabel>
                <IonText slot="end">{bisStartedDateFormatted}</IonText>
                <IonPopover
                  trigger="open-bis-start-date-input"
                  showBackdrop={false}
                >
                  <IonDatetime
                  disabled={not_bis}
                    presentation="date"
                    value={bisStartedDate}
                    onIonChange={(ev:any) => {
                      setBisStartedDate(ev.detail.value!);
                      setBiStartedDateFormatted(formatDate(ev.detail.value!));
                    }}
                  />
                </IonPopover>
              </IonItem>

              <IonItem>
                <IonLabel>Rentas el establecimiento?</IonLabel>
                <IonCheckbox
                  disabled={not_bis}
                  checked={bisOwnOrRent}
                  onIonChange={(e) => setOwnOrRent(e.detail.checked)}
                ></IonCheckbox>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Telefono del negocio</IonLabel>
                <IonInput type="text" disabled={not_bis}></IonInput>
              </IonItem>

              {!not_bis && <div>
              <IonItemDivider><IonLabel>¿Donde se ubica el negocio?</IonLabel></IonItemDivider>
              
              <IonItem>
                <IonLabel>Misma direccion anterior</IonLabel>
                <IonCheckbox checked={bis_address_same} onIonChange={
                    async (e) => {
                      setBisAddressSame(e.detail.checked);
                      setBisCp(myCP);
                      setAddressL1Bis(address_line1);
                      setColonyBisCat( colonyCat);
                      setColonyBisId( colonyId);
                    }} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Codigo Postal</IonLabel>
                <IonInput
                  type="text"
                  value={bisCP}
                  onIonChange={(e) => setBisCp(e.detail.value!)}
                ></IonInput>
              </IonItem>
              <IonButton onClick={onPopulateBisColonies}>Buscar</IonButton>
              <IonItem>
                <IonLabel position="stacked">Colonia / Asentamiento</IonLabel>
                <IonSelect
                  ref={myColonyBisSelectList}
                  value={bisColonyId}
                  okText="Ok"
                  cancelText="Cancelar"
                  onIonChange={(e) => setColonyBisId(e.detail.value)}
                >
                  {colonyBisCat.map((c: any) => (
                    <IonSelectOption key={c._id} value={c._id}>
                      {c.etiqueta}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ciudad / Localidad</IonLabel>
                <IonInput type="text" value={bisCityName}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Municipio</IonLabel>
                <IonInput type="text" value={bisMunicipalityName}></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Entidad Federativa</IonLabel>
                <IonInput
                  type="text"
                  value={bisProvinceName + ", " + bisCountryName}
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">
                  Calle y numero (avenida, via, etc)
                </IonLabel>
                <IonInput
                  type="text"
                  value={bisAddress_line1}
                  onIonChange={(e) => setAddressL1Bis(e.detail.value!)}
                  onIonBlur={(e:any)=>setAddressL1Bis(e.target.value.toUpperCase())}
                ></IonInput>
              </IonItem>
            </div>}

            <IonItemDivider><IonLabel>Resumen de Informacion</IonLabel></IonItemDivider>
            <IonGrid className="fuente-sm">
                <IonRow>
                  <IonCol size="4">Nombre:</IonCol> <IonCol>{name} {lastname} {second_lastname}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Curp:</IonCol> <IonCol>{curp}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Profesion:</IonCol> <IonCol>{profession.etiqueta}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Escolaridad:</IonCol> <IonCol>{educationLevel ? educationLevelCatalog.find((i: any) => i.id == educationLevel)!.etiqueta: ""}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Estado Civil:</IonCol> <IonCol>{maritalStatus ? maritalStatusCatalog.find((i: any) => i.id == maritalStatus)!.etiqueta: ""}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Actividad Económica:</IonCol> <IonCol>{economicActivity.etiqueta}</IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="4">Domicilio</IonCol> <IonCol>{address_line1}, {colonyName}, {municipalityName} - {provinceName}, {myCP}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Tengo Negocio?</IonCol> <IonCol>{not_bis ? 'No' : 'Si, tengo un negocio'}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Coord Geo:</IonCol> <IonCol>{lat},{lng}</IonCol>
                </IonRow>
                {!not_bis &&
                    <IonRow>
                      <IonCol size="4">Nombre del negocio</IonCol><IonCol>{businessName} {bis_address_same ? '(En el domicilio)' : ''}</IonCol>
                    </IonRow>
                }
                {
                  !not_bis && !bis_address_same &&
                  <IonRow>
                    <IonCol size="4">Ubicado en:</IonCol><IonCol>{bisAddress_line1}, {bisColonyName}, {bisMunicipalityName} - {bisProvinceName}, {bisCP}</IonCol>
                  </IonRow>              
                }
              </IonGrid>
      <IonButton expand="block" onClick={sendData}>Guardar</IonButton>
    </IonList>
  );
};
