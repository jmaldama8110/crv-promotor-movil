import { format, parseISO } from "date-fns";

export const formatLocalCurrency = (numero: number) => {

    const formmatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    const numberString = formmatter.formatToParts(numero).map( ( { type, value } ) => {
        switch (type) {
            case 'currency': return '$' ;
            default: return value;
        }
    }).reduce((string, part) => string + part);

    return numberString;
}

export const formatLocalCurrencyV2 = (numero:number, currencySy:string, fractionSy:string, decimalSy:string) => {
    const formmatter = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    });

    const numberString = formmatter
      .formatToParts(numero)
      .map(({ type, value }) => {
        
        switch (type) {
          case "currency":
            return currencySy;
          case "fraction":
            return fractionSy;
          case "decimal":
            return decimalSy;
          default:
            return value;
        }
      })
      .reduce((string, part) => string + part );

    return numberString;
  };


export const formatDate = (value: string) => {
    if( !value ) return '';
    const dateWithNoTime = value.toString().substring(0, 10);
    return format(parseISO(dateWithNoTime), "dd-MMM-yyyy");
  };

export const formatLocalDate = (data:string) =>{
    if( !data ){
      return ''
    }
    const dateString = data.split('T')[0].split('-');
    
    const newDate = new Date(parseInt(dateString[0]),parseInt(dateString[1])-1, parseInt(dateString[2]));
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
    return `${newDate.getDate()}-${months[newDate.getMonth()]}-${newDate.getFullYear()}`

}
export const formatLocalDateShort = (data:string) =>{

    const dateString = data.split('T')[0].split('-');
    const newDate = new Date(parseInt(dateString[0]),parseInt(dateString[1])-1, parseInt(dateString[2]));
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
    // return `${newDate.getDay()}-${months[newDate.getMonth()]}-${newDate.getFullYear()}`
    return `${newDate.getDate()}/${months[newDate.getMonth()]}`

}