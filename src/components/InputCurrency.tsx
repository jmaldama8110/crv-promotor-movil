import { IonBadge, IonInput, IonItem, IonLabel } from "@ionic/react";

export const InputCurrency: React.FC< { InputString: string,
  fxUpdateInput: React.Dispatch<React.SetStateAction<string>>,
  BadgeFlag: boolean, 
  fxUpdateBadge: React.Dispatch<React.SetStateAction<boolean>>,
  placeholder?: string
} > = ( { InputString, fxUpdateInput,  BadgeFlag,fxUpdateBadge, placeholder}) => {
    
    function onApplyAmountChange (e:any){
        const entryAmount = e.detail.value
        const amountRE = new RegExp(process.env.REACT_APP_MONEY_ENTRY_REGEX!);
        const amountMatch = entryAmount.match(amountRE);
        if( amountMatch || !entryAmount ){
            fxUpdateInput(entryAmount);
            fxUpdateBadge(entryAmount);
        } 
        else {
            fxUpdateBadge(false);
        }
    }
  return (
    <IonItem>
      <IonInput
        type="text"
        value={InputString}
        onIonChange={onApplyAmountChange}
        placeholder={placeholder}
      ></IonInput>
      <IonBadge color={BadgeFlag ? "success" : "warning"}>
        {BadgeFlag ? "Ok" : "!"}
      </IonBadge>
    </IonItem>
  );
};
