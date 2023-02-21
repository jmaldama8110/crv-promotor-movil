export type ActionsGroupData =
  | {
      type: "SET_GROUP_DATA";
      _id: string;
      group_name: string;
      id_cliente: string;
      weekday_meet: string;
      hour_meet: string;
      branch: [number, string];
      loan_officer: number;
      loan_cycle: number;
      address: {
        post_code: string;
        address_line1: string;
        road_type?: [number, string];
        province: [string, string];
        municipality: [string, string];
        city:[ string, string];
        colony: [string, string];
        address_line2?: string;
        street_reference: string;  
      },
      
      status: [number, ""];
    }|
    {
      type: 'RESET_GROUP_DATA';
    }

export interface GroupData{
    _id: string;
    id_cliente: string;
    group_name: string;
    weekday_meet: string;
    hour_meet: string;
    branch: [number, string];
    loan_officer: number;
    loan_cycle: number;
    address: {
      post_code: string;
      address_line1: string;
      road_type?: [number, string];
      province: [string, string];
      municipality: [string, string];
      city:[ string, string];
      colony: [string, string];
      address_line2?: string;
      street_reference: string;
    },
    status: [number, string];
}

export const groupDataDef: GroupData = {
    _id: "",
    group_name: "",
    id_cliente: "",
    weekday_meet: "",
    hour_meet: "",
    branch: [0, ""],
    loan_officer: 0,
    loan_cycle: 0,
    address: {
      post_code: "",
      address_line1: "",
      road_type: [0, ""],
      province: ["", ""],
      municipality: ["", ""],
      city:[ "", ""],
      colony: ["", ""],
      address_line2: "",
      street_reference: ""     
    },
    
    status: [0,""],
}


type State = GroupData;

export const GroupDataReducer = (state: State, action: ActionsGroupData) => {
  switch (action.type) {
    case "SET_GROUP_DATA":
      return {
        ...state,
        _id: action._id,
        group_name: action.group_name,
        id_cliente: action.id_cliente,
        weekday_meet: action.weekday_meet,
        hour_meet: action.hour_meet,
        branch: action.branch,
        loan_officer: action.loan_officer,
        loan_cycle: action.loan_cycle,
        address: {
            post_code: action.address.post_code,
            address_line1: action.address.address_line1,
            addres_line2: action.address.address_line2,
            road_type: action.address.road_type,
            colony: action.address.colony,
            province: action.address.province,
            municipality: action.address.municipality,
            city: action.address.city,
            street_reference: action.address.street_reference
        },
        status: action.status,
      };
    case "RESET_GROUP_DATA": 
      return {
        ...state,
        ...groupDataDef
      }

    default:
      return state;
  }
};
