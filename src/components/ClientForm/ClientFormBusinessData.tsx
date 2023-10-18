import {
  IonCheckbox,IonDatetime,IonInput,IonItem,IonItemDivider,IonLabel,IonList,IonPopover,IonSelect,IonSelectOption,IonText } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";
import { formatDate } from "../../utils/numberFormatter";
import { ButtonSlider } from "../SliderButtons";

export const ClientFormBusinessData: React.FC<{ onNext:any }> = ({ onNext}) => {
  
  const [rfc, setRfc] = useState<string>("");
  const [rfcError, setRfcError] = useState<boolean>(false);

  const { clientData } = useContext(AppContext);  
  const [bisOwnOrRent, setOwnOrRent] = useState(false);

  const [businessName, setBusinessName] = useState<string>("");
  const [businessNameError, setBusinessNameError] = useState<boolean>(false);

  const [businessPhone, setBusinessPhone] = useState<string>("");
  const [businessPhoneError, setBusinessPhoneError] = useState<boolean>(false);

  const [not_bis, setNotBis] = useState<boolean>(false);

  const [bisStartedDate, setBisStartedDate] = useState("");
  const [bisStartedDateFormatted, setBiStartedDateFormatted] = useState("");

  useEffect( ()=>{
    
      if( clientData._id){
        
        setBusinessName(clientData.business_data.business_name);
        setOwnOrRent( clientData.business_data.business_owned);
        setBisStartedDate(clientData.business_data.business_start_date);
        setBiStartedDateFormatted( formatDate( clientData.business_data.business_start_date));
        setBusinessPhone( clientData.business_data.business_phone);
        setRfc( clientData.rfc);
        setNotBis( clientData.not_bis);
      }
  },[clientData]);

  const onSubmit = ()=>{
    const data ={
      business_name: businessName,
      business_phone: businessPhone,
      business_start_date: bisStartedDate,
      business_owned: bisOwnOrRent,
      rfc,
      not_bis
    }
    onNext(data);
  }

  return (
    <IonList className="ion-padding">
      <IonItemDivider><IonLabel>¿Tiene Negocio?</IonLabel></IonItemDivider>
      <IonItem>
            <IonLabel>No Tiene Negocio</IonLabel>
            <IonCheckbox
              checked={not_bis}
              onIonChange={(e) => setNotBis(e.detail.checked)}
            />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Nombre de tu negocio</IonLabel>
        <IonInput
          type="text"
          value={businessName}
          onIonChange={(e) => setBusinessName(e.detail.value!)}
          onIonBlur={(e: any) => e.target.value ? setBusinessName(e.target.value.toUpperCase()): setBusinessNameError(true)}
          onIonFocus={()=> setBusinessNameError(false)}
          style={ businessNameError ? {border: "1px dotted red"}: {}}

          disabled={not_bis}
        ></IonInput>
      </IonItem>
      <IonItem button={true} id="open-bis-start-date-input" disabled={not_bis}>
        <IonLabel>Fecha de inicio de actividad</IonLabel>
        <IonText slot="end">{bisStartedDateFormatted}</IonText>
        <IonPopover trigger="open-bis-start-date-input" showBackdrop={false}>
          <IonDatetime
            presentation="month-year"
            value={bisStartedDate}
            onIonChange={(ev: any) => {
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
          <IonLabel position="stacked" >Telefono del negocio</IonLabel>
          <IonInput 
            type="text" 
            value={businessPhone} 
            onIonChange={ (e)=> setBusinessPhone(e.detail.value!.replace(/\D/g,''))} 
            onIonBlur={(e: any) => e.target.value.replace(/\D/g,'') ? setBusinessPhone(e.target.value.replace(/\D/g,'')): setBusinessPhoneError(true)}
            onIonFocus={()=> setBusinessPhoneError(false)}
            style={ businessPhoneError ? {border: "1px dotted red"}: {}}
  
            disabled={not_bis}>
            
            </IonInput>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">RFC</IonLabel>
        <IonInput
          disabled={not_bis}
          type="text"
          required
          value={rfc}
          onIonChange={(e) => setRfc(e.detail.value!)}
          onIonBlur={(e: any) => e.target.value ? setRfc(e.target.value.toUpperCase()): setRfcError(true)}
          onIonFocus={()=> setRfcError(false)}
          style={ rfcError ? {border: "1px dotted red"}: {}}

        ></IonInput>
      </IonItem>
      <p>
        { businessNameError && <i style={{color: "gray"}}>* Nombre o descripcion del negocio es un datos obligatorio<br/></i> }
        {! bisStartedDate && <i style={{color: "gray"}}>* Elige un mes/año cuando inicio su negocio<br/></i> }
        { businessPhoneError && <i style={{color: "gray"}}>* Un numero de telefono es obligatorio<br/></i> }
        { rfcError && <i style={{color: "gray"}}>* El RFC es obligatorio<br/></i> }
      </p>
          <ButtonSlider 
            disabled={ businessNameError || !bisStartedDate || businessPhoneError || rfcError }
            onClick={onSubmit} 
            slideDirection={'F'} 
            color='medium' 
            expand="block" 
            label="Siguiente" />
          <ButtonSlider onClick={()=>{}} slideDirection={'B'} color="light" expand="block" label="Anterior" />

    </IonList>
  );
};
