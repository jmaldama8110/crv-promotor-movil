export function getCurpInfo (curp: string){

    const today = new Date();

    let yearOfBirth = parseInt(curp.substring(4,6)) + 1900; // default and most common
    const oldestYear = today.getFullYear() - 100; /// 1925 > 1905
    yearOfBirth = yearOfBirth < oldestYear ? yearOfBirth + 100 : yearOfBirth;

    return {
        dob: `${yearOfBirth}-${curp.substring(6,8)}-${curp.substring(8,10)}`,
        sex: curp.substring(10,11),
        prov: curp.substring(11,13)
    }

}