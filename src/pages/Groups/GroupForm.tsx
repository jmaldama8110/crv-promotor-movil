import {
  IonButton,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

import { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { db } from "../../db";

export interface GroupFormProps extends RouteComponentProps {
  group?: any;
  onSubmit?: any;
}

export const GroupForm: React.FC<GroupFormProps> = (props) => {
  const [name, setName] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [weekDays, setWeekDays] = useState([
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
  ]);
  const [hourDay, setHourDay] = useState("");
  const [hourDays, setHourDays] = useState([
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ]);
  interface ColonyType {
    _id: string;
    etiqueta: string;
    ciudad_localidad: string;
  }

  const myColonySelectList = useRef<any>(null);
  const [address_line1, setAddressL1] = useState<string>("");
  const [myCP, setMyCp] = useState<string>("");
  const [colonyId, setColonyId] = useState<string>("");

  const [colonyCat, setColonyCat] = useState<ColonyType[]>([]);
  const [colonyName, setColonyName] = useState<string>("");
  const [cityId, setCityId] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");
  const [municipalityId, setMunicipalityId] = useState<string>("");
  const [municipalityName, setMunicipalityName] = useState<string>("");
  const [provinceId, setProvinceId] = useState<string>("");
  const [provinceName, setProvinceName] = useState<string>("");
  const [countryId, setCountryId] = useState<string>("");
  const [countryName, setCountryName] = useState<string>("");
  const [roadType, setRoadType ] = useState<number>(0);
  const [roadTypes, setRoadTypes] = useState([
    { id: 1, etiqueta: "Calle" },
    { id: 2, etiqueta: "Avenida" },
    { id: 3, etiqueta: "Prolongacion" },
    { id: 4, etiqueta: "Boulevard" },
])

  useEffect(() => {
    //// checamos si estamos en modo edicion
    if (props.group) {
    }
  }, [props.group]);

  function onUpdate() {
    const data: any = {
      name,
      weekday_meet: weekDay,
      hour_meet: hourDay,
      address: {
        cp: myCP,
        colony_id: colonyId,
        city_id: cityId,
        municipality_id: municipalityId,
        province_id: provinceId,
        address_line1,
      },
    };
    props.onSubmit(data);
  }
  const onPopulateHomeColonies = async () => {
    populateColoniesByPostCode(myCP, setColonyCat, myColonySelectList);
  };
  function populateColoniesByPostCode(
    cpData: string,
    updateFx: (value: React.SetStateAction<ColonyType[]>) => void,
    refComp?: React.MutableRefObject<any>
  ) {
    if (!cpData) return;
    db.createIndex({
      index: { fields: ["couchdb_type", "codigo_postal"] },
    }).then(function () {
      db.find({
        selector: {
          couchdb_type: "NEIGHBORHOOD",
          codigo_postal: cpData,
        },
      })
        .then((colonies) => {
          updateFx(
            colonies.docs.map((i: any) => ({
              _id: i._id,
              etiqueta: i.etiqueta,
              ciudad_localidad: i.ciudad_localidad,
            }))
          );
        })
        .catch((err) => {
          console.log(err);
        });

      if (refComp) refComp.current.open();
    });
  }
  useEffect(() => {
    //// Populates City, municipality and provice based on Selected Colony
    const selectedColony = colonyCat.find((i: any) => i._id === colonyId);
    console.log(colonyId);

    if (selectedColony) {
      setColonyName(selectedColony.etiqueta);
      db.get(selectedColony.ciudad_localidad).then((city: any) => {
        setCityName(city.etiqueta);
        setCityId(city._id);
        db.get(city.municipio).then((mun: any) => {
          setMunicipalityName(mun.etiqueta);
          setMunicipalityId(mun._id);
          db.get(mun.estado).then((prov: any) => {
            setProvinceName(prov.etiqueta);
            setProvinceId(prov._id);
            db.get(prov.pais).then((cou: any) => {
              setCountryName(cou.etiqueta);
              setCountryId(cou._id);
            });
          });
        });
      });
    }
  }, [colonyId]);

  return (
    <div>
      <IonList className="ion-padding">
        <IonItemDivider>
          <IonLabel>Datos personales</IonLabel>
        </IonItemDivider>
        <IonItem>
          <IonLabel position="floating">Nombre del Grupo</IonLabel>
          <IonInput
            type="text"
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
            onIonBlur={(e: any) => setName(e.target.value.toUpperCase())}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Dia de Reunion</IonLabel>
          <IonSelect
            value={weekDay}
            okText="Ok"
            cancelText="Cancelar"
            onIonChange={(e) => setWeekDay(e.detail.value)}
          >
            {weekDays.map((c: string, n: number) => (
              <IonSelectOption key={n} value={c}>
                {c}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Horario de Reunion</IonLabel>
          <IonSelect
            value={hourDay}
            okText="Ok"
            cancelText="Cancelar"
            onIonChange={(e) => setHourDay(e.detail.value)}
          >
            {hourDays.map((c: string, n: number) => (
              <IonSelectOption key={n} value={c}>
                {`${c} Hrs`}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItemDivider>
          <IonLabel>Direccion</IonLabel>
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
          <IonLabel position="floating">
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
          <IonLabel position="stacked">Vialidad</IonLabel>
          <IonSelect            
            value={roadType}
            okText="Ok"
            cancelText="Cancelar"
            onIonChange={(e) => setRoadType(e.detail.value)}
          >
            {roadTypes.map((c: any) => (
              <IonSelectOption key={c.id} value={c.id}>
                {c.etiqueta}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <p></p>
          <IonButton onClick={onUpdate} color="secondary">
            Guardar
          </IonButton>
        
      </IonList>
    </div>
  );
};
