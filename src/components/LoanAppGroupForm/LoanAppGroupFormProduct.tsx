import { IonLabel, IonList, IonSegment, IonSegmentButton } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { db } from "../../db";
import { TermType } from "../../reducer/LoanAppGroupReducer";
import { AppContext } from "../../store/store";
import { formatLocalCurrency } from "../../utils/numberFormatter";
import { ButtonSlider } from "../SliderButtons";

export const LoanAppGroupFormProduct: React.FC< {onSubmit: any}> = ({onSubmit}) => {

  const [currSegment, setSegment] = useState<string>("1");
  const [productList, setProductList] = useState<any[]>([]);

  const [minAmout, setMinAmount] = useState(1000);
  const [maxAmount, setMaxAmount] = useState(1000000);
  const [stepAmount, setStepAmount] = useState(10000);

  const [minTerm, setMinTerm] = useState<number>(1);
  const [maxTerm, setMaxTerm] = useState<number>(48);
  
  const [tax, setTax] = useState(0);
  const [productName, setProductName] = useState('');
  const [productTermTypes, setProductTermTypes] = useState<TermType[]>([]);
  const [productRate, setProductRate] = useState('');

  const { loanAppGroup } = useContext( AppContext );

  let render = true;
  
  useEffect(() => {
    if( render ){
      render = false;
        db.createIndex({
          index: { fields: ["couchdb_type"] },
        }).then(function () {
          db.find({
            selector: {
              couchdb_type: "PRODUCT",
            },
          }).then((data: any) => {
            const productForGroups = data.docs.filter((i: any) => (i.external_id === 1 || i.external_id === 3))
            setProductList(productForGroups);
          });
        });
    }
  }, []);

  useEffect( ()=>{
    if( loanAppGroup._id ){
      setSegment(`${loanAppGroup.product.external_id}`);
    }

  },[loanAppGroup])

  useEffect( ()=>{
    updateParams();
  },[productList]) 

  useEffect( ()=>{
    updateParams();
  },[currSegment]) 
  

  function onNext () {
    const data = {
      GL_financeable: false,
      liquid_guarantee: 10,
      min_amount: minAmout,
      max_amount: maxAmount,
      step_amount: stepAmount,
      min_term: minTerm,
      max_term: maxTerm,
      product_name: productName,
      term_types: productTermTypes,
      rate: productRate,
      tax,
      external_id: currSegment
    }
    
    onSubmit(data);
  }

  function updateParams ( ) {
    const selectedProduct:any = productList.find( (i:any) => i.external_id == currSegment )
    if( selectedProduct ){
      const maxAmount = loanAppGroup.members.length > 0 ? loanAppGroup.members.length * selectedProduct.max_amount : selectedProduct.max_amount;

      setMinAmount(selectedProduct.min_amount);
      setMaxAmount(maxAmount);
      setStepAmount(selectedProduct.step_amount);

      setMinTerm(selectedProduct.min_term);
      setMaxTerm(selectedProduct.max_term);
      setProductName(selectedProduct.product_name);
      setProductTermTypes(selectedProduct.allowed_term_type);
      setProductRate(selectedProduct.rate);
      setTax(selectedProduct.tax);
  }
  }

  useEffect( ()=>{
    if( currSegment ){
        updateParams();
    }

  },[currSegment]);

  return (
    <IonList className="ion-padding">
      <IonSegment
        value={currSegment}
        onIonChange={(e) => setSegment(e.detail.value!)}
      >
        {productList.map((i: any) => (
          <IonSegmentButton key={i._id} value={i.external_id}>
            <IonLabel>{i.product_name.substring(0, 18)}</IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>
      { 
        <div>
          <div className="texto-centrado">
            <h1 className="clr-tnc">{productName}</h1>
          </div>
          <div>
            <ul className="fuente-md">
              <li>Desde {formatLocalCurrency(minAmout)} hasta {formatLocalCurrency(maxAmount)} pesos</li>
              <li>Plazo de {minTerm} a {maxTerm}, con pagos cada { productTermTypes.map( (i:TermType) => (i.value)).join(', ') } </li>              
              <li>Sin Comisiones</li>
              <li>Contratacion de Seguro deudor</li>
              <li>Tasa Anual: {productRate}%</li>
            </ul>
          </div>
          <div className="texto-centrado">
            <h1>Requisitos</h1>
          </div>
          <div>
            <ul className="fuente-md">
              <li>Identificacion oficial vigente</li>
              <li>Comprobante de domicilio actualizado</li>              
              <li>Avales</li>
              <li>Referencias personales</li>
              <li>Contratacion de Seguro deudor</li>
            </ul>
          </div>
        </div>
      }
        <ButtonSlider color="primary" expand="block" label="Siguiente" onClick={onNext} slideDirection={"F"}></ButtonSlider>
    </IonList>
  );
};
