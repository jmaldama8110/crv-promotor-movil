
import { IonAvatar, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup, IonRange } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";
import { getRound } from "../../utils/math";
import { formatLocalCurrency } from "../../utils/numberFormatter";
import { ButtonSlider } from "../SliderButtons";
import { Geolocation } from "@capacitor/geolocation";

interface TermType {
    identifier: string;
    value: string;
    year_periods: string;
}

export const LoanAppGroupFormGenerals: React.FC< { onSubmit:any }> = ( {onSubmit}) => {

    const { loanAppGroup  } = useContext(AppContext);
    
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
  
    const [apply_amount, setApplyAmount] = useState<number>( loanAppGroup.product.min_amount);  
    const [term, setTerm] = useState<number>( loanAppGroup.product.min_term);
    const [termType, setTermType] = useState<string | undefined | null>("");

    /// Pago igual resultante
    const [paymentAmount, setPaymentAmount] = useState<string | undefined | null>("");
    

    function onSend(){
        const freqItem:TermType = loanAppGroup.product.term_types.find( (i:TermType) => i.identifier === termType )
        
        const data ={   
            apply_amount,
            term,
            frequency: [freqItem.identifier, freqItem.value ],
            coordinates: [lat,lng],
        }
        onSubmit(data);
    }
    useEffect( ()=>{
        setApplyAmount(loanAppGroup.apply_amount);
        if( loanAppGroup._id){ // runs when the _id not empty, thus in edit mode                
                setTerm( loanAppGroup.term);
                setTermType( loanAppGroup.frequency[0]);
        }

    },[loanAppGroup]) 
    
    useEffect(() => {

        const sched = [];
        const importe = apply_amount;
        const npagos = -term;
        let cuota = 0;
        let saldo = importe;
        let interes_periodo = 0;
        let capital_periodo = 0;
        let impuesto_periodo = 0;
        const iva = (1 + (loanAppGroup.product.tax)/100) ;
    
        const period: (TermType | undefined ) = loanAppGroup.product.term_types.find( (i: any) => i.identifier === termType);
        
        if (period) {
          const year_rate = (loanAppGroup.product.rate * iva) / 100;
          const year_periods = parseFloat(period.year_periods);
          const period_rate = year_periods ? year_rate / year_periods : 0;
          
          const numerator = importe * period_rate;
          const divisor = 1 - (1 + period_rate) ** npagos;
          cuota = divisor ? numerator / divisor : 0;
          setPaymentAmount(formatLocalCurrency(cuota));
    
          /// inserta en item 0 del plan de cuotas
          sched.push({
            number: 0,
            amount: 0,
            principal: 0,
            interest: 0,
            tax: 0,
            insurance: 0,
            balance: importe
          })
          /// calcula las cuotas
          for (let i = 0; i < term; i++) {
    
            interes_periodo =  (saldo * period_rate) / iva 
            impuesto_periodo = interes_periodo * (iva - 1) 
            capital_periodo = cuota - interes_periodo - impuesto_periodo
            saldo = saldo - capital_periodo;
      
            sched.push({
              number: i,
              amount: getRound(cuota),
              principal: getRound(capital_periodo),
              interest: getRound(interes_periodo),
              tax: getRound(impuesto_periodo),
              insurance: 0,
              balance: getRound(saldo)
            });
          }
        }
    
      }, [apply_amount, term, termType]);    

      useEffect(() => {
        async function loadCoordinates() {
          const coordsData = await Geolocation.getCurrentPosition();
          setLat(coordsData.coords.latitude);
          setLng(coordsData.coords.longitude);
        }
        loadCoordinates();
      }, []);

    return (
        <IonList className="ion-padding">
        
            <IonItemDivider>Credito Solicitado: {loanAppGroup.product.product_name}</IonItemDivider>
            <IonItem>
                <IonRange dualKnobs={false} min={loanAppGroup.product.min_amount} max={loanAppGroup.product.max_amount} step={loanAppGroup.product.step_amount} snaps={true} value={apply_amount} onIonChange={(e) => setApplyAmount(e.detail.value as any)}/>
            </IonItem>
            <IonItem>
                <IonLabel>Importe Solicitado: {formatLocalCurrency(apply_amount) } </IonLabel>
            </IonItem>
                <IonItem><IonRange value={term} onIonChange={(e) => setTerm(e.detail.value as number)} min={loanAppGroup.product.min_term} max={loanAppGroup.product.max_term} step={1} snaps={true}></IonRange>
            </IonItem>
            <IonItem>
                <IonLabel>Plazo: {term}</IonLabel>
            </IonItem>
            <IonRadioGroup allowEmptySelection={false} onIonChange={(e:any)=> setTermType(e.target.value!)} value={termType}>
                <IonListHeader><IonLabel>Pagos Cada:</IonLabel></IonListHeader>
                    {loanAppGroup.product.term_types.map( (t:TermType) => (
                        <IonItem key={t.identifier}>
                            <IonLabel>{t.value}</IonLabel>
                            <IonRadio value={t.identifier}></IonRadio>
                        </IonItem>))}
            </IonRadioGroup>
            <IonItem>
                <IonLabel>Importe Ficha:</IonLabel>
                <IonLabel>{paymentAmount}</IonLabel>
            </IonItem>

        
        <ButtonSlider color="primary" expand="block" label='Siguiente' onClick={onSend} slideDirection={"F"} disabled={!termType}></ButtonSlider>
        <ButtonSlider color="medium" expand="block" label='Anterior' onClick={() => {
            setTermType("");
            setApplyAmount(loanAppGroup.product.min_amount);
            setTerm(loanAppGroup.product.min_term);
            setPaymentAmount("")
        } } slideDirection={"B"}></ButtonSlider>
    </IonList>

    );
}