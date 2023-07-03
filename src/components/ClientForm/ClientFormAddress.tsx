import { IonButton, IonCheckbox, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonSelect, IonSelectOption } from "@ionic/react";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../db";
import { AppContext } from "../../store/store";
import { ButtonSlider } from "../SliderButtons";


interface ColonyType {
  _id: string;
  etiqueta: string;
  ciudad_localidad: string;
}

export const ClientFormAddress: React.FC<{addressType: "DOMICILIO"|"NEGOCIO", onNext:any}> = ( { addressType, onNext }) => {

  const { clientData, dispatchSession } = useContext(AppContext);
  const [bis_address_same, setBisAddressSame] = useState<boolean>(false);

  const [address_line1, setAddressL1] = useState<string>(""); 
  const [myCP, setMyCp] = useState<string>("");
  const [colonyId, setColonyId] = useState<string>("");
  const myColonySelectList = useRef<any>(null);


  const [ext_number, setExtNumber] = useState('');
  const [int_number, setIntNumber] = useState('');
  const [street_reference, setStreetReference] = useState('');
  const [road, setRoad] = useState<number>(0);
  const [roadCatalog, setRoadCatalog] = useState<any[]>([]);

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

  let render = true;

  useEffect( ()=>{

    if( render){
      render = false;
      LoadCatalog();
    }

    if( clientData._id){ // loads up onyl when edit client mode (_id not empty)
      if( clientData.address.length ){ // populates Colonies component
          const homeAddress = clientData.address.find( (i:any) => ( i.type === addressType))
          if( homeAddress ){
            setMyCp(homeAddress.post_code);
            populateColoniesByPostCode( homeAddress.post_code, setColonyCat);
            setAddressL1( homeAddress.address_line1);

            setExtNumber( homeAddress.ext_number);
            setIntNumber( homeAddress.int_number);
            setStreetReference( homeAddress.street_reference);

          }

      }
    }
  
    async function LoadCatalog (){

      try{

        await db.createIndex(  { index: { fields: ['couchdb_type','name']}} );
        const dbData = await db.find({  selector: {
                                    couchdb_type: "CATALOG",
                                    name: "CATA_TipoVialidad" }})
        setRoadCatalog(dbData.docs.filter( (i:any) => i.activo ));
      }
      catch(e){

      }
    }

  },[clientData])


  //// 1. Search Post Code when click button
  const onPopulateHomeColonies = async ()=>{
    dispatchSession({ type: "SET_LOADING", loading: true, loading_msg: "Optimizando busqueda codigos postales..."});
    await populateColoniesByPostCode(myCP,setColonyCat);
    myColonySelectList.current.open();
    dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });

  }

  async function populateColoniesByPostCode( cpData: string, updateFx: (value: React.SetStateAction<ColonyType[]>) => void ) {
    if (!cpData) return;
    await 
    db.createIndex({
      index: { fields: ['couchdb_type','codigo_postal']}
    });
    const colonies = await  db.find({
        selector: {
          couchdb_type: "NEIGHBORHOOD",
          codigo_postal: cpData,
        },
      });
    updateFx( colonies.docs.map((i: any) => ({
        _id: i._id,
        etiqueta: i.etiqueta,
        ciudad_localidad: i.ciudad_localidad,
    })));
    
  }

  // 2. When Colonies finished being populated, then attempts to open the Select Drop List
  useEffect( ()=>{
    
    /// opens only when we are in Add record mode
    if( !clientData._id && colonyCat.length){
        myColonySelectList.current.open();
    }

    /// if we are editing, then set the current value of the Colony ID
    if( clientData._id && colonyCat.length ){
      const homeAddress = clientData.address.find( (i:any) => ( i.type === addressType))
      if( homeAddress)
        setColonyId( homeAddress.colony[0]);
    }
  
  },[colonyCat]);

  useEffect( ()=> {

  /// if we are editing, then set the current value of the roadType ID
  if( clientData._id && roadCatalog.length ){
    const homeAddress = clientData.address.find( (i:any) => ( i.type === addressType))
    if( homeAddress && !!homeAddress.road )
      if( homeAddress.road.length > 0 ){
        setRoad( homeAddress.road[0]);
      }
      
  }
  },[roadCatalog])

  function onSubmit() {

    const roadItem = roadCatalog.find( (x:any) => x.id == road )
    
    const data = {
      type: addressType,
      address_line1,
      ext_number,
      int_number,
      street_reference,
      road: road ? [road, roadItem.descripcion ] : [0,''],
      country: [countryId, countryName],
      province: [provinceId, provinceName],
      municipality: [municipalityId, municipalityName],
      city: [cityId, cityName],
      colony: [colonyId, colonyName],
      post_code: myCP,
    }
    
    onNext(data);
  }

  useEffect(() => {
    //// Populates City, municipality and provice based on Selected Colony
    const selectedColony = colonyCat.find((i: any) => i._id === colonyId);   
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



  return (

    
    <IonList className="ion-padding">

        { addressType==='NEGOCIO' &&
        <div> 
          <IonItemDivider><IonLabel>¿Donde se ubica el negocio?</IonLabel></IonItemDivider>
          <IonItem>
            <IonLabel>Misma direccion anterior</IonLabel>
            <IonCheckbox
            checked={bis_address_same}
            onIonChange={async (e) => {
                setBisAddressSame(e.detail.checked);

                if( e.detail.checked ){
                  const addressPrev = clientData.address.find( (i:any)=> i.type === 'DOMICILIO');
                  if( addressPrev ){
                    setMyCp(addressPrev.post_code);
                    populateColoniesByPostCode(addressPrev.post_code, setColonyCat);
                    // setColonyId( addressPrev.colony[0]);
                    setAddressL1( addressPrev.address_line1);

                    setExtNumber( addressPrev.ext_number);
                    setIntNumber( addressPrev.int_number);
                    setStreetReference( addressPrev.street_reference);
                    setRoad( addressPrev.road[0]);
                  }
                }
            }}
            />
          </IonItem>
          </div>
          }
        
        <IonItemDivider>
          <IonLabel>Direccion del {addressType}</IonLabel>
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
          <IonSelect
            ref={myColonySelectList}
            value={colonyId}
            okText="Ok"
            cancelText="Cancelar"
            onIonChange={(e) => setColonyId(e.detail.value)}
          >
            {colonyCat.map((c: any) => (
              <IonSelectOption key={c._id} value={c._id}>
                {c.etiqueta}
              </IonSelectOption>
            ))}
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
          <IonInput
            type="text"
            value={provinceName + ", " + countryName}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">
            Calle y numero (avenida, via, etc)
          </IonLabel>
          <IonInput
            type="text"
            value={address_line1}
            onIonChange={(e) => setAddressL1(e.detail.value!)}
            onIonBlur={(e: any) => setAddressL1(e.target.value.toUpperCase())}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">
            Numero Exterior
          </IonLabel>
          <IonInput
            type="text"
            value={ext_number}
            onIonChange={(e) => setExtNumber(e.detail.value!)}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">
            Numero Interior
          </IonLabel>
          <IonInput
            type="text"
            value={int_number}
            onIonChange={(e) => setIntNumber(e.detail.value!)}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">
            Referencia(s)
          </IonLabel>
          <IonInput
            type="text"
            value={street_reference}
            onIonChange={(e) => setStreetReference(e.detail.value!)}
            onIonBlur={(e: any) => setStreetReference(e.target.value.toUpperCase())}
          ></IonInput>
        </IonItem>


        <IonItem>
        <IonLabel position="stacked">Tipo Vialidad</IonLabel>
        <IonSelect
          value={road}
          okText="Ok"
          cancelText="Cancelar"
          onIonChange={(e) => setRoad(e.detail.value)}
        >
          {roadCatalog.map((c: any) => (
            <IonSelectOption key={c.id} value={c.id}>
              {c.descripcion}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

        <p></p>
          <ButtonSlider onClick={onSubmit} slideDirection={'F'} color='medium' expand="block" label="Siguiente" className="margin-bottom-sm"/>
          <ButtonSlider onClick={()=>{}} slideDirection={'B'} color="light" expand="block" label="Anterior" />
    </IonList>
  );

};
