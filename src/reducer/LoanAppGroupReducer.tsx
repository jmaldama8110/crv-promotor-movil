import { DroupOutType } from "./DropoutReducer";
import { GroupMember } from "./GroupMembersReducer";

export type ActionsLoanAppGroup =
  | {
      type: "SET_LOAN_APP_GROUP";
      _id: string;
      apply_by: string;
      id_cliente: string;
      id_solicitud: string;
      loan_officer: string;
      branch: string;
      id_producto: string;
      id_disposicion: string;
      apply_amount: number;
      approved_total: number;
      term: number;
      frequency: [string, string];
      first_repay_date: string;
      disbursment_date: string
      disbursment_mean: number;
      liquid_guarantee: number;
      loan_cycle: string;
      created_by: string; 
      created_at: string;
      estatus: string;
      sub_estatus: string;
      members: GroupMember [];
      dropout: DroupOutType[];
      product: {
        external_id: number;
        min_amount: number;
        max_amount: number;
        step_amount: number;
        min_term: number;
        max_term: number;
        product_name: string;
        term_types: any[];
        rate: number;
        tax: number;
      }
      coordinates: [number, number];
    } |
    {
      type: 'RESET_LOAN_APP_GROUP';
    }

export interface TermType {
      identifier: string;
      value: string;
      year_periods: string;
  }

export interface LoanAppGroup{
    _id: string;
    couchdb_type: 'LOANAPP_GROUP',
    apply_by: string;
    renovation: boolean;
    GL_financeable: boolean;
    id_cliente: string;
    id_solicitud: string;
    loan_officer: string;
    branch: string;
    id_producto: string;
    id_disposicion: string;
    apply_amount: number;
    approved_total: number;
    term: number;
    frequency: [string, string];
    first_repay_date: string;
    disbursment_date: string;
    disbursment_mean: number;
    liquid_guarantee: number;
    loan_cycle: string;
    created_by: string; 
    created_at: string;
    estatus: string;
    sub_estatus: string;
    members: GroupMember [];
    dropout: DroupOutType[],
    product: {
      external_id: number;
      min_amount: number;
      max_amount: number;
      step_amount: number;
      min_term: number;
      max_term: number;
      product_name: string;
      term_types: any[];
      rate: number;
      tax: number;
    }
    coordinates: [number, number];
}

export const loanAppGroupDef: LoanAppGroup = {
  _id: "",
  couchdb_type: 'LOANAPP_GROUP',
  renovation: true,
  GL_financeable: false,
  apply_by: "",
  id_cliente: "",
  id_solicitud: "",
  loan_officer: "",
  branch: "",
  id_producto: "",
  id_disposicion: "",
  apply_amount: 0,
  approved_total: 0,
  term: 0,
  frequency: ["", ""],
  first_repay_date: "",
  disbursment_date: '',
  disbursment_mean: 0,
  liquid_guarantee: 10,
  loan_cycle: "",
  created_by: "", 
  created_at: "",
  estatus: "",
  sub_estatus: "",
  members: [],
  dropout: [],
  product: {
    external_id: 0,
    min_amount: 1000,
    max_amount: 1000000,
    step_amount: 1000,
    min_term: 1,
    max_term: 99,
    product_name: "",
    term_types: [],
    rate: 12,
    tax: 0.16,
  },
  coordinates: [0, 0]
}


type State = LoanAppGroup;

export const LoanAppGroupReducer = (state: State, action: ActionsLoanAppGroup) => {
  switch (action.type) {
    case "SET_LOAN_APP_GROUP":
      return {
        ...state,
       _id: action._id,
       apply_by: action.apply_by,
       id_cliente: action.id_cliente,
       id_solicitud: action.id_solicitud,
       loan_officer: action.loan_officer,
       branch: action.branch,
       id_producto: action.id_producto,
       id_disposicion: action.id_disposicion,
       apply_amount: action.apply_amount,
       approved_total: action.approved_total,
       term: action.term,
       frequency: action.frequency,
       first_repay_date: action.first_repay_date,
       disbursment_date: action.disbursment_date,
       disbursment_mean: action.disbursment_mean,
       liquid_guarantee: action.liquid_guarantee,
       loan_cycle: action.loan_cycle,
       created_by: action.created_by, 
       created_at: action.created_at,
       estatus: action.estatus,
       sub_estatus: action.sub_estatus,
       members: action.members,
       dropout: action.dropout,
       product: {
          external_id: action.product.external_id,
          min_amount: action.product.min_amount,
          max_amount: action.product.max_amount,
          step_amount: action.product.step_amount,
          min_term: action.product.min_term,
          max_term: action.product.max_term,
          product_name: action.product.product_name,
          term_types: action.product.term_types,
          rate: action.product.rate,
          tax: action.product.tax
       },
       coordinates: action.coordinates

      };
    case "RESET_LOAN_APP_GROUP": 
      return {
        ...state,
        ...loanAppGroupDef
      }

    default:
      return state;
  }
};
