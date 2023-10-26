
export const getRound = (data: number, factor:number) => {
    return Math.round( (data + Number.EPSILON) * factor ) / factor

}