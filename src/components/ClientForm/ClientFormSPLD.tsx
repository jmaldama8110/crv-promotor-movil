import {
  IonCheckbox, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonSelect, IonSelectOption
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";

import { ButtonSlider } from "../SliderButtons";
import { db } from "../../db";


export const ClientFormSPLD: React.FC<{ onNext: any }> = ({ onNext }) => {

  const { clientData } = useContext(AppContext);

  const [funcionPublicaCheck, setFuncionPublicaCheck] = useState<boolean>(false);
  const [funcionPublicaCargo, setFuncionPublicaCargo] = useState<string>("");
  const [funcionPublicaDependencia, setFuncionPublicaDependencia] = useState<string>("");

  const [funcionPublicaCheckFam, setFuncionPublicaCheckFam] = useState<boolean>(false);
  const [funcionPublicaCargoFam, setFuncionPublicaCargoFam] = useState<string>("");
  const [funcionPublicaDependenciaFam, setFuncionPublicaDependenciaFam] = useState<string>("");

  const [familiarName, setFamiliarName] = useState<string>("");
  const [familiarLastname, setFamiliarLastname] = useState<string>("");
  const [familiarSecondlastname, setFamiliarSecondlastname] = useState<string>("");
  const [familiarParentesco, setFamiliarParentesco] = useState<string>("");
  
  const [instrument, setInstrument] = useState<number>(1);
  const [instrumentCatalog, setInstrumentCatalog] = useState<any[]>([]);

  useEffect(() => {

    db.find( {
      selector: {
        couchdb_type: 'CATALOG',
        name: 'SPLD_InstrumentoMonetario'
      }
    }).then( (data: any) =>{
      setInstrumentCatalog( data.docs.map( (i:any) => ({ id: i.id , etiqueta: i.tipo_instrumento })))
        if (clientData._id) {
          setFuncionPublicaCheck( !!clientData.spld.desempenia_funcion_publica_cargo );
          setFuncionPublicaCheckFam( !!clientData.spld.familiar_desempenia_funcion_publica_cargo);
          setFuncionPublicaCargo( clientData.spld.desempenia_funcion_publica_cargo);
          setFuncionPublicaDependencia( clientData.spld.desempenia_funcion_publica_dependencia);
          setFuncionPublicaCargoFam( clientData.spld.familiar_desempenia_funcion_publica_cargo);
          setFuncionPublicaDependenciaFam( clientData.spld.familiar_desempenia_funcion_publica_dependencia);
          setFamiliarName( clientData.spld.familiar_desempenia_funcion_publica_nombre);
          setFamiliarLastname( clientData.spld.familiar_desempenia_funcion_publica_paterno);
          setFamiliarSecondlastname(clientData.spld.familiar_desempenia_funcion_publica_materno);
          setFamiliarParentesco( clientData.spld.familiar_desempenia_funcion_publica_parentesco);
          // setInstrument(clientData.spld.instrumento_monetario[0]);

        }
    })

  }, [clientData]);

  useEffect( ()=>{
    if( clientData._id && instrumentCatalog.length ) {
      if(clientData.spld.instrumento_monetario.length && !!clientData.spld.instrumento_monetario)
        setInstrument( clientData.spld.instrumento_monetario[0])
    }
  },[instrumentCatalog])

  const onSubmit = () => {
 
    onNext({
      spld: {
        desempenia_funcion_publica_cargo: funcionPublicaCargo,
        desempenia_funcion_publica_dependencia: funcionPublicaDependencia,
        familiar_desempenia_funcion_publica_cargo: funcionPublicaCargoFam,
        familiar_desempenia_funcion_publica_dependencia: funcionPublicaDependenciaFam,
        familiar_desempenia_funcion_publica_nombre: familiarName,
        familiar_desempenia_funcion_publica_paterno: familiarLastname,
        familiar_desempenia_funcion_publica_materno: familiarSecondlastname,
        familiar_desempenia_funcion_publica_parentesco: familiarParentesco,
        instrumento_monetario: instrument ? [ instrument, (instrumentCatalog.find( (i:any) => i.id == instrument )).etiqueta ] : [0, ""]
    }});
  }


  return (
    <IonList className="ion-padding">

      <IonItemDivider><IonLabel>Información PLD</IonLabel></IonItemDivider>

      <IonItem>
        <IonLabel>¿Desempeña algun cargo o función pública?</IonLabel>
        <IonCheckbox
          checked={funcionPublicaCheck}
          onIonChange={(e) => setFuncionPublicaCheck(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>
      { funcionPublicaCheck && <>
      <IonItem>
        <IonLabel position="stacked">Nombre del Cargo</IonLabel>
        <IonInput
          type="text"
          value={funcionPublicaCargo}
          onIonChange={(e) => setFuncionPublicaCargo(e.detail.value!)}
        ></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Nombre de la dependencia</IonLabel>
        <IonInput
          type="text"
          value={funcionPublicaDependencia}
          onIonChange={(e) => setFuncionPublicaDependencia(e.detail.value!)}
        ></IonInput>
      </IonItem></>
      }
      
      <IonItem>
        <IonLabel>¿Familiar que desempeña algun cargo o función pública?</IonLabel>
        <IonCheckbox
          checked={funcionPublicaCheckFam}
          onIonChange={(e) => setFuncionPublicaCheckFam(e.detail.checked)}
        ></IonCheckbox>
      </IonItem>

      {
        funcionPublicaCheckFam && 
        <>
          <IonItem>
            <IonLabel position="stacked">Nombre del Cargo</IonLabel>
            <IonInput
              type="text"
              value={funcionPublicaCargoFam}
              onIonChange={(e) => setFuncionPublicaCargoFam(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Nombre de la dependencia</IonLabel>
            <IonInput
              type="text"
              value={funcionPublicaDependenciaFam}
              onIonChange={(e) => setFuncionPublicaDependenciaFam(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItemDivider><IonLabel>Datos del familiar</IonLabel></IonItemDivider>
          <IonItem>
            <IonLabel position="stacked">Nombre</IonLabel>
            <IonInput
              type="text"
              value={familiarName}
              onIonChange={(e) => setFamiliarName(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Apellido Paterno</IonLabel>
            <IonInput
              type="text"
              value={familiarLastname}
              onIonChange={(e) => setFamiliarLastname(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Apellido Materno</IonLabel>
            <IonInput
              type="text"
              value={familiarSecondlastname}
              onIonChange={(e) => setFamiliarSecondlastname(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Parentesco</IonLabel>
            <IonInput
              type="text"
              value={familiarParentesco}
              onIonChange={(e) => setFamiliarParentesco(e.detail.value!)}
            ></IonInput>
          </IonItem>
        </>
      }

      <IonItem>
        <IonLabel position="stacked">Instrumento Monetario</IonLabel>
        <IonSelect
          value={instrument}
          okText="Ok"
          cancelText="Cancelar"
          onIonChange={(e) => setInstrument(e.detail.value)}
        >
          {instrumentCatalog.map((c: any) => (
            <IonSelectOption key={c.id} value={c.id}>
              {c.etiqueta}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
      <br/>
      <p> 
        { !instrument && <i> * Debes especificar el instrumento monetario</i>}
      </p>

      <ButtonSlider
        disabled={ !instrument }
        onClick={onSubmit}
        slideDirection={'F'}
        color='medium'
        expand="block"
        label="Siguiente" />
      <ButtonSlider onClick={() => { }} slideDirection={'B'} color="light" expand="block" label="Anterior" />

    </IonList>
  );
};
