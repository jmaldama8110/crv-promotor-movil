export function getCurpInfo (curp: string){

    return {
        dob: `${parseInt(curp.substring(4,6)) + 1900}-${curp.substring(6,8)}-${curp.substring(8,10)}`,
        sex: curp.substring(10,11),
        prov: curp.substring(11,13)
    }

}