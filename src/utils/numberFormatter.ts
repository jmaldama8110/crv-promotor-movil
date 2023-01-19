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


export const formatDate = (value: string) => {
    if( !value ) return '';
    const dateWithNoTime = value.toString().substring(0, 10);
    return format(parseISO(dateWithNoTime), "dd-MMM-yyyy");
  };