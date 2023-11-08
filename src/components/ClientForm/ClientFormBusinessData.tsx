import {
  IonCheckbox,IonCol,IonDatetime,IonGrid,IonInput,IonItem,IonItemDivider,IonLabel,IonList,IonPopover,IonRow,IonSelect,IonSelectOption,IonText } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";
import { formatDate, formatLocalCurrency, formatLocalCurrencyV2 } from "../../utils/numberFormatter";
import { ButtonSlider } from "../SliderButtons";
import { db } from "../../db";

interface LoanDestInfo {
    id: number;
    description: string;
}

export const ClientFormBusinessData: React.FC<{ onNext:any }> = ({ onNext}) => {
  
  const [rfc, setRfc] = useState<string>("");
  const [rfcError, setRfcError] = useState<boolean>(false);

  const { clientData } = useContext(AppContext);  
  const [bisOwnOrRent, setOwnOrRent] = useState(false);

  const [businessName, setBusinessName] = useState<string>("");
  const [businessNameError, setBusinessNameError] = useState<boolean>(false);

  const [businessPhone, setBusinessPhone] = useState<string>("");
  const [businessPhoneError, setBusinessPhoneError] = useState<boolean>(false);

  const [bisStartedDate, setBisStartedDate] = useState("");
  const [bisStartedDateFormatted, setBiStartedDateFormatted] = useState("");

  const [numberEmployees, setNumberEmployees] = useState<string>("");
  const [loanDests, setLoanDest]  = useState<LoanDestInfo[]>([]);
  const [loanDestItem, setLoanDestItem]  = useState<number>(0);

  const [incomeSalesTotal, setIncomeSalesTotal] = useState<string>("0")
  const [incomePartner, setIncomePartner] = useState<string>("0")
  const [incomeJob, setIncomeJob] = useState<string>("0")
  const [incomeRemittances, setIncomeRemittances] = useState<string>("0")
  const [incomeOther, setIncomeOther] = useState<string>("0")
  const [incomeTotal, setIncomeTotal] = useState<string>("0")

  const [expenseFamily, setExpenseFamily] = useState<string>("0");
  const [expenseRent, setExpenseRent] = useState<string>("0");
  const [expenseBusiness, setExpenseBuisness] = useState<string>("0");
  const [expenseDebt, setExpenseDebt] = useState<string>("0");
  const [expenseCreditCards, setExpenseCreditCards] = useState<string>("0");
  const [expenseTotal, setExpenseTotal] = useState<string>("0");

  const [keepsAccountingRecords, setKeepsAccountinnRecords] = useState<boolean>(false);
  const [hasPreviousExperience, setHasPreviousExperience] = useState<boolean>(false);
  const [previousLoanExperience, setPreviousLoanExperience] = useState<string>("");
  const [bisSeasonType, setBisSeasonType] = useState<string>("");

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
        setNumberEmployees(clientData.business_data.number_employees);

        setIncomeSalesTotal( clientData.business_data.income_sales_total);
        setIncomePartner( clientData.business_data.income_partner);
        setIncomeJob(clientData.business_data.income_job);
        setIncomeRemittances(clientData.business_data.income_remittances);
        setIncomeOther(clientData.business_data.income_other);
        setIncomeTotal(clientData.business_data.income_total);
        setExpenseFamily(clientData.business_data.expense_family);
        setExpenseRent(clientData.business_data.expense_rent);
        setExpenseBuisness(clientData.business_data.expense_business);
        setExpenseDebt( clientData.business_data.expense_debt);
        setExpenseCreditCards(clientData.business_data.expense_credit_cards);
        setExpenseTotal( clientData.business_data.expense_total);
        setKeepsAccountinnRecords( clientData.business_data.keeps_accounting_records);
        setHasPreviousExperience( clientData.business_data.has_previous_experience);
        setPreviousLoanExperience( clientData.business_data.previous_loan_experience);
        setBisSeasonType( clientData.business_data.bis_season_type);
        setMonthSaleJan(clientData.business_data.bis_quality_sales_monthly.month_sale_jan);
        setMonthSaleFeb(clientData.business_data.bis_quality_sales_monthly.month_sale_feb);
        setMonthSaleMar(clientData.business_data.bis_quality_sales_monthly.month_sale_mar);
        setMonthSaleApr(clientData.business_data.bis_quality_sales_monthly.month_sale_apr);
        setMonthSaleMay(clientData.business_data.bis_quality_sales_monthly.month_sale_may);
        setMonthSaleJun(clientData.business_data.bis_quality_sales_monthly.month_sale_jun);
        setMonthSaleJul(clientData.business_data.bis_quality_sales_monthly.month_sale_jul);
        setMonthSaleAug(clientData.business_data.bis_quality_sales_monthly.month_sale_aug);
        setMonthSaleSep(clientData.business_data.bis_quality_sales_monthly.month_sale_sep);
        setMonthSaleOct(clientData.business_data.bis_quality_sales_monthly.month_sale_oct);
        setMonthSaleNov(clientData.business_data.bis_quality_sales_monthly.month_sale_nov);
        setMonthSaleDic(clientData.business_data.bis_quality_sales_monthly.month_sale_dic);

      }
  },[clientData]);

  useEffect( ()=>{
    async function LoadDestCatalog () {
      const query = await db.find({
          selector: {
          couchdb_type: "CATALOG",
          name: "CATA_destinoCredito"
          }
      });
     
      const newData = query.docs.map( (i:any) => ({ id: i.id, description: i.descripcion }))
      setLoanDest(newData);
    }
    LoadDestCatalog();
  },[])

  const onSubmit = ()=>{
    const data ={
      business_name: businessName,
      business_phone: businessPhone,
      business_start_date: bisStartedDate,
      business_owned: bisOwnOrRent,
      rfc,
      number_employees: numberEmployees,
      loan_destination: loanDestItem ? 
                        [loanDestItem, loanDests.find( (i:LoanDestInfo) => i.id === loanDestItem)?.description] : 
                        [0,''],
      income_sales_total: formatLocalCurrency(parseFloat(incomeSalesTotal)),
      income_partner: formatLocalCurrency(parseFloat(incomePartner)),
      income_job: formatLocalCurrency(parseFloat(incomeJob)),
      income_remittances: formatLocalCurrency(parseFloat(incomeRemittances)),
      income_other: formatLocalCurrency(parseFloat(incomeOther)),
      income_total: incomeTotal,
      expense_family: formatLocalCurrency(parseFloat(expenseFamily)),
      expense_rent: formatLocalCurrency(parseFloat(expenseRent)),
      expense_business: formatLocalCurrency(parseFloat(expenseBusiness)),
      expense_debt: formatLocalCurrency(parseFloat(expenseDebt)),
      expense_credit_cards: formatLocalCurrency(parseFloat(expenseCreditCards)),
      expense_total: expenseTotal,
      keeps_accounting_records: keepsAccountingRecords,
      has_previous_experience: hasPreviousExperience,
      previous_loan_experience: previousLoanExperience,
      bis_season_type: bisSeasonType,
      bis_quality_sales_monthly: {
        month_sale_jan: monthSaleJan,
        month_sale_feb: monthSaleFeb,
        month_sale_mar: monthSaleMar,
        month_sale_apr: monthSaleApr,
        month_sale_may: monthSaleMay,
        month_sale_jun: monthSaleJun,
        month_sale_jul: monthSaleJul,
        month_sale_aug: monthSaleAug,
        month_sale_sep: monthSaleSep,
        month_sale_oct: monthSaleOct,
        month_sale_nov: monthSaleNov,
        month_sale_dic: monthSaleDic,
      }
    }
    onNext(data);
  }

  function updateIncomeTotals() {
      let total = 0;
      total = parseFloat(incomeJob) + parseFloat(incomeOther) + parseFloat(incomePartner) + parseFloat(incomeRemittances) + parseFloat(incomeSalesTotal);
      setIncomeTotal(formatLocalCurrency(total) );
  }
  function updateExpenseTotals () {
    let total = 0;
    total = parseFloat(expenseBusiness) + parseFloat(expenseCreditCards) + parseFloat(expenseDebt)+ parseFloat(expenseFamily) + parseFloat(expenseRent);
    setExpenseTotal(formatLocalCurrency(total));
  }
  useEffect( ()=> {
    if( clientData._id && loanDests.length ){
          setLoanDestItem( clientData.business_data.loan_destination[0]);
    }
    },[loanDests])

    useEffect(()=>{
      updateIncomeTotals();
    },[incomeJob,incomeOther,incomePartner,incomeRemittances,incomeSalesTotal]);

    useEffect(()=>{
      updateExpenseTotals();
    },[expenseBusiness,expenseCreditCards, expenseDebt,expenseFamily,expenseRent])

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
        <IonSelect okText="Ok" cancelText="Cancelar" value={loanDestItem} onIonChange={(e) => setLoanDestItem(e.detail.value)}>
          { loanDests.map(( dest: LoanDestInfo) => (
            <IonSelectOption key={dest.id} value={dest.id}>{dest.description}</IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
      <IonItemDivider><IonLabel>INGRESOS MENSUALES</IonLabel></IonItemDivider>
      <IonItem>
        <IonLabel position="stacked">Ventas totales</IonLabel><IonInput type="text" value={incomeSalesTotal} onIonChange={(e)=>setIncomeSalesTotal(e.detail.value!)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Aportaciones de su esposo, pareja, etc</IonLabel><IonInput type="text" value={incomePartner} onIonChange={(e)=>setIncomePartner(e.detail.value!)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Cuenta con otro trabajo</IonLabel><IonInput type="text" value={incomeJob} onIonChange={(e)=>setIncomeJob(e.detail.value!)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Envios de dinero (remesas)</IonLabel><IonInput type="text" value={incomeRemittances} onIonChange={(e)=>setIncomeRemittances(e.detail.value!)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Otros ingresos</IonLabel><IonInput type="text" value={incomeOther} onIonChange={(e)=>setIncomeOther(e.detail.value!)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Total ingresos</IonLabel><IonInput type="text" value={incomeTotal} onIonChange={(e)=>setIncomeTotal(e.detail.value!)}></IonInput>
      </IonItem>

      <IonItemDivider><IonLabel>GASTOS MENSUALES</IonLabel></IonItemDivider>
      <IonItem>
        <IonLabel position="stacked">Gastos Familiares (alimentos, ropa)</IonLabel><IonInput type="text" value={expenseFamily} onIonChange={(e)=>setExpenseFamily(e.detail.value!)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Renta</IonLabel><IonInput type="text" value={expenseRent} onIonChange={(e)=>setExpenseRent(e.detail.value!)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Gastos del negocio (mercansias, gas, transporte)</IonLabel><IonInput type="text" value={expenseBusiness} onIonChange={(e)=>setExpenseBuisness(e.detail.value!)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Cuentas por pagar (otros creditos)</IonLabel><IonInput type="text" value={expenseDebt} onIonChange={(e)=>setExpenseDebt(e.detail.value!)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Tarjetas de credito (tiendas comerciales)</IonLabel><IonInput type="text" value={expenseCreditCards} onIonChange={(e)=>setExpenseCreditCards(e.detail.value!)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Total Gastos</IonLabel><IonInput type="text" value={expenseTotal} onIonChange={(e)=>setExpenseTotal(e.detail.value!)}></IonInput>
      </IonItem>

      <IonItem>
        <IonLabel>Lleva control de ingresos y egresos?</IonLabel><IonCheckbox checked={keepsAccountingRecords} onIonChange={ (e)=> setKeepsAccountinnRecords(e.detail.checked)}></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel>Experiencia en otros creditos?</IonLabel><IonCheckbox checked={hasPreviousExperience} onIonChange={ (e)=> setHasPreviousExperience(e.detail.checked)}></IonCheckbox>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Indique cuales</IonLabel><IonInput type="text" value={previousLoanExperience} onIonChange={(e)=> setPreviousLoanExperience(e.detail.value!)}></IonInput>
      </IonItem>

      <IonItem>
          <IonLabel position="stacked">Estacionalidad del negocio</IonLabel>
          <IonSelect
            value={bisSeasonType}
            okText="Ok"
            cancelText="Cancelar"
            onIonChange={(e) => setBisSeasonType(e.detail.value)}
            style={ !bisSeasonType ? {border: "1px dotted red"}: {}}          
          >
            <IonSelectOption key={1} value='D'>Diaria</IonSelectOption>
            <IonSelectOption key={2} value='S'>Semanal</IonSelectOption>
            <IonSelectOption key={3} value='C'>Catorcenal</IonSelectOption>
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
        { !loanDestItem && <i style={{color: "gray"}}>* El destino del credito es obligatorio<br/></i> }
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
