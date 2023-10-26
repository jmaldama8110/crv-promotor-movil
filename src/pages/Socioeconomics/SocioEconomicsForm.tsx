import {IonBackButton,IonButton,IonButtons,IonCol,IonContent,IonGrid,IonHeader,IonInput,IonItem,IonItemDivider,IonItemGroup,IonLabel,IonPage,IonRow,IonSegment,IonSegmentButton,IonSelect,IonSelectOption,IonTextarea,IonTitle,IonToolbar, useIonLoading,} from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { getRound } from "../../utils/math";
import { db } from "../../db";

import { formatLocalCurrency } from "../../utils/numberFormatter";
import { useDBSync } from "../../hooks/useDBSync";

interface SocioEconomicData {
  id: number;
  amount: string;
  creditor?: string;
  balance?: string;
  destiny?: string;
  description: string;
  note?: string;
  group_type: string;
}

interface SalesInventoryData {
  id: number;
  description: string;
  unit: string;
  quantity: string;
  price: string;
  subtotal: string;
}


export const SocioEconomicsForm: React.FC<RouteComponentProps> = ({history,match}) => {
  const [currSegment, setSegment] = useState<string>("familiar");  

  /// ingresos familiares
  const [familyIncome, setFamilyIncome] = useState<SocioEconomicData[]>([]);
  const [familyIncomeType, setFamiliIncomeType] = useState("");
  const [amountIncome, setAmountIncome] = useState("");
  const [totalFamilyIncome, setTotalFamilyIncome] = useState("");

  // gastos familiares
  const [familyExp, setFamilyExp] = useState<SocioEconomicData[]>([]);
  const [familyExpType, setFamiliExpType] = useState("");
  const [amountExp, setAmountExp] = useState("");
  const [totalFamilyExp, setTotalFamilyExp] = useState("");
  
  // bienes del hogar
  const [familyGoods, setFamilyGoods] = useState<SocioEconomicData[]>([]);
  const [familyGoodsType, setFamiliGoodsType] = useState("");
  const [amountGoods, setAmountGoods] = useState("");
  const [totalFamilyGoods, setTotalFamilyGoods] = useState("");

  /// deudas familiares
  const [debts, setDebts] = useState<SocioEconomicData[]>([]);
  const [debtBalance, setDebtBalance] = useState('');
  const [debtPayment, setDebtPayment] = useState('');
  const [debtCreditor, setDebtCreditor] = useState('');
  const [debtDestiny, setDebtDestiny] = useState('');

  /// Disponibilidades del negocio
  const [bisCashFlow, setBisCashFlow] = useState<SocioEconomicData[]>([]);
  const [bisCashFlowType, setBisCashFlowType] = useState("");
  const [amountBisCashFlow, setAmountBisCashFlow] = useState("");
  const [totalBisCashFlow, setTotalBisCashFlow] = useState("");

  // Cuentas por cobrar del negocio
  const [bisAccountsReceive, setBisAccountsReceive] = useState<SocioEconomicData[]>([]);
  const [bisAccountsReceiveAcc, setBisAccountsReceiveAcc] = useState("");
  const [bisAccountsReceiveAmt, setBisAccountsReceiveAmt] = useState("");
  const [bisAccountsReceiveCli, setBisAccountsReceiveCli] = useState("");
  const [bisAccountsReceiveNote, setBisAccountsReceiveNote] = useState("");
  const [totalBisAccountsReceive, setTotalBisAccountsReceive] = useState("");

  /// Bienes del negocio
  const [bisGoods, setBisGoods] = useState<SocioEconomicData[]>([]);
  const [bisGoodsType, setBisGoodsType] = useState("");
  const [amountBisGoods, setAmountBisGoods] = useState("");
  const [totalBisGoods, setTotalBisGoods] = useState("");

  /// Deudas por pagar del negocio
  const [bisDebts, setBisDebts] = useState<SocioEconomicData[]>([]);
  const [bisDebtBalance, setBisDebtBalance] = useState('');
  const [bisDebtPayment, setBisDebtPayment] = useState('');
  const [bisDebtCreditor, setBisDebtCreditor] = useState('');
  const [bisDebtDestiny, setBisDebtDestiny] = useState('');

  /// Ventas Diarias
  const [weekDayMon, setWeekDayMon] = useState("");
  const [weekDayTue, setWeekDayTue] = useState("");
  const [weekDayWed, setWeekDayWed] = useState("");
  const [weekDayThu, setWeekDayThu] = useState("");
  const [weekDayFri, setWeekDayFri] = useState("");
  const [weekDaySat, setWeekDaySat] = useState("");
  const [weekDaySun, setWeekDaySun] = useState("");

  // Ventas semanales
  const [saleWeekOne, setSaleWeekOne] = useState("");
  const [saleWeekTwo, setSaleWeekTwo] = useState("");
  const [saleWeekThree, setSaleWeekThree] = useState("");
  const [saleWeekFour, setSaleWeekFour] = useState("");
  
  /// Ventas Quincenales
  const [saleQuincenaOne, setSaleQuincenaOne] = useState("");
  const [saleQuincenaTwo, setSaleQuincenaTwo] = useState("");
  /// Ventas Mensuales
  const [saleMonthly, setSaleMonthly] = useState("");

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

  /// Rubros mas vendidos
  const [bisSales, setBisSales] = useState<SalesInventoryData[]>([]);
  const [bisSalesDescription, setBisSalesDescription] = useState("");
  const [bisSalesUnit, setBisSalesUnit] = useState("");
  const [bisSalesPrice, setBisSalesPrice] = useState("");
  const [bisSalesQuantity, setBisSalesQuantity] = useState("");
  
  /// Ventas mensuales de Contado
  const [bisSalesMonthCash, setBisSalesMonthCash] = useState("");
  // Ventas mensuales a crédito
  const [bisSalesMonthCredit, setBisSalesMonthCredit] = useState("");
  /// Comentarios sobre las ventas
  const [bisSalesComments, setBisSalesComments] = useState("");

  // Compras mensuales del negocio
  const [bisPurchase, setBisPurchase] = useState<SalesInventoryData[]>([]);
  const [bisPurchaseDescription, setBisPurchaseDescription] = useState("");
  const [bisPurchaseUnit, setBisPurchaseUnit] = useState("");
  const [bisPurchasePrice, setBisPurchasePrice] = useState("");
  const [bisPurchaseQuantity, setBisPurchaseQuantity] = useState("");

  /// Factor Margen de Utilidad Bruta
  const [mubPercent, setMubPercent] = useState("");
  /// Importe margen utilidad bruta
  const [mubAmount, setMubAmount] = useState("");

  //// Resumen de ventas por fuente
  const [salesDayly, setSalesDayly] = useState("0.00");
  const [salesMonthly, setSalesMonthly]  = useState("0.00");
  const [salesWeekly, setSalesWeekly]  = useState("0.00");
  const [salesQuincenly, setSalesQuincenly] = useState("0.00");
  const [salesPurchased, setSalesPurchased] = useState("0.00");
  const [salesCash, setSalesCash] = useState("0.00");
  /// promedio ventas por fuente
  const [salesAverage, setSalesAverage] = useState("0.00");
  // Comentarios sobre ventas del negocio
  const [salesComments, setSalesComments] = useState("");
  // Importe seleccionado
  const [salesSelectedData, setSalesSelectedData]  = useState("0.00");

  /// Gastos del Negocio
  const [bisExpense, setBisExpense] = useState<SocioEconomicData[]>([]);
  const [bisExpenseType, setBisExpenseType] = useState("");
  const [amountBisExpense, setAmountBisExpense] = useState("");
  const [totalBisExpense, setTotalBisExpense] = useState("");

  // Analisis de Mercancias
  const [bisInventory, setBisInventory] = useState<SalesInventoryData[]>([]);
  const [bisInventoryDescription, setBisInventoryDescription] = useState("");
  const [bisInventoryUnit, setBisInventoryUnit] = useState("");
  const [bisInventoryPrice, setBisInventoryPrice] = useState("");
  const [bisInventoryQuantity, setBisInventoryQuantity] = useState("");

  const [ addEdit, setAddEdit] = useState<boolean>(false); // TRUE = Adding, FALSE = Edit socioeconomic record
  const { couchDBSyncUpload } = useDBSync();

  const [itemId, setItemId] = useState('');

  useEffect(() => {
    const clientId = match.url.replace("/clients/socioeconomics/edit/", ""); 
    db.get(clientId)
      .then((clientData:any) => {
        setItemId(clientId);
        /// search for a Socioeconomic record for this client
        if( !clientData.socioeconomic_id ){
          setAddEdit(true);
          console.log('Not socioeconimic found, therefore, create One')
          // tells we are in adding mode (since the socioeconomic field was not found)
        } else {
          // Socio economic Id found at Client, thus fetch it!
          db.get(clientData.socioeconomic_id).then( (data:any) =>{
            setFamilyIncome(data.family_income);
            setFamilyExp(data.family_expense);
            setFamilyGoods(data.family_goods);
            setDebts(data.family_debts);
            
            setBisCashFlow(data.bis_cash_flow);
            setBisAccountsReceive(data.bis_accounts_receive);
            setBisGoods( data.bis_goods);
            setBisDebts( data.bis_debts);
            
            setWeekDayMon(data.sales_daily[0].weekDayMon);
            setWeekDayTue(data.sales_daily[0].weekDayTue);
            setWeekDayWed(data.sales_daily[0].weekDayWed);
            setWeekDayThu(data.sales_daily[0].weekDayThu);
            setWeekDayFri(data.sales_daily[0].weekDayFri);
            setWeekDaySat(data.sales_daily[0].weekDaySat);
            setWeekDaySun(data.sales_daily[0].weekDaySun);

            setSaleWeekOne(data.sales_weekly[0].saleWeekOne);
            setSaleWeekTwo(data.sales_weekly[0].saleWeekTwo);
            setSaleWeekThree(data.sales_weekly[0].saleWeekThree);
            setSaleWeekFour(data.sales_weekly[0].saleWeekFour);

            setSaleQuincenaOne( data.sales_quicenal[0].saleQuincenaOne);
            setSaleQuincenaTwo(data.sales_quicenal[0].saleQuincenaTwo);
            
            setMonthSaleJan( data.seasonly[0].monthSaleJan);
            setMonthSaleFeb( data.seasonly[0].monthSaleFeb);
            setMonthSaleMar( data.seasonly[0].monthSaleMar);
            setMonthSaleApr( data.seasonly[0].monthSaleApr);
            setMonthSaleMay( data.seasonly[0].monthSaleMay);
            setMonthSaleJun( data.seasonly[0].monthSaleJun);
            setMonthSaleJul( data.seasonly[0].monthSaleJul);
            setMonthSaleAug( data.seasonly[0].monthSaleAug);
            setMonthSaleSep( data.seasonly[0].monthSaleSep);
            setMonthSaleOct( data.seasonly[0].monthSaleOct);
            setMonthSaleNov( data.seasonly[0].monthSaleNov);
            setMonthSaleDic( data.seasonly[0].monthSaleDic);

            setSaleMonthly( data.sales_monthly);

            setBisSales( data.bis_sales);

            setBisSalesMonthCash(data.bis_sales_in_cash);
            setBisSalesMonthCredit(data.bis_sales_in_credit);
            setBisSalesComments( data.bis_sales_comment);

            setBisPurchase( data.bis_purchase);
            
            setMubPercent( data.mub_percentage);
            setMubAmount( data.mub_amount);

            setSalesDayly( data.summary_sales_source[0].salesDayly);
            setSalesWeekly( data.summary_sales_source[0].salesWeekly);
            setSalesQuincenly( data.summary_sales_source[0].salesQuincenly);
            setSalesMonthly( data.summary_sales_source[0].salesMonthly);
            setSalesPurchased( data.summary_sales_source[0].salesPurchased);
            setSalesCash( data.summary_sales_source[0].salesCash);
            
            setSalesAverage( data.sales_avg);
            setSalesComments( data.salesComments);
            setSalesSelectedData( data.sales_selected_data);

            setBisExpense( data.bis_expense);
            setBisInventory( data.bis_inventory);

          })
        }
      })
      .catch((err) => {
        alert("No fue posible recuperar el cliente: " + itemId);
      });
  }, []);


  const onSave = async () =>{
    const data = {
      family_income: [...familyIncome],
      family_expense: [...familyExp],
      family_goods: [...familyGoods],
      family_debts: [...debts],
      
      bis_cash_flow: [...bisCashFlow],
      bis_accounts_receive:[...bisAccountsReceive],
      bis_goods: [...bisGoods],
      bis_debts: [...bisDebts],
    
      sales_daily: [{ weekDayMon, weekDayTue, weekDayWed, weekDayThu, weekDayFri, weekDaySat,weekDaySun}],
      sales_weekly:[ { saleWeekOne, saleWeekTwo, saleWeekThree, saleWeekFour } ],
      sales_quicenal:[ {saleQuincenaOne, saleQuincenaTwo}],
      sales_monthly:saleMonthly,
      seasonly:[{ monthSaleJan, monthSaleFeb,monthSaleMar, monthSaleApr, monthSaleMay, monthSaleJun, 
                  monthSaleJul, monthSaleAug, monthSaleSep, monthSaleOct, monthSaleNov, monthSaleDic }],
      bis_sales: [...bisSales],
      bis_sales_in_cash: bisSalesMonthCash,
      bis_sales_in_credit: bisSalesMonthCredit ,
      bis_sales_comment: bisSalesComments,
    
      bis_purchase: [...bisPurchase],
      mub_percentage: mubAmount,
      mub_amount: mubAmount,
    
      summary_sales_source: [{salesDayly,salesWeekly,salesQuincenly, salesMonthly,salesPurchased,salesCash}],
      sales_avg: salesAverage,
      sales_selected_data: salesSelectedData,
      sales_comments: salesComments,
      
      bis_expense:[...bisExpense],
      bis_inventory:[...bisInventory],    
    }
  
    if( addEdit ) { // New Record AddEdit = TRUE,
        const newId = Date.now().toString();
        /// Save As New record
        db.put({
          couchdb_type: 'SOCIOECONOMIC',
          _id: newId,
          client_id: itemId,
          ...data
        }).then( ()=>{
          // updates the client records with the socioneconomic id
          db.get(itemId).then( (clientData) =>{            
            return db.put({
              ...clientData,
              socioeconomic_id: newId
            }).then( async ()=>{
              await couchDBSyncUpload();
              history.goBack();

            })
          })
          

        }).catch( e =>{
          alert('No se pudo guardar el dato del cliente')
        })

    } else {
      const itemId = match.url.replace("/clients/socioeconomics/edit/", "");
      db.get(itemId).then( (clientInfo:any) => {
        db.get( clientInfo.socioeconomic_id ).then( (socioeconomicInfo: any)=>{
          return db.put({
            ...socioeconomicInfo,
            ...data
          }).then( async ()=>{
            await couchDBSyncUpload();
            history.goBack();
          })
        })

      })
  
    }
    
  }



  function onAddRowFamilyIncome(e: any) {
    const newData = { id: familyIncome.length, amount: amountIncome, description: familyIncomeType,group_type: "family_income",};
    setAmountIncome('')
    setFamilyIncome([...familyIncome, newData]);
  }

  function onAddRowFamilyExp(e: any) {
    const newData = { id: familyExp.length, amount: amountExp, description: familyExpType,group_type: "family_expense",};
    setAmountExp('')
    setFamilyExp([...familyExp, newData]);
  }
  function onAddRowFamilyGoods(e: any) {
    const newData = { id: familyGoods.length, amount: amountGoods, description: familyGoodsType,group_type: "family_goods",};
    setAmountGoods('')
    setFamilyGoods([...familyGoods, newData]);
  }
  function onAddDebtItem(e: any) {
    const newData: SocioEconomicData = { id: debts.length, amount: debtPayment, creditor: debtCreditor,group_type: "family_debts", balance: debtBalance, destiny: debtDestiny ,description:''};
    setDebtBalance('');
    setDebtCreditor('');
    setDebtDestiny('');
    setDebtPayment('');
    setDebts([...debts, newData]);
  }
  function onAddBisCashFlow(e: any) {
    const newData = { id: bisCashFlow.length, amount: amountBisCashFlow, description: bisCashFlowType,group_type: "business_cashflow",};
    setAmountBisCashFlow('')
    setBisCashFlow([...bisCashFlow, newData]);
  }
  function onAddBisAccReceive (){
    const newData = {
      id: bisAccountsReceive.length, 
      creditor:bisAccountsReceiveAcc,
      amount: bisAccountsReceiveAmt,
      balance: bisAccountsReceiveCli,
      note: bisAccountsReceiveNote,
      description:'',
      group_type: "business_acc_receivables",
    };
    setBisAccountsReceiveAcc('')
    setBisAccountsReceiveAmt('');
    setBisAccountsReceiveCli('');
    setBisAccountsReceiveNote('');
    setBisAccountsReceive([...bisAccountsReceive, newData]);
  }
  function onAddBisGoods(e: any) {
    const newData = { id: bisGoods.length, amount: amountBisGoods, description: bisGoodsType,group_type: "business_goods",};
    setAmountBisGoods('')
    setBisGoods([...bisGoods, newData]);
  }
  function onAddBisDebt(e: any) {
    const newData: SocioEconomicData = { id: bisDebts.length, amount: bisDebtPayment, creditor: bisDebtCreditor,group_type: "business_debts", balance: bisDebtBalance, destiny: bisDebtDestiny ,description:''};
    setBisDebtBalance('');
    setBisDebtCreditor('');
    setBisDebtDestiny('');
    setBisDebtPayment('');
    setBisDebts([...bisDebts, newData]);
  }

  function onAddBisSaleItem(e:any) {
    const subtotal = getRound(parseFloat(bisSalesPrice) * parseFloat(bisSalesQuantity),100).toString();
    const newData:SalesInventoryData = { id: bisSales.length, description: bisSalesDescription, unit: bisSalesUnit, quantity: bisSalesQuantity, price: bisSalesPrice, subtotal}
    setBisSalesDescription("");
    setBisSalesPrice("");
    setBisSalesQuantity("");
    setBisSalesUnit("");
    setBisSales( [...bisSales, newData]);
  }
  function onAddBisPurchaseItem(e:any) {
    const subtotal = getRound(parseFloat(bisPurchasePrice) * parseFloat(bisPurchaseQuantity),100).toString();
    const newData:SalesInventoryData = { id: bisPurchase.length, description: bisPurchaseDescription, unit: bisPurchaseUnit, quantity: bisPurchaseQuantity, price: bisPurchasePrice, subtotal}
    setBisPurchaseDescription("");
    setBisPurchasePrice("");
    setBisPurchaseQuantity("");
    setBisPurchaseUnit("");
    setBisPurchase( [...bisPurchase, newData]);
  }

  function onAddBisExpenseItem(e: any) {
    const newData = { id: bisExpense.length, amount: amountBisExpense, description: bisExpenseType,group_type: "business_expense",};
    setAmountBisExpense('')
    setBisExpense([...bisExpense, newData]);
  }
  function onAddBisInventoryItem(e:any) {
    const subtotal = getRound(parseFloat(bisInventoryPrice) * parseFloat(bisInventoryQuantity),100).toString();
    const newData:SalesInventoryData = { id: bisInventory.length, description: bisInventoryDescription, unit: bisInventoryUnit, quantity: bisInventoryQuantity, price: bisInventoryPrice, subtotal}
    setBisInventoryDescription("");
    setBisInventoryPrice("");
    setBisInventoryQuantity("");
    setBisInventoryUnit("");
    setBisInventory( [...bisInventory, newData]);
  }

  const onAmountIncomeChange = (e:any) =>{
    const importe = e.detail.value;    
    const importeRE = new RegExp(process.env.REACT_APP_MONEY_ENTRY_REGEX!)

    if( importe.match(importeRE) || !importe ){
      setAmountIncome( importe );
    } else{
      e.target.value = ''
    }
  }

  const onAmountExpChange = (e:any) =>{
    const importe = e.detail.value;    
    const importeRE = new RegExp(process.env.REACT_APP_MONEY_ENTRY_REGEX!)
    
    if( importe.match(importeRE) || !importe ){
      setAmountExp( importe );
    } else{
      e.target.value = ''
    }
  }
  const onAmountGoodsChange = (e:any) =>{
    const importe = e.detail.value;    
    const importeRE = new RegExp(process.env.REACT_APP_MONEY_ENTRY_REGEX!)
    
    if( importe.match(importeRE) || !importe ){
      setAmountGoods( importe );
    } else{
      e.target.value = ''
    }
  }
  const onAmountBisCashFlowChange = (e:any) =>{
    const importe = e.detail.value;    
    const importeRE = new RegExp(process.env.REACT_APP_MONEY_ENTRY_REGEX!)

    if( importe.match(importeRE) || !importe ){
      setAmountBisCashFlow( importe );
    } else{
      e.target.value = ''
    }
  }
  const onAmountBisGoodsChange = (e:any) =>{
    const importe = e.detail.value;    
    const importeRE = new RegExp(process.env.REACT_APP_MONEY_ENTRY_REGEX!)

    if( importe.match(importeRE) || !importe ){
      setAmountBisGoods( importe );
    } else{
      e.target.value = ''
    }
  }
  const onAmountBisExpenseChange = (e:any) =>{
    const importe = e.detail.value;    
    const importeRE = new RegExp(process.env.REACT_APP_MONEY_ENTRY_REGEX!)

    if( importe.match(importeRE) || !importe ){
      setAmountBisExpense( importe );
    } else{
      e.target.value = ''
    }
  }

  function onRemoveIncome(e:any) {
    const idItem = e.target.id.replace('famincome-','');
    const newData = familyIncome.filter( (i:SocioEconomicData)=> i.id != idItem);
    setFamilyIncome([...newData]);
  }
  function onRemoveExp(e:any) {
    const idItem = e.target.id.replace('famexpense-','');
    const newData = familyExp.filter( (i:SocioEconomicData)=> i.id != idItem);
    setFamilyExp([...newData]);
  }
  function onRemoveGoods(e:any) {
    const idItem = e.target.id.replace('famgoods-','');
    const newData = familyGoods.filter( (i:SocioEconomicData)=> i.id != idItem);
    setFamilyGoods([...newData]);
  }
  function onRemoveDebtItem(e:any) {
    const idItem = e.target.id.replace('famdebts-','');
    const newData = debts.filter( (i:SocioEconomicData)=> i.id != idItem);
    setDebts([...newData]);
  }
  function onRemoveBisCashFlowItem(e:any) {
    const idItem = e.target.id.replace('biscashflow-','');
    const newData = bisCashFlow.filter( (i:SocioEconomicData)=> i.id != idItem);
    setBisCashFlow([...newData]);
  }
  function onRemoveBisAccReceive(e:any){
    const idItem = e.target.id.replace('bisaccreceive-','');
    const newData = bisAccountsReceive.filter( (i:SocioEconomicData)=> i.id != idItem);
    setBisAccountsReceive([...newData]);
  }
  function onRemoveBisGoods(e:any){
    const idItem = e.target.id.replace('bisgoods-','');
    const newData = bisGoods.filter( (i:SocioEconomicData)=> i.id != idItem);
    setBisGoods([...newData]);
  }
  function onRemoveBisDebt(e:any) {
    const idItem = e.target.id.replace('bisdebts-','');
    const newData = bisDebts.filter( (i:SocioEconomicData)=> i.id != idItem);
    setBisDebts([...newData]);
  }
  function onRemoveBisSalesItem(e:any) {
    const idItem = e.target.id.replace('bissales-','');
    const newData = bisSales.filter( (i:SalesInventoryData)=> i.id != idItem);
    setBisSales([...newData]);
  }
  function onRemoveBisPurchaseItem(e:any) {
    const idItem = e.target.id.replace('bispurchase-','');
    const newData = bisPurchase.filter( (i:SalesInventoryData)=> i.id != idItem);
    setBisPurchase([...newData]);
  }
  function onRemoveBisExpenseItem(e:any) {
    const idItem = e.target.id.replace('bisexpense-','');
    const newData = bisExpense.filter( (i:SocioEconomicData)=> i.id != idItem);
    setBisExpense([...newData]);
  }
  function onRemoveBisInventoryItem(e:any) {
    const idItem = e.target.id.replace('bisinventory-','');
    const newData = bisInventory.filter( (i:SalesInventoryData)=> i.id != idItem);
    setBisInventory([...newData]);
  }

  function updateTotal(data: SocioEconomicData[]){
    let sum = 0;
    for(let i=0; i < data.length; i++)
        sum = sum + parseFloat(data[i].amount);
    return sum;
  }

  useEffect( ()=>{
      setTotalFamilyIncome( formatLocalCurrency(updateTotal(familyIncome)) ) },[familyIncome]);

  useEffect( ()=>{
    setTotalFamilyExp( formatLocalCurrency(updateTotal(familyExp)) ) },[familyExp])

  useEffect( ()=>{
    setTotalFamilyGoods( formatLocalCurrency(updateTotal(familyGoods)) ) },[familyGoods])
  useEffect( ()=>{
    setTotalBisCashFlow( formatLocalCurrency(updateTotal(bisCashFlow)) ) },[bisCashFlow]);
  
  useEffect( ()=>{
    setTotalBisGoods( formatLocalCurrency(updateTotal(bisGoods)) ) },[bisGoods]);
  useEffect( ()=>{
      setTotalBisGoods( formatLocalCurrency(updateTotal(bisGoods)) ) },[bisGoods]);
 useEffect( ()=>{
      setTotalBisExpense( formatLocalCurrency(updateTotal(bisExpense)) ) },[bisExpense]);
  
  return (
    <IonPage>
    <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonBackButton defaultHref="/clients" />
        </IonButtons>
        <IonTitle>{ addEdit ? 'Estudio SE (Nuevo)': 'Estudio SE (Editar)'}</IonTitle>
        </IonToolbar>
  </IonHeader>
  <IonContent>
        <IonSegment
          value={currSegment}
          onIonChange={(e) => setSegment(e.detail.value!)}
        >
          <IonSegmentButton value="familiar"><IonLabel>Familia</IonLabel></IonSegmentButton>
          <IonSegmentButton value="negocio"><IonLabel>Negocio</IonLabel></IonSegmentButton>
          <IonSegmentButton value="ventas"><IonLabel>Ventas</IonLabel></IonSegmentButton>
          <IonSegmentButton value="compras"><IonLabel>Compras</IonLabel></IonSegmentButton>
          <IonSegmentButton value="gastos"><IonLabel>Gastos</IonLabel></IonSegmentButton>
        </IonSegment>
        {currSegment === "familiar" && (
          <div className="ion-padding">

            {/* Income **/}
            <IonItem>
              <IonLabel>Ingresos Familiares</IonLabel>
              <IonSelect
                value={familyIncomeType}
                onIonChange={(e: any) => setFamiliIncomeType(e.target.value)}
              >
                <IonSelectOption value="Conyugue">Conyugue</IonSelectOption>
                <IonSelectOption value="Pensiones">Pensiones</IonSelectOption>
                <IonSelectOption value="Empleo">Empleo</IonSelectOption>
                <IonSelectOption value="Giros(o remesas)">Giros o Remesas</IonSelectOption>
                <IonSelectOption value="Rentas">Rentas</IonSelectOption>
                <IonSelectOption value="Hijos">Hijos</IonSelectOption>
                <IonSelectOption value="Otros">Otros</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput placeholder="Cantidad $" value={amountIncome} onIonChange={onAmountIncomeChange}></IonInput>
              <IonButton onClick={onAddRowFamilyIncome}>+</IonButton>
            </IonItem>

            <IonGrid>
              {familyIncome.map((i: SocioEconomicData, n: number) => (
                <IonRow key={n}>
                  <IonCol size='5'><IonLabel>{i.description}</IonLabel></IonCol>
                  <IonCol><IonLabel>{formatLocalCurrency(parseFloat(i.amount))}</IonLabel></IonCol>
                  <IonCol><IonButton className='boton-peque' color='medium' id={`famincome-${n}`} onClick={onRemoveIncome}>Quitar</IonButton></IonCol>
                </IonRow>
              ))}
            </IonGrid>
            <div className="line"></div>
            
            <IonGrid>
              <IonRow>
                <IonCol size='6'><IonLabel>Total:</IonLabel></IonCol>
                <IonCol>{totalFamilyIncome}</IonCol>
                <IonCol></IonCol>
              </IonRow>
            </IonGrid>
              
            {/* Expenses **/}
            <IonItem>
              <IonLabel>Gastos Familiares</IonLabel>
              <IonSelect
                value={familyExpType}
                onIonChange={(e: any) => setFamiliExpType(e.target.value)}
              >
                <IonSelectOption value="Alimentacion">Alimentacion</IonSelectOption>
                <IonSelectOption value="Renta">Renta</IonSelectOption>
                <IonSelectOption value="Luz">Luz</IonSelectOption>
                <IonSelectOption value="Agua">Agua</IonSelectOption>
                <IonSelectOption value="Telefono">Telefono</IonSelectOption>
                <IonSelectOption value="Educacion">Educacion</IonSelectOption>
                <IonSelectOption value="Transporte">Transporte</IonSelectOption>
                <IonSelectOption value="Salud">Salud</IonSelectOption>
                <IonSelectOption value="Entretenimiento">Entretenimiento</IonSelectOption>
                <IonSelectOption value="Otros">Otros</IonSelectOption>
                <IonSelectOption value="Tandas">Tandas</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput
                placeholder="Cantidad $"
                value={amountExp}
                onIonChange={onAmountExpChange}
              ></IonInput>
            <IonButton onClick={onAddRowFamilyExp}>+</IonButton>
            </IonItem>

            <IonGrid>
              {familyExp.map((i: SocioEconomicData, n: number) => (
                <IonRow key={n}>
                  <IonCol size='5'><IonLabel>{i.description}</IonLabel></IonCol>
                  <IonCol><IonLabel>{formatLocalCurrency(parseFloat(i.amount))}</IonLabel></IonCol>
                  <IonCol><IonButton className='boton-peque' color='medium' id={`famexpense-${n}`} onClick={onRemoveExp}>Quitar</IonButton></IonCol>
                </IonRow>
              ))}
            </IonGrid>
            <div className="line"></div>
            <IonGrid>
              <IonRow>
                <IonCol size='6'><IonLabel>Total:</IonLabel></IonCol>
                <IonCol>{totalFamilyExp}</IonCol>
                <IonCol></IonCol>
              </IonRow>
            </IonGrid>

            {/*Family Goods **/}
            <IonItem>
              <IonLabel>Bienes del Hogar</IonLabel>
              <IonSelect value={familyGoodsType} onIonChange={(e: any) => setFamiliGoodsType(e.target.value)}>
                <IonSelectOption value="Muebles y Enseres">Muebles y Enseres</IonSelectOption>
                <IonSelectOption value="Propiedades del Hogar">Propiedades del Hogar</IonSelectOption>
                <IonSelectOption value="Vehiculo Familiar">Vehiculo Familiar</IonSelectOption>
                <IonSelectOption value="Otros">Otros</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput placeholder="Valor $" value={amountGoods} onIonChange={onAmountGoodsChange}></IonInput>
              <IonButton onClick={onAddRowFamilyGoods}>+</IonButton>
            </IonItem>

            <IonGrid>
              {familyGoods.map((i: SocioEconomicData, n: number) => (
                <IonRow key={n}>
                  <IonCol size='5'><IonLabel>{i.description}</IonLabel></IonCol>
                  <IonCol><IonLabel>{formatLocalCurrency(parseFloat(i.amount))}</IonLabel></IonCol>
                  <IonCol><IonButton className='boton-peque' color='medium' id={`famgoods-${n}`} onClick={onRemoveGoods}>Quitar</IonButton></IonCol>
                </IonRow>
              ))}
            </IonGrid>
            <div className="line"></div>
            {/* Summary and totals **/}
            <IonGrid>
              <IonRow>
                <IonCol size='6'><IonLabel>Total:</IonLabel></IonCol>
                <IonCol>{totalFamilyGoods}</IonCol>  
                <IonCol></IonCol>
              </IonRow>
            </IonGrid>
          
          {/* Family Debts payable **/}
          <IonItemGroup>
            <IonItemDivider><IonLabel>Deudas por pagar del Hogar</IonLabel></IonItemDivider>
            <IonGrid>
                <IonRow className="borde-claro">
                  <IonCol size='2'><p className="fuente-small">quitar</p></IonCol>
                  <IonCol size='6'><p className="fuente-small">Acreedor</p></IonCol>
                  <IonCol size='2'><p className="fuente-small">Saldo</p></IonCol>
                  <IonCol size='2'><p className="fuente-small">Cuota</p></IonCol>
                </IonRow>
            </IonGrid>
            <IonGrid>
              {debts.map( (i:SocioEconomicData, n:number)=>
                <IonRow key={n}>
                  <IonCol size='2'><IonButton className='boton-peque' color='medium' id={`famdebts-${n}`} onClick={onRemoveDebtItem}>x</IonButton></IonCol>
                  <IonCol size='6'><p className="fuente-small">{i.creditor}</p></IonCol>
                  <IonCol size='2'><p className="fuente-small">{i.balance}</p></IonCol>
                  <IonCol size='2'><p className="fuente-small">{i.amount}</p></IonCol>
                </IonRow>)}
            </IonGrid>
            <IonGrid>
                <IonRow>
                  <IonCol size='4'><IonInput value={debtCreditor} onIonChange={(e) => setDebtCreditor(e.detail.value!)} className='borde-claro fuente-small' placeholder='Acreedor' ></IonInput></IonCol>
                  <IonCol size='2'><IonInput value={debtBalance} onIonChange={(e) => setDebtBalance(e.detail.value!)} className='borde-claro fuente-small' placeholder='Saldo'></IonInput></IonCol>
                  <IonCol size='2'><IonInput value={debtPayment} onIonChange={(e) => setDebtPayment(e.detail.value!)} className='borde-claro fuente-small' placeholder='Cuota Mensual'></IonInput></IonCol>
                  <IonCol><IonInput value={debtDestiny} onIonChange={(e) => setDebtDestiny(e.detail.value!)} className='borde-claro fuente-small' placeholder='Destino del credito'></IonInput></IonCol>
                </IonRow>
                <IonButton className='boton-peque' onClick={onAddDebtItem} color='light'>Ok</IonButton>
            </IonGrid>
          </IonItemGroup>
          <div className="line"></div>
          
          </div>
        )}
        {currSegment === "negocio" && (

          <div className="ion-padding">
            <IonItem>
              <IonLabel>Disponibilidades</IonLabel>
              <IonSelect
                value={bisCashFlowType}
                onIonChange={(e: any) => setBisCashFlowType(e.target.value)}
              >
                <IonSelectOption value="Efectivo">Efectivo</IonSelectOption>
                <IonSelectOption value="Cuentas de Ahorro">Cuentas de Ahorro</IonSelectOption>
                <IonSelectOption value="Otros">Otros</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput placeholder="Cantidad $" value={amountBisCashFlow} onIonChange={onAmountBisCashFlowChange}></IonInput>
              <IonButton onClick={onAddBisCashFlow}>+</IonButton>
            </IonItem>

            <IonGrid>
              {bisCashFlow.map((i: SocioEconomicData, n: number) => (
                <IonRow key={n}>
                  <IonCol size='5'><IonLabel>{i.description}</IonLabel></IonCol>
                  <IonCol><IonLabel>{formatLocalCurrency(parseFloat(i.amount))}</IonLabel></IonCol>
                  <IonCol><IonButton className='boton-peque' color='medium' id={`biscashflow-${n}`} onClick={onRemoveBisCashFlowItem}>Quitar</IonButton></IonCol>
                </IonRow>
              ))}
            </IonGrid>
            <div className="line"></div>
            
            <IonGrid>
              <IonRow>
                <IonCol size='6'><IonLabel>Total:</IonLabel></IonCol>
                <IonCol>{totalBisCashFlow}</IonCol>
                <IonCol></IonCol>
              </IonRow>
            </IonGrid>

          {/* Accounts receivable **/}
          <IonItemGroup>
            <IonItemDivider><IonLabel>Cuentas por cobrar del negocio</IonLabel></IonItemDivider>
            <IonGrid>
                <IonRow className="borde-claro">
                  <IonCol size='2'><p className="fuente-small">quitar</p></IonCol>
                  <IonCol size='4'><p className="fuente-small">Cta por Cobrar</p></IonCol>
                  <IonCol size='3'><p className="fuente-small">Importe</p></IonCol>
                  <IonCol size='3'><p className="fuente-small">No de Clientes</p></IonCol>
                </IonRow>
            </IonGrid>
            <IonGrid>
              {bisAccountsReceive.map( (i:SocioEconomicData, n:number)=>
                <IonRow key={n}>
                  <IonCol size='2'><IonButton className='boton-peque' color='medium' id={`bisaccreceive-${n}`} onClick={onRemoveBisAccReceive}>x</IonButton></IonCol>
                  <IonCol size='6'><p className="fuente-small">{i.creditor}</p></IonCol>
                  <IonCol size='2'><p className="fuente-small">{i.amount}</p></IonCol>
                  <IonCol size='2'><p className="fuente-small">{i.balance}</p></IonCol>
                </IonRow>)}
            </IonGrid>
            <IonGrid>
                <IonRow>
                  <IonCol size='4'><IonInput value={bisAccountsReceiveAcc} onIonChange={(e) => setBisAccountsReceiveAcc(e.detail.value!)} className='borde-claro fuente-small' placeholder='Cta por cobrar' ></IonInput></IonCol>
                  <IonCol size='2'><IonInput value={bisAccountsReceiveAmt} onIonChange={(e) => setBisAccountsReceiveAmt(e.detail.value!)} className='borde-claro fuente-small' placeholder='Importe'></IonInput></IonCol>
                  <IonCol size='2'><IonInput value={bisAccountsReceiveCli} onIonChange={(e) => setBisAccountsReceiveCli(e.detail.value!)} className='borde-claro fuente-small' placeholder='# Clientes'></IonInput></IonCol>
                  <IonCol><IonInput value={bisAccountsReceiveNote} onIonChange={(e) => setBisAccountsReceiveNote(e.detail.value!)} className='borde-claro fuente-small' placeholder='Clientes +influyentes $'></IonInput></IonCol>
                </IonRow>
                <IonButton className='boton-peque' onClick={onAddBisAccReceive} color='light'>Ok</IonButton>
            </IonGrid>
          </IonItemGroup>
          
          {/* Business Goods **/}
          <IonItem>
              <IonLabel>Bienes del Negocio</IonLabel>
              <IonSelect value={bisGoodsType} onIonChange={(e: any) => setBisGoodsType(e.target.value)}>
                <IonSelectOption value="Muebles y Equipo">Muebles y Equipo</IonSelectOption>
                <IonSelectOption value="Terrenos">Terrenos y/o Locales</IonSelectOption>
                <IonSelectOption value="Vehiculo">Vehiculo Negocio</IonSelectOption>
                <IonSelectOption value="Otros">Otros</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput placeholder="Valor $" value={amountBisGoods} onIonChange={onAmountBisGoodsChange}></IonInput>
              <IonButton onClick={onAddBisGoods}>+</IonButton>
            </IonItem>

            <IonGrid>
              {bisGoods.map((i: SocioEconomicData, n: number) => (
                <IonRow key={n}>
                  <IonCol size='5'><IonLabel>{i.description}</IonLabel></IonCol>
                  <IonCol><IonLabel>{formatLocalCurrency(parseFloat(i.amount))}</IonLabel></IonCol>
                  <IonCol><IonButton className='boton-peque' color='medium' id={`bisgoods-${n}`} onClick={onRemoveBisGoods}>Quitar</IonButton></IonCol>
                </IonRow>
              ))}
            </IonGrid>
            <div className="line"></div>
            {/* Summary and totals **/}
            <IonGrid>
              <IonRow>
                <IonCol size='6'><IonLabel>Total:</IonLabel></IonCol>
                <IonCol>{totalBisGoods}</IonCol>  
                <IonCol></IonCol>
              </IonRow>
            </IonGrid>

            {/* Business Debts **/}
            <IonItemGroup>
            <IonItemDivider><IonLabel>Deudas por pagar del Negocio</IonLabel></IonItemDivider>
            <IonGrid>
                <IonRow className="borde-claro">
                  <IonCol size='2'><p className="fuente-small">quitar</p></IonCol>
                  <IonCol size='6'><p className="fuente-small">Acreedor</p></IonCol>
                  <IonCol size='2'><p className="fuente-small">Saldo</p></IonCol>
                  <IonCol size='2'><p className="fuente-small">Cuota</p></IonCol>
                </IonRow>
            </IonGrid>
            <IonGrid>
              {bisDebts.map( (i:SocioEconomicData, n:number)=>
                <IonRow key={n}>
                  <IonCol size='2'><IonButton className='boton-peque' color='medium' id={`bisdebts-${n}`} onClick={onRemoveBisDebt}>x</IonButton></IonCol>
                  <IonCol size='5'><p className="fuente-small">{i.creditor}</p></IonCol>
                  <IonCol size='2'><p className="fuente-small">{i.balance}</p></IonCol>
                  <IonCol size='2'><p className="fuente-small">{i.amount}</p></IonCol>
                </IonRow>)}
            </IonGrid>
            <IonGrid>
                <IonRow>
                  <IonCol size='4'><IonInput value={bisDebtCreditor} onIonChange={(e) => setBisDebtCreditor(e.detail.value!)} className='borde-claro fuente-small' placeholder='Acreedor' ></IonInput></IonCol>
                  <IonCol size='2'><IonInput value={bisDebtBalance} onIonChange={(e) => setBisDebtBalance(e.detail.value!)} className='borde-claro fuente-small' placeholder='Saldo'></IonInput></IonCol>
                  <IonCol size='2'><IonInput value={bisDebtPayment} onIonChange={(e) => setBisDebtPayment(e.detail.value!)} className='borde-claro fuente-small' placeholder='Cuota Mensual'></IonInput></IonCol>
                  <IonCol><IonInput value={bisDebtDestiny} onIonChange={(e) => setBisDebtDestiny(e.detail.value!)} className='borde-claro fuente-small' placeholder='Destino del credito'></IonInput></IonCol>
                </IonRow>
                <IonButton className='boton-peque' onClick={onAddBisDebt} color='light'>Ok</IonButton>
            </IonGrid>
          </IonItemGroup>

          </div>
        )}
        {
          currSegment === 'ventas' && (
            <div className="ion-padding">
            {/* Business Sales **/}
            <IonItemGroup>
              <IonItemDivider><IonLabel>Ventas Diarias</IonLabel></IonItemDivider>
            <IonGrid>
                <IonRow className="borde-claro">
                  <IonCol><IonInput placeholder="Lun" className="fuente-small" value={weekDayMon} onIonChange={(e:any)=> setWeekDayMon(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Mar" className="fuente-small" value={weekDayTue} onIonChange={(e:any)=> setWeekDayTue(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Mie" className="fuente-small" value={weekDayWed} onIonChange={(e:any)=> setWeekDayWed(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Jue" className="fuente-small" value={weekDayThu} onIonChange={(e:any)=> setWeekDayThu(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Vie" className="fuente-small" value={weekDayFri} onIonChange={(e:any)=> setWeekDayFri(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Sab" className="fuente-small" value={weekDaySat} onIonChange={(e:any)=> setWeekDaySat(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Dom" className="fuente-small" value={weekDaySun} onIonChange={(e:any)=> setWeekDaySun(e.detail.value!)}></IonInput></IonCol>
                </IonRow>
            </IonGrid>
            <IonItemDivider><IonLabel>Ventas Semanales</IonLabel></IonItemDivider>
            <IonGrid>
                <IonRow className="borde-claro">
                  <IonCol><IonInput placeholder="Semana 1" className="fuente-small" value={saleWeekOne}   onIonChange={(e:any)=> setSaleWeekOne(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Semana 2" className="fuente-small" value={saleWeekTwo}   onIonChange={(e:any)=> setSaleWeekTwo(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Semana 3" className="fuente-small" value={saleWeekThree} onIonChange={(e:any)=> setSaleWeekThree(e.detail.value!)} ></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Semana 4" className="fuente-small" value={saleWeekFour}  onIonChange={(e:any)=> setSaleWeekFour(e.detail.value!)}  ></IonInput></IonCol>
                </IonRow>
            </IonGrid>
            <IonItemDivider><IonLabel>Ventas Quincenales</IonLabel></IonItemDivider>
            <IonGrid>
              
                <IonRow className="borde-claro">
                  <IonCol><IonInput placeholder="Quincena 1" className="fuente-small" value={saleQuincenaOne} onIonChange={(e:any)=> setSaleQuincenaOne(e.detail.value!)}></IonInput></IonCol>
                  <IonCol><IonInput placeholder="Quincena 2" className="fuente-small" value={saleQuincenaTwo} onIonChange={(e:any)=> setSaleQuincenaTwo(e.detail.value!)}></IonInput></IonCol>
                </IonRow>
            </IonGrid>
            <IonItem>
              <IonInput placeholder="Ventas Mensuales" value={saleMonthly} onIonChange={ (e:any)=>setSaleMonthly(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItemDivider><IonLabel>Estacionalidad</IonLabel></IonItemDivider>
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

            <IonItemDivider><IonLabel>Detalle de los Rubros mas Vendidos</IonLabel></IonItemDivider>
            <IonGrid>
                <IonRow className="borde-claro">
                  <IonCol><p className="fuente-small margen-cero">quitar</p></IonCol>
                  <IonCol><p className="fuente-small margen-cero">Descripcion</p></IonCol>
                  <IonCol><p className="fuente-small margen-cero">Cantidad</p></IonCol>
                  <IonCol><p className="fuente-small margen-cero">Precio</p></IonCol>
                  <IonCol><p className="fuente-small margen-cero">Subtotal</p></IonCol>
                </IonRow>
            </IonGrid>
            <IonGrid>
                {bisSales.map((i:SalesInventoryData,n:number) =>
                <IonRow className="borde-claro" key={n}>
                  <IonCol size="2"><IonButton className='boton-peque margen-cero' color='medium' id={`bissales-${n}`} onClick={onRemoveBisSalesItem}>x</IonButton></IonCol>
                  <IonCol><p className="fuente-small margen-cero">{i.description}</p></IonCol>
                  <IonCol><p className="fuente-small margen-cero">{i.quantity}</p></IonCol>
                  <IonCol><p className="fuente-small margen-cero">{i.price}</p></IonCol>
                  <IonCol><p className="fuente-small margen-cero">{i.subtotal}</p></IonCol>
                </IonRow>)}
            </IonGrid>

            <IonGrid>
                <IonRow className="borde-claro">
                  <IonCol><IonInput value={bisSalesDescription} onIonChange={ (e:any)=>setBisSalesDescription(e.detail.value!)}placeholder="Descripcion" className="fuente-small"></IonInput></IonCol>
                  <IonCol><IonInput value={bisSalesUnit} onIonChange={ (e:any)=>setBisSalesUnit(e.detail.value!)}placeholder="Unidad" className="fuente-small"></IonInput></IonCol>
                  <IonCol><IonInput value={bisSalesQuantity} onIonChange={ (e:any)=>setBisSalesQuantity(e.detail.value!)}placeholder="Cantidad" className="fuente-small"></IonInput></IonCol>
                  <IonCol><IonInput value={bisSalesPrice} onIonChange={ (e:any)=>setBisSalesPrice(e.detail.value!)}placeholder="Precio" className="fuente-small"></IonInput></IonCol>
                  <IonCol><IonButton className='boton-peque' color='medium' onClick={onAddBisSaleItem}>Add</IonButton></IonCol>
                </IonRow>
            </IonGrid>
            <IonItem>
              <IonInput placeholder="Ventas Mensuales Contado" value={bisSalesMonthCash} onIonChange={(e:any)=> setBisSalesMonthCash(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonInput placeholder="Ventas Mensuales a Credito" value={bisSalesMonthCredit} onIonChange={(e:any)=> setBisSalesMonthCredit(e.detail.value!)}></IonInput>
            </IonItem>
            <IonTextarea placeholder="comentarios ventas" className="fuente-small" value={bisSalesComments} onIonChange={(e:any)=>setBisSalesComments(e.detail.value!)}></IonTextarea>
            </IonItemGroup>
            </div>
          )}
          {
            currSegment === 'compras' && (
              <div className="ion-padding">
                <IonItemDivider><IonLabel>Compras Mensuales</IonLabel></IonItemDivider>
                  <IonGrid>
                    <IonRow className="borde-claro">
                      <IonCol><p className="fuente-small margen-cero">quitar</p></IonCol>
                      <IonCol><p className="fuente-small margen-cero">Descripcion</p></IonCol>
                      <IonCol><p className="fuente-small margen-cero">Cantidad</p></IonCol>
                      <IonCol><p className="fuente-small margen-cero">Precio</p></IonCol>
                      <IonCol><p className="fuente-small margen-cero">Subtotal</p></IonCol>
                    </IonRow>
                </IonGrid>
                
                <IonGrid>
                    {bisPurchase.map((i:SalesInventoryData,n:number) =>
                    <IonRow className="borde-claro" key={n}>
                      <IonCol size="2"><IonButton className='boton-peque margen-cero' color='medium' id={`bispurchase-${n}`} onClick={onRemoveBisPurchaseItem}>x</IonButton></IonCol>
                      <IonCol><p className="fuente-small margen-cero">{i.description}</p></IonCol>
                      <IonCol><p className="fuente-small margen-cero">{i.quantity}</p></IonCol>
                      <IonCol><p className="fuente-small margen-cero">{i.price}</p></IonCol>
                      <IonCol><p className="fuente-small margen-cero">{i.subtotal}</p></IonCol>
                    </IonRow>)}
                </IonGrid>

                <IonGrid>
                    <IonRow className="borde-claro">
                      <IonCol><IonInput value={bisPurchaseDescription} onIonChange={ (e:any)=>setBisPurchaseDescription(e.detail.value!)}placeholder="Descripcion" className="fuente-small"></IonInput></IonCol>
                      <IonCol><IonInput value={bisPurchaseUnit} onIonChange={ (e:any)=>setBisPurchaseUnit(e.detail.value!)}placeholder="Unidad" className="fuente-small"></IonInput></IonCol>
                      <IonCol><IonInput value={bisPurchaseQuantity} onIonChange={ (e:any)=>setBisPurchaseQuantity(e.detail.value!)}placeholder="Cantidad" className="fuente-small"></IonInput></IonCol>
                      <IonCol><IonInput value={bisPurchasePrice} onIonChange={ (e:any)=>setBisPurchasePrice(e.detail.value!)}placeholder="Precio" className="fuente-small"></IonInput></IonCol>
                      <IonCol><IonButton className='boton-peque' color='medium' onClick={onAddBisPurchaseItem}>Add</IonButton></IonCol>
                    </IonRow>
                </IonGrid>

                <IonItemDivider><IonLabel>Proyecciones de venta / margen</IonLabel></IonItemDivider>
                <IonItem>
                    <IonInput value={mubPercent} onIonChange={(e:any)=>setMubPercent(e.detail.value!)} placeholder="MUB %"></IonInput>
                    <IonInput value={mubAmount}  onIonChange={(e:any)=>setMubAmount(e.detail.value!)} placeholder="MUB $$$"></IonInput>
                </IonItem>
                <IonItemDivider><IonLabel>Determinacion de ventas por fuente de informacion</IonLabel></IonItemDivider>
                <IonGrid>
                  <IonRow><IonCol><p className="fuente-small margen-cero">Ventas diarias</p></IonCol><IonCol><p className="fuente-small margen-cero">{salesDayly}</p></IonCol></IonRow>
                  <IonRow><IonCol><p className="fuente-small margen-cero">Ventas semanales</p></IonCol> <IonCol><p className="fuente-small margen-cero">{salesWeekly}</p></IonCol></IonRow>
                  <IonRow><IonCol><p className="fuente-small margen-cero">Ventas quincenales</p></IonCol> <IonCol><p className="fuente-small margen-cero">{salesQuincenly}</p></IonCol></IonRow>
                  <IonRow><IonCol><p className="fuente-small margen-cero">Ventas mensuales</p></IonCol> <IonCol><p className="fuente-small margen-cero">{salesMonthly}</p></IonCol></IonRow>
                  <IonRow><IonCol><p className="fuente-small margen-cero">Por compras</p></IonCol> <IonCol><p className="fuente-small margen-cero">{salesPurchased}</p></IonCol></IonRow>
                  <IonRow><IonCol><p className="fuente-small margen-cero">Por efectivo</p></IonCol> <IonCol><p className="fuente-small margen-cero">{salesCash}</p></IonCol></IonRow>
                </IonGrid>
                <IonItem>
                    <IonLabel position="floating">Promedio de ventas por fuente</IonLabel>
                    <IonInput value={salesAverage} onIonChange={(e:any)=>setSalesAverage(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Dato seleccionado</IonLabel>
                    <IonInput value={salesSelectedData} onIonChange={(e:any)=>setSalesSelectedData(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                  <IonTextarea placeholder="Escribe comentarios..." className="fuente-small" value={salesComments} onIonChange={(e:any)=>setSalesComments(e.detail.value!)}>
                  </IonTextarea>
                </IonItem>
 
              </div>
            )}
            {
              currSegment === 'gastos' && (
                <div className="ion-padding">
                <IonItem>
                  <IonLabel>Gastos del Negocio</IonLabel>
                  <IonSelect
                    value={bisExpenseType}
                    onIonChange={(e: any) => setBisExpenseType(e.target.value)}
                  >
                    <IonSelectOption value="Alquiler, depósitos, almacenaje">Alquiler, depósitos, almacenaje</IonSelectOption>
                    <IonSelectOption value="Servicios públicos(agua, luz, teléfono)">Servicios públicos(agua, luz, teléfono)</IonSelectOption>
                    <IonSelectOption value="Transportes (fletes, combustibles)">Transportes (fletes, combustibles)</IonSelectOption>
                    <IonSelectOption value="Mantenimiento de mobiliario y equipo">Mantenimiento de mobiliario y equipo</IonSelectOption>
                    <IonSelectOption value="Impuestos">Impuestos (licencias)</IonSelectOption>
                    <IonSelectOption value="Gastos de personal">Gastos de personal</IonSelectOption>
                    <IonSelectOption value="Deudas (incurridas para el negocio/cuotas)">Deudas (incurridas para el negocio/cuotas)</IonSelectOption>
                    <IonSelectOption value="Otros">Otros</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonInput
                    placeholder="Cantidad $"
                    value={amountBisExpense}
                    onIonChange={onAmountBisExpenseChange}
                  ></IonInput>
                <IonButton onClick={onAddBisExpenseItem}>+</IonButton>
                </IonItem>

                <IonGrid>
                  {bisExpense.map((i: SocioEconomicData, n: number) => (
                    <IonRow key={n}>
                      <IonCol size='5'><IonLabel>{i.description}</IonLabel></IonCol>
                      <IonCol><IonLabel>{formatLocalCurrency(parseFloat(i.amount))}</IonLabel></IonCol>
                      <IonCol><IonButton className='boton-peque' color='medium' id={`bisexpense-${n}`} onClick={onRemoveBisExpenseItem}>Quitar</IonButton></IonCol>
                    </IonRow>
                  ))}
                </IonGrid>
                <div className="line"></div>
                <IonGrid>
                  <IonRow>
                    <IonCol size='6'><IonLabel>Total:</IonLabel></IonCol>
                    <IonCol>{totalBisExpense}</IonCol>
                    <IonCol></IonCol>
                  </IonRow>
                </IonGrid>
                
                <IonItemDivider><IonLabel>Analisis de Mercancia (inventarios)</IonLabel></IonItemDivider>

                <IonGrid>
                  <IonRow className="borde-claro">
                    <IonCol><p className="fuente-small margen-cero">quitar</p></IonCol>
                    <IonCol><p className="fuente-small margen-cero">Descripcion</p></IonCol>
                    <IonCol><p className="fuente-small margen-cero">Cantidad</p></IonCol>
                    <IonCol><p className="fuente-small margen-cero">Precio</p></IonCol>
                    <IonCol><p className="fuente-small margen-cero">Subtotal</p></IonCol>
                  </IonRow>
                </IonGrid>
                <IonGrid>
                    {bisInventory.map((i:SalesInventoryData,n:number) =>
                    <IonRow className="borde-claro" key={n}>
                      <IonCol size="2"><IonButton className='boton-peque margen-cero' color='medium' id={`bisinventory-${n}`} onClick={onRemoveBisInventoryItem}>x</IonButton></IonCol>
                      <IonCol><p className="fuente-small margen-cero">{i.description}</p></IonCol>
                      <IonCol><p className="fuente-small margen-cero">{i.quantity}</p></IonCol>
                      <IonCol><p className="fuente-small margen-cero">{i.price}</p></IonCol>
                      <IonCol><p className="fuente-small margen-cero">{i.subtotal}</p></IonCol>
                    </IonRow>)}
                </IonGrid>
                <IonGrid>
                    <IonRow className="borde-claro">
                      <IonCol><IonInput value={bisInventoryDescription} onIonChange={ (e:any)=>setBisInventoryDescription(e.detail.value!)}placeholder="Descripcion" className="fuente-small"></IonInput></IonCol>
                      <IonCol><IonInput value={bisInventoryUnit} onIonChange={ (e:any)=>setBisInventoryUnit(e.detail.value!)}placeholder="Unidad" className="fuente-small"></IonInput></IonCol>
                      <IonCol><IonInput value={bisInventoryQuantity} onIonChange={ (e:any)=>setBisInventoryQuantity(e.detail.value!)}placeholder="Cantidad" className="fuente-small"></IonInput></IonCol>
                      <IonCol><IonInput value={bisInventoryPrice} onIonChange={ (e:any)=>setBisInventoryPrice(e.detail.value!)}placeholder="Precio" className="fuente-small"></IonInput></IonCol>
                      <IonCol><IonButton className='boton-peque' color='medium' onClick={onAddBisInventoryItem}>Add</IonButton></IonCol>
                    </IonRow>
                </IonGrid>

                <div className="line"></div>
                </div>
              )}
              <div className="ion-padding">

                <IonButton expand='block' color='success' onClick={onSave}>Guardar</IonButton>
              </div>
    </IonContent>
    </IonPage>
  );
};
