
export type ActionsGroupMember =
  | {
      type: "POPULATE_GROUP_MEMBERS";
      data: GroupMember[]
    }
  | {
    type: "ADD_GROUP_MEMBER",
    item: GroupMember
  }
  |{
    type: "UPDATE_GROUP_MEMBER",
    idx: string;
    position: string;
    apply_amount: number;
    beneficiary: string;
    relationship: string;
    percentage: number;
    estatus: string;
    sub_estatus: string;
    dropout_reason: [number, string],
    disbursment_mean: 1 | 2;
  }
  
export interface GroupMember {
  _id: string; // member id
  id_cliente: number;
  id_persona: number;
  id_member: number;
  client_id: string; // CLIENT (couchdb_type) link to member record
  fullname: string;
  curp: string;
  position:  string;
  apply_amount: number,
  previous_amount: number,
  approved_amount: number,
  loan_cycle: number,
  disbursment_mean: 1 | 2,
  estatus: string;
  sub_estatus: string;
  dropout_reason: [number, string],
  insurance: {
    id?:number;
    beneficiary: string;
    relationship: string;
    percentage: number;
  }
}


type State = GroupMember[];

export const GroupMembersReducer = (state: State, action: ActionsGroupMember) => {
  switch (action.type) {
    case "POPULATE_GROUP_MEMBERS":
      return action.data;
    case "ADD_GROUP_MEMBER":
      return [ ...state, action.item]
    case "UPDATE_GROUP_MEMBER": 
        return state.map( (i:GroupMember) => 
        ( i._id === action.idx 
          ?   { ...i,
                position: action.position,
                apply_amount: action.apply_amount,
                disbursment_mean: action.disbursment_mean,
                estatus: action.estatus,
                sub_estatus: action.sub_estatus,
                dropout_reason: action.dropout_reason,
                insurance: {
                  ...i.insurance,
                  beneficiary: action.beneficiary,
                  relationship: action.relationship,
                  percentage: action.percentage
                }
              }: i) )
    default:
      return state;
  }
};
