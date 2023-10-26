import {
  IonCheckbox,IonCol,IonDatetime,IonGrid,IonInput,IonItem,IonItemDivider,IonLabel,IonList,IonPopover,IonRow,IonSelect,IonSelectOption,IonText } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";
import { formatDate } from "../../utils/numberFormatter";
import { ButtonSlider } from "../SliderButtons";

export const ClientFormBusinessData: React.FC<{ onNext:any }> = ({ onNext}) => {
  
  const [rfc, setRfc] = useState<string>("");
  const [rfcError, setRfcError] = useState<boolean>(false);

  const { clientData } = useContext(AppContext);  
  const [bisOwnOrRent, setOwnOrRent] = useState(false);

  const [numberEmployees, setNumberEmployees] = useState<string>("");

  const [businessName, setBusinessName] = useState<string>("");
  const [businessNameError, setBusinessNameError] = useState<boolean>(false);

  const [businessPhone, setBusinessPhone] = useState<string>("");
  const [businessPhoneError, setBusinessPhoneError] = useState<boolean>(false);

  const [bisStartedDate, setBisStartedDate] = useState("");
  const [bisStartedDateFormatted, setBiStartedDateFormatted] = useState("");

  /// Estacionalidad durante el año B-R-M
  const [monthSaleJan, setMonthSaleJan] = useState("");
  const [monthSaleFeb, setMonthSaleFeb] = useState("");
  const [monthSaleMar, setMonthSaleMar] = useState("");
  const [monthSaleApr, setMonthSaleApr] = useState("");
  const [monthSaleMay, setMonthSaleMay] = useState("");
  const [monthSaleJun, setMonthSaleJun] = useState("");
  const [monthSaleJul, setMonthSaleJul] = useState("");
  const [monthSaleAug, setMonthSaleAug] = useState("");
  const [monthSaleSep, setMonthSaleSep] = useState("");
  const [monthSaleOct, setMonthSaleOct] = useState("");
  const [monthSaleNov, setMonthSaleNov] = useState("");
  const [monthSaleDic, setMonthSaleDic] = useState("");

  useEffect( ()=>{
    
      if( clientData._id){
        
        setBusinessName(clientData.business_data.business_name);
        setOwnOrRent( clientData.business_data.business_owned);
        setBisStartedDate(clientData.business_data.business_start_date);
        setBiStartedDateFormatted( formatDate( clientData.business_data.business_start_date));
        setBusinessPhone( clientData.business_data.business_phone);
        setRfc( clientData.rfc);
      }
  },[clientData]);

  const onSubmit = ()=>{
    const data ={
      business_name: businessName,
      business_phone: businessPhone,
      business_start_date: bisStartedDate,
      business_owned: bisOwnOrRent,
      rfc,
    }
    onNext(data);
  }

  return (
    <IonList className="ion-padding">
      <IonItem>
        <IonLabel position="stacked">Nombre de tu negocio</IonLabel>
        <IonInput
          type="text"
          value={businessName}
          onIonChange={(e) => setBusinessName(e.detail.value!)}
          onIonBlur={(e: any) => e.target.value ? setBusinessName(e.target.value.toUpperCase()): setBusinessNameError(true)}
          onIonFocus={()=> setBusinessNameError(false)}
          style={ businessNameError ? {border: "1px dotted red"}: {}}

        ></IonInput>
      </IonItem>
      <IonItem button={true} id="open-bis-start-date-input" >
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
            >
            
            </IonInput>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">RFC</IonLabel>
        <IonInput
          type="text"
          required
          value={rfc}
          onIonChange={(e) => setRfc(e.detail.value!)}
          onIonBlur={(e: any) => e.target.value ? setRfc(e.target.value.toUpperCase()): setRfcError(true)}
          onIonFocus={()=> setRfcError(false)}
          style={ rfcError ? {border: "1px dotted red"}: {}}

        ></IonInput>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Numero de empleados</IonLabel>
        <IonInput
          type="text"
          value={numberEmployees}
          onIonChange={(e) => setNumberEmployees(e.detail.value!)}
        ></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Destino del Crédito</IonLabel>
        <IonInput
          type="text"
          // value={econocmicDeps}
          // onIonChange={(e) => setEconomicDeps(e.detail.value!)}
        ></IonInput>
      </IonItem>
      <IonItemDivider><IonLabel>INGRESOS MENSUALES</IonLabel></IonItemDivider>
      <IonItem>
        <IonLabel position="stacked">Ventas totales</IonLabel><IonInput type="text"></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Aportaciones de su esposo, pareja, etc</IonLabel><IonInput type="text"></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Cuenta con otro trabajo</IonLabel><IonInput type="text"></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Envios de dinero (remesas)</IonLabel><IonInput type="text"></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Otros ingresos</IonLabel><IonInput type="text"></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Total ingresos</IonLabel><IonInput type="text"></IonInput>
      </IonItem>

      <IonItemDivider><IonLabel>GASTOS MENSUALES</IonLabel></IonItemDivider>
      <IonItem>
        <IonLabel position="stacked">Gastos Familiares (alimentos, ropa)</IonLabel><IonInput type="text"></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Renta</IonLabel><IonInput type="text"></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Gastos del negocio (mercansias, gas, transporte)</IonLabel><IonInput type="text"></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Cuentas por pagar (otros creditos)</IonLabel><IonInput type="text"></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Tarjetas de credito (tiendas comerciales)</IonLabel><IonInput type="text"></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Total Gastos</IonLabel><IonInput type="text"></IonInput>
      </IonItem>

      <IonItem>
        <IonLabel>Lleva control de ingresos y egresos?</IonLabel><IonCheckbox></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Experiencia en otros creditos?</IonLabel><IonCheckbox></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Indique cuales</IonLabel><IonInput type="text"></IonInput>
      </IonItem>

      <IonItem>
          <IonLabel position="stacked">Estacionalidad del negocio</IonLabel>
          <IonSelect
            // value={ownwerShipId}
            okText="Ok"
            cancelText="Cancelar"
            // onIonChange={(e) => setOwnerShipId(e.detail.value)}
            // style={ !ownwerShipId ? {border: "1px dotted red"}: {}}          
          >
            <IonSelectOption key={1} value='1'>Diaria</IonSelectOption>
            <IonSelectOption key={2} value='2'>Semanal</IonSelectOption>
            <IonSelectOption key={3} value='3'>Catorcenal</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItemDivider><IonLabel>Estacionalidad Anualizada</IonLabel></IonItemDivider>
            <IonGrid>
                <IonRow className="borde-claro">
                  <IonCol><IonInput placeholder="Ene" className="fuente-small" value={monthSaleJan} onIonChange={(e:any)=> setMonthSaleJan(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Feb" className="fuente-small" value={monthSaleFeb} onIonChange={(e:any)=> setMonthSaleFeb(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Mar" className="fuente-small" value={monthSaleMar} onIonChange={(e:any)=> setMonthSaleMar(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Abr" className="fuente-small" value={monthSaleApr} onIonChange={(e:any)=> setMonthSaleApr(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="May" className="fuente-small" value={monthSaleMay} onIonChange={(e:any)=> setMonthSaleMay(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Jun" className="fuente-small" value={monthSaleJun} onIonChange={(e:any)=> setMonthSaleJun(e.detail.value!)}></IonInput></IonCol>
                </IonRow>
                <IonRow>
                  <IonCol><IonInput placeholder="Jul" className="fuente-small" value={monthSaleJul} onIonChange={ (e:any)=> setMonthSaleJul(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Ago" className="fuente-small" value={monthSaleAug} onIonChange={ (e:any)=> setMonthSaleAug(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Sep" className="fuente-small" value={monthSaleSep} onIonChange={ (e:any)=> setMonthSaleSep(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Oct" className="fuente-small" value={monthSaleOct} onIonChange={ (e:any)=> setMonthSaleOct(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Nov" className="fuente-small" value={monthSaleNov} onIonChange={ (e:any)=> setMonthSaleNov(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Dic" className="fuente-small" value={monthSaleDic} onIonChange={ (e:any)=> setMonthSaleDic(e.detail.value!)}></IonInput></IonCol>
                </IonRow>
            </IonGrid>


      <p>
        { businessNameError && <i style={{color: "gray"}}>* Nombre o descripcion del negocio es un datos obligatorio<br/></i> }
        {! bisStartedDate && <i style={{color: "gray"}}>* Elige un mes/año cuando inicio su negocio<br/></i> }
        { businessPhoneError && <i style={{color: "gray"}}>* Un numero de telefono es obligatorio<br/></i> }
        { rfcError && <i style={{color: "gray"}}>* El RFC es obligatorio<br/></i> }
        { !numberEmployees && <i style={{color: "gray"}}>* Numero de empleados es un dato obligatorio, si no tiene ingrese 0<br/></i> }
      </p>
          <ButtonSlider 
            disabled={ businessNameError || !bisStartedDate || businessPhoneError || rfcError || !numberEmployees}
            onClick={onSubmit} 
            slideDirection={'F'} 
            color='medium' 
            expand="block" 
            label="Siguiente" />
          <ButtonSlider onClick={()=>{}} slideDirection={'B'} color="light" expand="block" label="Anterior" />

    </IonList>
  );
};
