import { IonList, IonItem, IonLabel, IonInput, IonItemDivider, IonButton, IonSelect, IonSelectOption, IonDatetime, IonPopover, IonText, IonCheckbox } from "@ionic/react";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../db";
import { AppContext } from "../../store/store";
import { formatDate } from "../../utils/numberFormatter";


interface ColonyType {
    _id: string;
    etiqueta: string;
    ciudad_localidad: string;
}

export const AddressForm: React.FC<{ addressType: "DOMICILIO" | "NEGOCIO" }> = ({ addressType }) => {

    const { clientData, dispatchSession } = useContext(AppContext);

    const [bis_address_same, setBisAddressSame] = useState<boolean>(false);
    const [postCode, setPostCode] = useState('');

    const [colonyCat, setColonyCat] = useState<ColonyType[]>([]);
    const [colonyId, setColonyId] = useState<string>("");

    const [displayColony, setDisplayColony] = useState('') /// only displayed when address is already editted

    const [cityId, setCityId] = useState<string>('');
    const [cityName, setCityName] = useState<string>("");
    const [municipalityId, setMunicipalityId] = useState<string>('');
    const [municipalityName, setMunicipalityName] = useState<string>("");
    const [provinceId, setProvinceId] = useState<string>('');
    const [provinceName, setProvinceName] = useState<string>("");
    const [countryId, setCountryId] = useState<string>('');
    const [countryName, setCountryName] = useState<string>("");


    const [disabledSearch, setDisableSearch] = useState(true);
    const myColonySelectList = useRef<any>(null);

    const [address_line1, setAddressL1] = useState<string>("");
    const [addressLine1Error, setAddressL1Error] = useState<boolean>(false);

    const [ext_number, setExtNumber] = useState('');
    const [extNumberError, setExtNumberError] = useState<boolean>(false);

    const [homeResideSinceDate, setHomeResideSinceDate] = useState("");
    const [homeResideSinceDateFormatted, setHomeResideSinceDateFormatted] = useState("");


    const [int_number, setIntNumber] = useState('');
    const [intNumberError, setIntNumberError] = useState<boolean>(false);
    const [street_reference, setStreetReference] = useState('');
    const [streetReferenceError, setStreetReferenceError] = useState<boolean>(false);

    const [road, setRoad] = useState<number>(0);
    const [roadCatalog, setRoadCatalog] = useState<any[]>([]);

    const [ownwerShipId, setOwnerShipId] = useState<string>('');

    let render = true;

    async function onSearchColonies() {
        await
            db.createIndex({
                index: { fields: ['couchdb_type', 'codigo_postal'] }
            });
        const colonies: any = await db.find({
            selector: {
                couchdb_type: "NEIGHBORHOOD",
                codigo_postal: postCode,
            },
        });

        setColonyCat(colonies.docs.map((i: any) => ({
            _id: i._id,
            etiqueta: i.etiqueta,
            ciudad_localidad: i.ciudad_localidad,
        })));
    }

    function onPostCodeInput(ev: Event) {
        const value = (ev.target as HTMLIonInputElement).value as string;
        const onlyNumbers = new RegExp(/^[0-9]{5,5}$/);
        if (value.match(onlyNumbers)) {
            setPostCode(value);
            setDisableSearch(false)
        }
        else {
            setPostCode('')
            setDisableSearch(true);
            setDisplayColony('');
            setCityName('');
            setMunicipalityName('');
            setProvinceName('');
            setAddressL1('');
            setCountryName('');
            setExtNumber('');
            setOwnerShipId('');
            setIntNumber('');
            setStreetReference('');
        }

    }
    useEffect(() => {
        if (colonyCat.length)
            myColonySelectList.current.open();
    }, [colonyCat]);

    // when colony selected changes, needs to update
    useEffect(() => {
        if (colonyId) {
            const selectedColony = colonyCat.find((i: ColonyType) => i._id === colonyId);
            const colonyLabel: string | undefined = selectedColony?.etiqueta;
            setDisplayColony(colonyLabel ? colonyLabel : '')

            if (selectedColony) {

                db.get(selectedColony.ciudad_localidad).then((city: any) => {
                    setCityName(city.etiqueta);
                    setCityId(city._id);
                    db.get(city.municipio).then((mun: any) => {
                        setMunicipalityName(mun.etiqueta);
                        setMunicipalityId(mun._id)
                        db.get(mun.estado).then((prov: any) => {
                            setProvinceName(prov.etiqueta);
                            setProvinceId(prov._id);
                            db.get(prov.pais).then((cou: any) => {
                                setCountryName(cou.etiqueta);
                                setCountryId(cou._id);
                            })
                        })
                    })
                });

            }
        }

    }, [colonyId])

    useEffect(() => {

        async function LoadCatalog() {
            try {
                await db.createIndex({ index: { fields: ['couchdb_type', 'name'] } });
                const dbData = await db.find({
                    selector: {
                        couchdb_type: "CATALOG",
                        name: "CATA_TipoVialidad"
                    }
                })
                setRoadCatalog(dbData.docs.filter((i: any) => i.activo));
            }
            catch (e) {

            }
        }

        if (render) {
            render = false;
            LoadCatalog();
        }


        if (clientData._id) { // loads up onyl when edit client mode (_id not empty)
            if (clientData.address.length) { // populates Colonies component
                const addressItem = clientData.address.find( (i:any) => ( i.type === addressType))
                
                if (addressItem) {

                    setPostCode(addressItem.post_code);
                    setDisplayColony(addressItem.colony[1]);
                    setCityName(addressItem.city[1]);
                    setMunicipalityName(addressItem.municipality[1]);
                    setProvinceName(addressItem.province[1]);
                    setCountryName(addressItem.country[1]);

                    setAddressL1(addressItem.address_line1);
                    setExtNumber(addressItem.ext_number);
                    setIntNumber(addressItem.int_number);
                    setStreetReference(addressItem.street_reference);
                    setOwnerShipId(addressItem.ownership_type);
                    setHomeResideSinceDate(addressItem.residence_since);
                    setHomeResideSinceDateFormatted(formatDate(addressItem.residence_since));
                    
                    if( addressType === 'NEGOCIO'){
                        setBisAddressSame(addressItem.bis_address_same)
                    }
                }

            }
        }
    }, [clientData])

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

    return (
        <IonList className='ion-padding'>
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
                    setPostCode(addressPrev.post_code);
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


            <IonItemDivider><IonLabel>Buscar colonia / asentamiento</IonLabel></IonItemDivider>
            <IonItem>
                <IonInput type="text" onIonInput={onPostCodeInput} value={postCode} placeholder="Codigo postal"></IonInput>
            </IonItem>
            <IonButton onClick={onSearchColonies} disabled={disabledSearch}>Buscar</IonButton>

            <IonItem>
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

            <IonItemDivider><IonLabel>Informacion del asentamiento</IonLabel></IonItemDivider>
            <IonItem><IonLabel>{displayColony}</IonLabel></IonItem>
            <IonItem><IonLabel>{cityName}, {municipalityName}</IonLabel></IonItem>
            <IonItem><IonLabel>{`${provinceName}, ${countryName}`}</IonLabel></IonItem>

            <IonItemDivider><IonLabel>Vialidad, numero, referencia</IonLabel></IonItemDivider>
            <IonItem>
                <IonLabel position="stacked">
                    Calle y numero (avenida, via, etc)
                </IonLabel>
                <IonInput
                    type="text"
                    value={address_line1}
                    onIonChange={(e) => setAddressL1(e.detail.value!)}
                    onIonBlur={(e: any) => e.target.value ? setAddressL1(e.target.value.toUpperCase()) : setAddressL1Error(true)}
                    onIonFocus={() => setAddressL1Error(false)}
                    style={addressLine1Error ? { border: "1px dotted red" } : {}}
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
                    onIonBlur={(e: any) => e.target.value ? setExtNumber(e.target.value.toUpperCase()) : setExtNumberError(true)}
                    onIonFocus={() => setExtNumberError(false)}
                    style={extNumberError ? { border: "1px dotted red" } : {}}
                ></IonInput>
            </IonItem>

            {addressType === "DOMICILIO" && <>
                <IonItem>
                    <IonLabel position="stacked">Vivienda Propia / Rentada</IonLabel>
                    <IonSelect
                        value={ownwerShipId}
                        okText="Ok"
                        cancelText="Cancelar"
                        onIonChange={(e) => setOwnerShipId(e.detail.value)}
                        style={!ownwerShipId ? { border: "1px dotted red" } : {}}
                    >
                        <IonSelectOption key={'household-conditions-select-id-01'} value='PROPIO'>Propia</IonSelectOption>
                        <IonSelectOption key={'household-conditions-select-id-02'} value='RENTADO'>Rentada</IonSelectOption>
                        <IonSelectOption key={'household-conditions-select-id-03'} value='FAMILIAR'>Familiar</IonSelectOption>
                    </IonSelect>
                </IonItem>

                <IonItem button={true} id="open-home-address-reside-since-input">
                    <IonLabel>Reside ahi desde:</IonLabel>
                    <IonText slot="end">{homeResideSinceDateFormatted}</IonText>
                    <IonPopover trigger="open-home-address-reside-since-input" showBackdrop={false}>
                        <IonDatetime
                            presentation="month-year"
                            value={homeResideSinceDate}
                            onIonChange={(ev: any) => {
                                setHomeResideSinceDate(ev.detail.value!);
                                setHomeResideSinceDateFormatted(formatDate(ev.detail.value!));
                            }}

                        />
                    </IonPopover>
                </IonItem>
            </>}

            <IonItem>
                <IonLabel position="stacked">
                    Numero Interior
                </IonLabel>
                <IonInput
                    type="text"
                    value={int_number}
                    onIonChange={(e) => setIntNumber(e.detail.value!)}
                    onIonBlur={(e: any) => e.target.value ? setIntNumber(e.target.value.toUpperCase()) : setIntNumberError(true)}
                    onIonFocus={() => setIntNumberError(false)}
                    style={intNumberError ? { border: "1px dotted red" } : {}}
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
                    onIonBlur={(e: any) => e.target.value ? setStreetReference(e.target.value.toUpperCase()) : setStreetReferenceError(true)}
                    onIonFocus={() => setStreetReferenceError(false)}
                    style={streetReferenceError ? { border: "1px dotted red" } : {}}
                ></IonInput>
            </IonItem>


            <IonItem>
                <IonLabel position="stacked">Tipo Vialidad</IonLabel>
                <IonSelect
                    value={road}
                    okText="Ok"
                    cancelText="Cancelar"
                    onIonChange={(e) => setRoad(e.detail.value)}
                    style={!road ? { border: "1px dotted red" } : {}}
                >
                    {roadCatalog.map((c: any) => (
                        <IonSelectOption key={c.id} value={c.id}>
                            {c.descripcion}
                        </IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>

            <p>
          { !postCode && <i style={{color: "gray"}}>* Usa el codigo postal para buscar la lista de asentamientos o colonias disponible<br/></i>}
          { addressLine1Error && <i style={{color: "gray"}}>* Ingresa el nombre de la calle o vialidad<br/></i>}
          { extNumberError && <i style={{color: "gray"}}>* Numero exterior obligatorio (si no tiene, debe colocar SN<br/></i>}
          { intNumberError && <i style={{color: "gray"}}>* Numero interior obligatorio (si no tiene, debe colocar SN<br/></i>}
          { streetReferenceError && <i style={{color: "gray"}}>* Referencia es obligatoria: (ej.: color de la fachada, porton, etc)<br/></i>}
          { !road && <i style={{color: "gray"}}>* Tipo de vialidad es obligatoria<br/></i>}
          {! homeResideSinceDate && addressType === 'DOMICILIO' && <i style={{color: "gray"}}>* Elige el mes/año desde que reside ahi la persona<br/></i> }
          {! ownwerShipId && addressType === 'DOMICILIO' && <i style={{color: "gray"}}>* Vivienda Propia / Rentada es un datos obligatorio<br/></i> }


        </p>
                <IonButton expand="block" disabled={ !postCode || addressLine1Error || extNumberError || intNumberError || streetReferenceError || !road || ( (!homeResideSinceDate || !ownwerShipId)&& addressType === 'DOMICILIO')}>Guardar</IonButton>
        </IonList>
    );

}
/*
EN ESTA FUNCIONALIDAD NOS QUEDAMOS

Nueva Dirección
todos el formulario en blanco
el input codigo postal, genera la lista
de colonias

Si el codigo postal cambia, la lista de colonias 
se pone en blanco



*/
