export interface DocumentIdProperties { 
  age: string;
  voter_key: string;
  nationality: string;          
  expiration_date: string;
  doc_number: string;
  folio_number: string;
  dob: string;
  ocr_number: string;
  sex: string;
  lastname: string;
  second_lastname: string;
  name: string;
  duplicates: string;
  curp: string;
  street_address: string;
  suburb_address: string;
}

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
    bis_location: [number, string];  // new
    economic_activity: [string, string];
    profession: [string, string];
    ocupation: [string, string];
    business_start_date: string;
    business_name: string;
    business_owned: boolean;
    business_phone: string;
    number_employees: number;
    loan_destination: [number,string];
    income_sales_total: number;
    income_partner: number;
    income_job: number;
    income_remittances: number;
    income_other: number;
    income_total: number;
    expense_family: number;
    expense_rent: number;
    expense_business: number;
    expense_debt: number;
    expense_credit_cards: number;
    expense_total: number;
    keeps_accounting_records: boolean;
    has_previous_experience: boolean;
    previous_loan_experience: string;
    bis_season_type: string;
    bis_quality_sales_monthly: {
      month_sale_jan: string;
      month_sale_feb: string;
      month_sale_mar: string;
      month_sale_apr: string;
      month_sale_may: string;
      month_sale_jun: string;
      month_sale_jul: string;
      month_sale_aug: string;
      month_sale_sep: string;
      month_sale_oct: string;
      month_sale_nov: string;
      month_sale_dic: string;
    }

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
  clave_ine: string;
  numero_vertical: string;
  numero_emisiones: string;
  loan_cycle: number;
  marital_status: [number, string];
  nationality: [number, string];
  rfc: string;
  status: [number, string];
  household_floor: boolean;
  household_roof: boolean;
  household_toilet: boolean;
  household_latrine: boolean;
  household_brick: boolean;
  economic_dependants: number;
  internet_access: boolean;

  prefered_social: [number,string]; // new
  user_social: string;
  rol_hogar: [number, string];  // new
  has_disable: boolean;
  speaks_dialect: boolean;
  has_improved_income: boolean;

  spld: {  // new
    desempenia_funcion_publica_cargo: string,
    desempenia_funcion_publica_dependencia: string,
    familiar_desempenia_funcion_publica_cargo: string,
    familiar_desempenia_funcion_publica_dependencia: string,
    familiar_desempenia_funcion_publica_nombre: string,
    familiar_desempenia_funcion_publica_paterno: string,
    familiar_desempenia_funcion_publica_materno: string,
    familiar_desempenia_funcion_publica_parentesco: string,
    instrumento_monetario: [number, string],
  }

  comment: string;
  identity_pics: any[];
  identity_verification: {
    uuid: string;
    status: "sent" | "pending";
    result: "ok" | "waiting" | "fail";
    documentData: DocumentIdProperties;
    created_at: string;
    updated_at: string;
  };
  comprobante_domicilio_pics: any[];
  _id?: string;
  _rev?: string;
} |
{
  type: 'RESET_CLIENT'
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
      bis_location: [number, string];  // new
      economic_activity: [string, string];
      profession: [string, string];
      ocupation: [string, string];
      business_start_date: string;
      business_name: string;
      business_owned: boolean;
      business_phone: string;
      number_employees: number;
      loan_destination: [number,string];
      income_sales_total: number;
      income_partner: number;
      income_job: number;
      income_remittances: number;
      income_other: number;
      income_total: number;
      expense_family: number;
      expense_rent: number;
      expense_business: number;
      expense_debt: number;
      expense_credit_cards: number;
      expense_total: number;
      keeps_accounting_records: boolean;
      has_previous_experience: boolean;
      previous_loan_experience: string;
      bis_season_type: string;
      bis_quality_sales_monthly: {
        month_sale_jan: string;
        month_sale_feb: string;
        month_sale_mar: string;
        month_sale_apr: string;
        month_sale_may: string;
        month_sale_jun: string;
        month_sale_jul: string;
        month_sale_aug: string;
        month_sale_sep: string;
        month_sale_oct: string;
        month_sale_nov: string;
        month_sale_dic: string;
      }

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
    clave_ine: string;
    numero_vertical: string;
    numero_emisiones: string;
    loan_cycle: number;
    marital_status: [number, string];
    nationality: [number, string];
    rfc: string;
    status: [number, string];
    household_floor: boolean;
    household_roof: boolean;
    household_toilet: boolean;
    household_latrine: boolean;
    household_brick: boolean;
    economic_dependants: number;
    internet_access: boolean;

    prefered_social: [number,string]; // new
    user_social: string;
    rol_hogar: [number, string];  // new
    has_disable: boolean;
    speaks_dialect: boolean;
    has_improved_income: boolean;
  
    spld: {  // new
      desempenia_funcion_publica_cargo: string,
      desempenia_funcion_publica_dependencia: string,
      familiar_desempenia_funcion_publica_cargo: string,
      familiar_desempenia_funcion_publica_dependencia: string,
      familiar_desempenia_funcion_publica_nombre: string,
      familiar_desempenia_funcion_publica_paterno: string,
      familiar_desempenia_funcion_publica_materno: string,
      familiar_desempenia_funcion_publica_parentesco: string,
      instrumento_monetario: [number, string],
    }
  
    comment: string;
    identity_pics: any[];
    
    identity_verification: {
      uuid: string;
      status: "sent" | "pending";
      result: "ok" | "waiting" | "fail";
      created_at: string;
      updated_at: string;
      documentData: DocumentIdProperties;
    };
    comprobante_domicilio_pics: any[];  
    _id?: string;
    _rev?: string;
}
export const clientDataDef: ClientData = {
  address:  [],
  branch: [0, ''],
  business_data: {
    bis_location: [0,""],
    economic_activity: ['',''], 
    profession: ['',''],
    ocupation: ["", ""],
    business_start_date: '',
    business_name: '',
    business_owned: false,
    business_phone: '',
    number_employees: 0,
    loan_destination: [0,''],
    income_sales_total: 0,
    income_partner: 0,
    income_job: 0,
    income_remittances: 0,
    income_other: 0,
    income_total: 0,
    expense_family: 0,
    expense_rent: 0,
    expense_business: 0,
    expense_debt: 0,
    expense_credit_cards: 0,
    expense_total: 0,
    keeps_accounting_records: false,
    has_previous_experience: false,
    previous_loan_experience: '',
    bis_season_type: '',
    bis_quality_sales_monthly: {
      month_sale_jan: '',
      month_sale_feb: '',
      month_sale_mar: '',
      month_sale_apr: '',
      month_sale_may: '',
      month_sale_jun: '',
      month_sale_jul: '',
      month_sale_aug: '',
      month_sale_sep: '',
      month_sale_oct: '',
      month_sale_nov: '',
      month_sale_dic: '',
    }

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
  clave_ine: "",
  numero_vertical: "",
  numero_emisiones: "",
  email: '',
  lastname: "",
  loan_cycle: 0,
  marital_status: [1, ''],
  name: "",
  nationality: [0, ''],
  phones: [],
  identities: [],
  province_of_birth: ['',''],
  rfc: "",
  second_lastname: "",
  sex: [0, ''],
  status: [0, ''],
  
  household_floor: false,
  household_roof: false,
  household_toilet: false,
  household_latrine: false,
  household_brick: false,
  economic_dependants: 0,
  internet_access: false,
  prefered_social: [0,""],
  rol_hogar: [0,""],
  user_social: '',
  has_disable: false,
  speaks_dialect: false,
  has_improved_income: false,

  spld: {
    desempenia_funcion_publica_cargo: "",
    desempenia_funcion_publica_dependencia: "",
    familiar_desempenia_funcion_publica_cargo: "",
    familiar_desempenia_funcion_publica_dependencia: "",
    familiar_desempenia_funcion_publica_nombre: "",
    familiar_desempenia_funcion_publica_paterno: "",
    familiar_desempenia_funcion_publica_materno: "",
    familiar_desempenia_funcion_publica_parentesco: "",
    instrumento_monetario: [0, ""],
    
  },
  comment: '',
  identity_pics: [],
  identity_verification: {
    uuid: '',
    status: 'pending',
    result: 'waiting',
    created_at: '',
    updated_at: '',
    documentData: {
      age: '',
      voter_key: '',
      nationality: '',
      name: '',
      lastname: '',
      second_lastname: '',
      dob: '',
      doc_number: '',
      duplicates: '',
      expiration_date: '',
      folio_number: '',
      ocr_number: '',
      sex: '',
      curp: '',
      street_address: '',
      suburb_address: ''
    }
  },
  comprobante_domicilio_pics: [],
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
          bis_location: action.business_data.bis_location,
          economic_activity: action.business_data.economic_activity,
          profession: action.business_data.profession,
          ocupation: action.business_data.ocupation,
          business_start_date: action.business_data.business_start_date,
          business_name: action.business_data.business_name,
          business_owned: action.business_data.business_owned,
          business_phone: action.business_data.business_phone,
          number_employees: action.business_data.number_employees,
          loan_destination: action.business_data.loan_destination,
          income_sales_total: action.business_data.income_sales_total,
          income_partner: action.business_data.income_partner,
          income_job: action.business_data.income_job,
          income_remittances: action.business_data.income_remittances,
          income_other: action.business_data.income_other,
          income_total: action.business_data.income_total,
          expense_family: action.business_data.expense_family,
          expense_rent: action.business_data.expense_rent,
          expense_business: action.business_data.expense_business,
          expense_debt: action.business_data.expense_debt,
          expense_credit_cards: action.business_data.expense_credit_cards,
          expense_total: action.business_data.expense_total,
          keeps_accounting_records: action.business_data.keeps_accounting_records,
          has_previous_experience: action.business_data.has_previous_experience,
          previous_loan_experience: action.business_data.previous_loan_experience,
          bis_season_type: action.business_data.bis_season_type,
          bis_quality_sales_monthly: {
            month_sale_jan: action.business_data.bis_quality_sales_monthly.month_sale_jan,
            month_sale_feb: action.business_data.bis_quality_sales_monthly.month_sale_feb,
            month_sale_mar: action.business_data.bis_quality_sales_monthly.month_sale_mar,
            month_sale_apr: action.business_data.bis_quality_sales_monthly.month_sale_apr,
            month_sale_may: action.business_data.bis_quality_sales_monthly.month_sale_may,
            month_sale_jun: action.business_data.bis_quality_sales_monthly.month_sale_jun,
            month_sale_jul: action.business_data.bis_quality_sales_monthly.month_sale_jul,
            month_sale_aug: action.business_data.bis_quality_sales_monthly.month_sale_aug,
            month_sale_sep: action.business_data.bis_quality_sales_monthly.month_sale_sep,
            month_sale_oct: action.business_data.bis_quality_sales_monthly.month_sale_oct,
            month_sale_nov: action.business_data.bis_quality_sales_monthly.month_sale_nov,
            month_sale_dic: action.business_data.bis_quality_sales_monthly.month_sale_dic,
          }


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
        clave_ine: action.clave_ine,
        numero_vertical: action.numero_vertical,
        numero_emisiones: action.numero_emisiones,
        loan_cycle: action.loan_cycle,
        marital_status: action.marital_status,
        nationality: action.nationality,
        rfc: action.rfc,
        status: action.status,
        household_floor: action.household_floor,
        household_roof: action.household_roof,
        household_toilet: action.household_toilet,
        household_latrine: action.household_latrine,
        household_brick: action.household_brick,
        economic_dependants: action.economic_dependants,
        internet_access: action.internet_access,
        prefered_social: action.prefered_social,
        user_social: action.user_social,
        rol_hogar: action.rol_hogar,
        has_disable: action.has_disable,
        speaks_dialect: action.speaks_dialect,
        has_improved_income: action.has_improved_income,
        spld: {
          desempenia_funcion_publica_cargo: action.spld.desempenia_funcion_publica_cargo,
          desempenia_funcion_publica_dependencia: action.spld.desempenia_funcion_publica_dependencia,
          familiar_desempenia_funcion_publica_cargo: action.spld.familiar_desempenia_funcion_publica_cargo,
          familiar_desempenia_funcion_publica_dependencia: action.spld.familiar_desempenia_funcion_publica_dependencia,
          familiar_desempenia_funcion_publica_nombre: action.spld.familiar_desempenia_funcion_publica_nombre,
          familiar_desempenia_funcion_publica_paterno: action.spld.familiar_desempenia_funcion_publica_paterno,
          familiar_desempenia_funcion_publica_materno: action.spld.familiar_desempenia_funcion_publica_materno,
          familiar_desempenia_funcion_publica_parentesco: action.spld.familiar_desempenia_funcion_publica_parentesco,
          instrumento_monetario: action.spld.instrumento_monetario,
         },
        comment: action.comment,
        identity_pics: action.identity_pics,
        identity_verification: action.identity_verification,
        comprobante_domicilio_pics: action.comprobante_domicilio_pics,
        _id: action._id,
        _rev: action._rev
      };
    case 'RESET_CLIENT': 
      return {
        ...state, ...clientDataDef
      }
    default:
      return state;
  }
};
