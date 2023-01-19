export type ActionsClientData = {
  type: "SET_CLIENT";
  name: string;
  lastname: string;
  second_lastname: string;
  phones: any[];
  identities: any [],
  curp: string;
  dob: string;
  sex: [number, string];
  province_of_birth: [string, string];
  branch: [number, string];
  address: any[];
  business_data: {
    economic_activity: [string, string];
    profession: [string, string];
    business_start_date: string;
    business_name: string;
    business_owned: boolean;
    business_phone: string;
  };
  client_type: [number, string];
  country_of_birth: [string, string];
  coordinates: [number, number];
  couchdb_type: "CLIENT";
  data_company: [any];
  data_efirma: [any];
  education_level: [string, string];
  email: string;
  id_cliente: number;
  id_persona: number;
  ife_details: [any];
  ine_clave: string;
  ine_doc_number: string;
  ine_duplicates: string;
  loan_cycle: string;
  marital_status: [number, string];
  nationality: [number, string];
  not_bis: boolean;
  ocupation: [string, string];
  rfc: string;
  status: [number, string];
  tributary_regime: [string, string];
  _id?: string;
  _rev?: string;
} |
{
  type: 'RESET'
}

export interface ClientData {
    name: string;
    lastname: string;
    second_lastname: string;
    phones: any[];
    identities: any [];
    curp: string;
    dob: string;
    sex: [number, string];
    province_of_birth: [string, string];
    branch: [number, string];
    address: any[];
    business_data: {
      economic_activity: [string, string];
      profession: [string, string];
      business_start_date: string;
      business_name: string;
      business_owned: boolean;
      business_phone: string;
    };
    client_type: [number, string];
    country_of_birth: [string, string];
    coordinates: [number, number];
    couchdb_type: "CLIENT";
    data_company: [any];
    data_efirma: [any];
    education_level: [string, string];
    email: string;
    id_cliente: number;
    id_persona: number;
    ife_details: [any];
    ine_clave: string;
    ine_doc_number: string;
    ine_duplicates: string;
    loan_cycle: string;
    marital_status: [number, string];
    nationality: [number, string];
    not_bis: boolean;
    ocupation: [string, string];
    rfc: string;
    status: [number, string];
    tributary_regime: [string, string];
    _id?: string;
    _rev?: string;
}
export const clientDataDef: ClientData = {
  address:  [],
  branch: [0, ''],
  business_data: { 
    economic_activity: ['',''], 
    profession: ['',''],
    business_start_date: '',
    business_name: '',
    business_owned: false,
    business_phone: '',
  },
  client_type: [0, ''],
  coordinates: [0,0],
  couchdb_type: "CLIENT",
  country_of_birth: ['',''],
  curp: "",
  data_company: [{}],
  data_efirma: [{}],
  dob: "",
  education_level: ['', ''],
  id_cliente: 0,
  id_persona: 0,
  ife_details: [{}],
  ine_clave: "",
  ine_doc_number: "",
  ine_duplicates: "",
  email: '',
  lastname: "",
  loan_cycle: "",
  marital_status: [1, ''],
  name: "",
  nationality: [0, ''],
  not_bis: false,
  ocupation: ['', '0'],
  phones: [],
  identities: [],
  province_of_birth: ['',''],
  rfc: "",
  second_lastname: "",
  sex: [0, ''],
  status: [0, ''],
  tributary_regime: ['', ''],
  _id: "",
  _rev: ""
}

type State = ClientData;

export const ClientDataReducer = (state: State, action: ActionsClientData) => {
  switch (action.type) {
    case "SET_CLIENT":
      return {
        ...state,
        name: action.name,
        lastname: action.lastname,
        second_lastname: action.second_lastname,
        phones: action.phones,
        identities: action.identities,
        curp: action.curp,
        dob: action.dob,
        sex: action.sex,
        province_of_birth: action.province_of_birth,
        branch: action.branch,
        address: action.address,
        business_data: {
          economic_activity: action.business_data.economic_activity,
          profession: action.business_data.profession,
          business_start_date: action.business_data.business_start_date,
          business_name: action.business_data.business_name,
          business_owned: action.business_data.business_owned,
          business_phone: action.business_data.business_phone,
        },
        client_type: action.client_type,
        country_of_birth: action.country_of_birth,
        coordinates: action.coordinates,
        couchdb_type: action.couchdb_type,
        data_company: action.data_company,
        data_efirma: action.data_efirma,
        education_level: action.education_level,
        email: action.email,
        id_cliente: action.id_cliente,
        id_persona: action.id_persona,
        ife_details: action.ife_details,
        ine_clave: action.ine_clave,
        ine_doc_number: action.ine_doc_number,
        ine_duplicates: action.ine_duplicates,
        loan_cycle: action.loan_cycle,
        marital_status: action.marital_status,
        nationality: action.nationality,
        not_bis: action.not_bis,
        ocupation: action.ocupation,
        rfc: action.rfc,
        status: action.status,
        tributary_regime: action.tributary_regime,
        _id: action._id,
        _rev: action._rev
      };
    case 'RESET': 
      return {
        ...state, ...clientDataDef
      }
    default:
      return state;
  }
};
