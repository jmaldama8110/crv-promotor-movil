import {
  IonCheckbox,IonDatetime,IonInput,IonItem,IonItemDivider,IonLabel,IonList,IonPopover,IonSelect,IonSelectOption,IonText } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";
import { formatDate } from "../../utils/numberFormatter";
import { ButtonSlider } from "../SliderButtons";

export const ClientFormBusinessData: React.FC<{ onNext:any }> = ({ onNext}) => {
  
  const [rfc, setRfc] = useState<string>("");

  const { clientData } = useContext(AppContext);  
  const [bisOwnOrRent, setOwnOrRent] = useState(false);
  const [businessName, setBusinessName] = useState<string>("");
  const [businessPhone, setBusinessPhone] = useState<string>("");
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
          disabled={not_bis}
        ></IonInput>
      </IonItem>
      <IonItem button={true} id="open-bis-start-date-input" disabled={not_bis}>
        <IonLabel>Fecha de inicio de actividad</IonLabel>
        <IonText slot="end">{bisStartedDateFormatted}</IonText>
        <IonPopover trigger="open-bis-start-date-input" showBackdrop={false}>
          <IonDatetime
            
            presentation="date"
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
          <IonInput type="text" value={businessPhone} onIonChange={ (e)=> setBusinessPhone(e.detail.value!)} disabled={not_bis}></IonInput>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">RFC</IonLabel>
        <IonInput
          disabled={not_bis}
          type="text"
          required
          value={rfc}
          onIonChange={(e) => setRfc(e.detail.value!)}
        ></IonInput>
      </IonItem>
          <ButtonSlider onClick={onSubmit} slideDirection={'F'} color='medium' expand="block" label="Siguiente" />
          <ButtonSlider onClick={()=>{}} slideDirection={'B'} color="light" expand="block" label="Anterior" />

    </IonList>
  );
};
