import { IonButton, IonCheckbox, IonDatetime, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonPopover, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../db";
import { AppContext } from "../../store/store";
import { formatDate } from "../../utils/numberFormatter";
import { ButtonSlider } from "../SliderButtons";


interface ColonyType {
  _id: string;
  etiqueta: string;
  ciudad_localidad: string;
}

export const ClientFormAddress: React.FC<{ addressType: "DOMICILIO" | "NEGOCIO", onNext: any }> = ({ addressType, onNext }) => {

  const { clientData, dispatchSession } = useContext(AppContext);

  const [bis_address_same, setBisAddressSame] = useState<boolean>(false);
  const [postCode, setPostCode] = useState('');

  const [colonyCat, setColonyCat] = useState<ColonyType[]>([]);
  const [colonyId, setColonyId] = useState<string>("");

  const [displayColony, setDisplayColony] = useState<string>('') /// only displayed when address is already editted

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

  const [ext_number, setExtNumber] = useState<number>(0);
  const [extNumberError, setExtNumberError] = useState<boolean>(false);

  const [homeResideSinceDate, setHomeResideSinceDate] = useState("");
  const [homeResideSinceDateFormatted, setHomeResideSinceDateFormatted] = useState("");


  const [int_number, setIntNumber] = useState<number>(0);
  const [intNumberError, setIntNumberError] = useState<boolean>(false);
  const [street_reference, setStreetReference] = useState('');
  const [streetReferenceError, setStreetReferenceError] = useState<boolean>(false);

  const [exterior_number, setExteriorNumber] = useState<string>('');
  const [interior_number, setInteriorNumber] = useState<string>('');

  const [road, setRoad] = useState<number>(0);
  const [roadCatalog, setRoadCatalog] = useState<any[]>([]);

  const [ownwerShipId, setOwnerShipId] = useState<number>(0);
  const [ownwershipCatalog, setOwnershipCatalog] = useState<any[]>([]);


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
      setExtNumber(0);
      setExteriorNumber('')
      setOwnerShipId(0);
      setIntNumber(0);
      setInteriorNumber('');
      setStreetReference('');
    }

  }
  useEffect(() => {
    if (colonyCat.length)
      myColonySelectList.current.open();
  }, [colonyCat]);

  // when colony selected changes, needs to update
  useEffect(() => {
    if (colonyId && !bis_address_same) {
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
        /** Load colonies when component launches */

        await db.createIndex({ index: { fields: ['couchdb_type', 'name'] } });
        const dbData = await db.find({
          selector: {
            couchdb_type: "CATALOG",
            name: "CATA_TipoVialidad"
          }
        })
        setRoadCatalog(dbData.docs.filter((i: any) => i.activo));

        const cataSitacionCatalog = await db.find({
          selector: {
            couchdb_type: "CATALOG",
            name: "CATA_TipoDomicilio"
          }
        });

        const newData = cataSitacionCatalog.docs.map((i: any) => ({ id: i.id, etiqueta: i.etiqueta }))
        setOwnershipCatalog(newData);

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
        const addressItem = clientData.address.find((i: any) => (i.type === addressType))

        if (addressItem) {

          setPostCode(addressItem.post_code);

          setColonyId(addressItem.colony[0]);
          setDisplayColony(addressItem.colony[1]);

          setCityId(addressItem.city[0])
          setCityName(addressItem.city[1]);

          setMunicipalityId(addressItem.municipality[0]);
          setMunicipalityName(addressItem.municipality[1]);
          setProvinceId(addressItem.province[0])
          setProvinceName(addressItem.province[1]);
          setCountryId(addressItem.country[0]);
          setCountryName(addressItem.country[1]);

          setAddressL1(addressItem.address_line1);
          setExtNumber(addressItem.ext_number);
          setIntNumber(addressItem.int_number);
          setInteriorNumber(addressItem.interior_number);
          setExteriorNumber(addressItem.exterior_number);
          setStreetReference(addressItem.street_reference);

          setHomeResideSinceDate(addressItem.residence_since);
          setHomeResideSinceDateFormatted(formatDate(addressItem.residence_since));

          if (addressType === 'NEGOCIO') {
            setBisAddressSame(addressItem.bis_address_same)
          }
        }

      }
    }
  }, [clientData])

  useEffect(() => {
    /// if we are editing, then set the current value of the roadType ID
    if (clientData._id && roadCatalog.length) {
      const homeAddress = clientData.address.find((i: any) => (i.type === addressType))
      if (homeAddress && !!homeAddress.road)
        if (homeAddress.road.length > 0) {
          setRoad(homeAddress.road[0]);
        }
    }
  }, [roadCatalog])

  useEffect(() => {

    /// if we are editing, then set the current value of the roadType ID
    if (clientData._id && ownwershipCatalog.length) {
      const homeAddress = clientData.address.find((i: any) => (i.type === addressType))
      if (homeAddress && !!homeAddress.ownership_type)
        if (homeAddress.ownership_type.length > 0) {
          setOwnerShipId(homeAddress.ownership_type[0]);
        }

    }
  }, [ownwershipCatalog])

  function onSubmit() {

    const roadItem = roadCatalog.find((x: any) => x.id == road)
    const ownership_type = !ownwerShipId ? [0, ''] : [ownwerShipId, ownwershipCatalog.find((i: any) => i.id == ownwerShipId).etiqueta]
    const data = {
      type: addressType,
      address_line1,
      ext_number,
      int_number,
      exterior_number,
      interior_number,
      street_reference,
      road: road ? [road, roadItem.descripcion] : [0, ''],
      country: [countryId, countryName],
      province: [provinceId, provinceName],
      municipality: [municipalityId, municipalityName],
      city: [cityId, cityName],
      colony: [colonyId, displayColony],
      post_code: postCode,
      bis_address_same,
      ownership_type,
      residence_since: homeResideSinceDate
    }

    onNext(data);
  }

  async function onCheckBisSameAsHome(e: any) {

    setBisAddressSame(e.detail.checked);

    if (e.detail.checked) {
      const addressPrev = clientData.address.find((i: any) => i.type === 'DOMICILIO');
      console.log(addressPrev);
      if (addressPrev) {
        setPostCode(addressPrev.post_code);

        setColonyId(addressPrev.colony[0]);
        setDisplayColony( addressPrev.colony[1]);
        setCityId(addressPrev.city[0]);
        setCityName( addressPrev.city[1]);
        setMunicipalityId(addressPrev.municipality[0])
        setMunicipalityName( addressPrev.municipality[1]);
        setProvinceId( addressPrev.province[0])
        setProvinceName( addressPrev.province[1]);
        setCountryId(addressPrev.country[0])
        setCountryName(addressPrev.country[1])

        setAddressL1(addressPrev.address_line1);

        setExtNumber(addressPrev.ext_number);
        setExteriorNumber(addressPrev.exterior_number);

        setIntNumber(addressPrev.int_number);
        setInteriorNumber(addressPrev.interior_number);
        setStreetReference(addressPrev.street_reference);
        setRoad(addressPrev.road[0]);
        setOwnerShipId(addressPrev.ownership_type[0]);

      }
    }


  }

  return (


    <IonList className="ion-padding">

      {addressType === 'NEGOCIO' &&
        <div>
          <IonItemDivider><IonLabel>¿Donde se ubica el negocio?</IonLabel></IonItemDivider>
          <IonItem>
            <IonLabel>Misma direccion anterior</IonLabel>
            <IonCheckbox
              checked={bis_address_same}
              onIonChange={onCheckBisSameAsHome}
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
          type="number"
          value={ext_number}
          onIonChange={(e) => setExtNumber(parseFloat(e.detail.value!))}
          onIonBlur={(e: any) => e.target.value ? setExtNumber(parseFloat(e.target.value)) : setExtNumberError(true)}
          onIonFocus={() => setExtNumberError(false)}
          style={extNumberError ? { border: "1px dotted red" } : {}}
        ></IonInput>
      </IonItem>
      <IonItem>
        <IonInput
          type="text"
          value={exterior_number}
          onIonChange={(e) => setExteriorNumber(e.detail.value!)}
          onIonBlur={(e: any) => e.target.value ? setExteriorNumber(e.target.value) : setExtNumberError(true)}
          onIonFocus={() => setExtNumberError(false)}
          style={extNumberError ? { border: "1px dotted red" } : {}}
        ></IonInput>

      </IonItem>
      <IonItem>
        <IonLabel position="stacked">
          Numero Interior
        </IonLabel>
        <IonInput
          type="number"
          value={int_number}
          onIonChange={(e) => setIntNumber(parseFloat(e.detail.value!))}
          onIonBlur={(e: any) => e.target.value ? setIntNumber(parseFloat(e.target.value)) : setIntNumberError(true)}
          onIonFocus={() => setIntNumberError(false)}
          style={intNumberError ? { border: "1px dotted red" } : {}}
        ></IonInput>
      </IonItem>
      <IonItem>
        <IonInput
          type="text"
          value={interior_number}
          onIonChange={(e) => setInteriorNumber(e.detail.value!)}
          onIonBlur={(e: any) => e.target.value ? setInteriorNumber(e.target.value) : setIntNumberError(true)}
          onIonFocus={() => setIntNumberError(false)}
          style={intNumberError ? { border: "1px dotted red" } : {}}
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
            {
              ownwershipCatalog.map((i: any) => (
                <IonSelectOption key={i.id} value={i.id}>{i.etiqueta}</IonSelectOption>
              ))
            }
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
        {!colonyId && <i style={{ color: "gray" }}>* Usa el codigo postal para buscar la lista de asentamientos o colonias disponible<br /></i>}
        {addressLine1Error && <i style={{ color: "gray" }}>* Ingresa el nombre de la calle o vialidad<br /></i>}
        {extNumberError && <i style={{ color: "gray" }}>* Numero exterior obligatorio (si no tiene, debe colocar SN<br /></i>}
        {intNumberError && <i style={{ color: "gray" }}>* Numero interior obligatorio (si no tiene, debe colocar SN<br /></i>}
        {streetReferenceError && <i style={{ color: "gray" }}>* Referencia es obligatoria: (ej.: color de la fachada, porton, etc)<br /></i>}
        {!road && <i style={{ color: "gray" }}>* Tipo de vialidad es obligatoria<br /></i>}
        {!homeResideSinceDate && addressType === 'DOMICILIO' && <i style={{ color: "gray" }}>* Elige el mes/año desde que reside ahi la persona<br /></i>}
        {!ownwerShipId && addressType === 'DOMICILIO' && <i style={{ color: "gray" }}>* Vivienda Propia / Rentada es un datos obligatorio<br /></i>}


      </p>
      <ButtonSlider disabled={!colonyId || addressLine1Error || extNumberError || intNumberError || streetReferenceError || !road || ((!homeResideSinceDate || !ownwerShipId) && addressType === 'DOMICILIO')}
        onClick={onSubmit}
        slideDirection={'F'}
        color='medium'
        expand="block"
        label="Siguiente"
        className="margin-bottom-sm" />
      <ButtonSlider onClick={() => { }} slideDirection={'B'} color="light" expand="block" label="Anterior" />
    </IonList>
  );

};
