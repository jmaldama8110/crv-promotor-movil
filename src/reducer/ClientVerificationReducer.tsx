import { SearchData } from "../components/SelectDropSearch";

export interface ClientVerification {
    _id: string;
    client_id: string;
    id_cliente: number;
    fullname: string;
    countryOfBirth: string;
    nationality: string;
    maritalStatus: string;
    loanAmount: string;
    groupName:string;
    partnerName:string;
    partnerOcupation:string;
    placeOfWork:string;
    weeklyIncome:string;
    hasChildren:string;
    childrenGoToSchool: boolean;
    schoolName: string;
    cleanHome:boolean;
    tv:boolean;
    concreteFloor:boolean;
    microwave:boolean;
    floorTile:boolean;
    concreteRoof:boolean;
    stove:boolean;
    laminateRoof:boolean;
    computer:boolean;
    internet:boolean;
    householdOwned:boolean;
    householdRent:boolean;
    householdRelatives:boolean;
    bisAndHomeSameAddress:boolean;
    yearsResidence: string;
    peopleLiving:string;
    rentAmount:string;
    familyIsAwareOfLoan:boolean;
    bisArticles:boolean;
    bisSupplies:boolean;
    bisAssets:boolean;
    bisCommets:string;

    isAddressCorrect: boolean
    address_line1 :  string
    city : [string, string]
    colony :  [string, string]
    country: [string, string]
    municipality :  [string, string]
    post_code: string
    province: [string, string]
    type : string

    profession: SearchData,
    economicActivity: SearchData,
    detectOtherActivity: string,
    linksOtherSociety: boolean,
    linksOtherAssociation: boolean,
    ppeLevel: string,
    ppeCharge: string,
    gobernmentWorkName: string,
    gobernmentWorkAddress: string,
    gobernmentFunctions: string,
    gobernmentResponsabilities: string,
    detectExternalProvider: boolean,
    detectRealOwner:boolean,
    detectCommets:string;
    verification_imgs: any[];
    coordinates: [number, number];
}

export type ActionsClientVerification = {
    type: "SET_CLIENT_VERIFICATION",
    verification: ClientVerification
} |{
    type: "RESET_CLIENT_VERIFICATION"
}
export const clientVerificationDefault: ClientVerification = {
    _id: '',
    client_id: '',
    id_cliente: 0,
    fullname: '',
    countryOfBirth: '',
    nationality: '',
    maritalStatus: '',
    loanAmount: '',
    groupName:'',
    partnerName:'',
    partnerOcupation:'',
    placeOfWork:'',
    weeklyIncome:'',
    hasChildren:'',
    childrenGoToSchool: false,
    schoolName: '',
    cleanHome:false,
    tv:false,
    concreteFloor:false,
    microwave:false,
    floorTile:false,
    concreteRoof:false,
    stove:false,
    laminateRoof:false,
    computer:false,
    internet:false,
    householdOwned:false,
    householdRent:false,
    householdRelatives:false,
    bisAndHomeSameAddress:false,
    yearsResidence: '',
    peopleLiving:'',
    rentAmount:'',
    familyIsAwareOfLoan:false,
    bisArticles:false,
    bisSupplies:false,
    bisAssets:false,
    bisCommets:'',

    isAddressCorrect: false,
    address_line1 :  '',
    city : ['', ''],
    colony :  ['', ''],
    country: ['', ''],
    municipality :  ['', ''],
    post_code: '',
    province: ['', ''],
    type : '',

    profession: {id: "",etiqueta: ""},
    economicActivity: {id: "",etiqueta: ""},
    detectOtherActivity: '',
    linksOtherSociety: false,
    linksOtherAssociation: false,
    ppeLevel: '',
    ppeCharge: '',
    gobernmentWorkName: '',
    gobernmentWorkAddress: '',
    gobernmentFunctions: '',
    gobernmentResponsabilities: '',
    detectExternalProvider: false,
    detectRealOwner:false,
    detectCommets:'',
    verification_imgs: [],
    coordinates: [0, 0]
  }
export const ClientVerificationReducer = (state: ClientVerification, action:ActionsClientVerification ) => {

    switch (action.type) {
        case "SET_CLIENT_VERIFICATION":
            return {
                ...state,
                ...action.verification
            }
        case "RESET_CLIENT_VERIFICATION":
            return {
                ...state,
                ...clientVerificationDefault
            }
        default: 
        return state;
    }

}