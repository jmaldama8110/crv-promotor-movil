
export const getRound = (data: number) => {
    const factor = 100;
    return Math.round( (data + Number.EPSILON) * factor ) / factor

}