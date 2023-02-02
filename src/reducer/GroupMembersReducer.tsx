
export type ActionsGroupMember =
  | {
      type: "POPULATE_GROUP_MEMBERS";
      data: GroupMember[]
    }
  | {
    type: "ADD_GROUP_MEMBER",
    item: GroupMember
  }
  | {
    type: "REMOVE_GROUP_MEMBER",
    idx: string; // member id
  }
  |{
    type: "UPDATE_GROUP_MEMBER",
    idx: string;
    position: string;
    apply_amount: string;
    beneficiary: string;
    relationship: string;
    percentage: number;
    disbursment_mean: 1 | 2;
  }
  
export interface GroupMember {
  _id: string; // member id
  id_cliente: number;
  id_persona: number;
  client_id: string; // CLIENT (couchdb_type) link to member record
  fullname: string;
  curp: string;
  position:  string;
  apply_amount: string,
  previous_amount: string,
  approved_amount: string,
  loan_cycle: number,
  disbursment_mean: 1 | 2,
  insurance: {
    beneficiary: string,
    relationship: string,
    percentage: number
  },
}


type State = GroupMember[];

export const GroupMembersReducer = (state: State, action: ActionsGroupMember) => {
  switch (action.type) {
    case "POPULATE_GROUP_MEMBERS":
      return action.data;
    case "ADD_GROUP_MEMBER":
      return [ ...state, action.item]
    case "REMOVE_GROUP_MEMBER":
        return state.filter( (i:GroupMember)=> (i._id === action.idx))
    case "UPDATE_GROUP_MEMBER": 
        return state.map( (i:GroupMember) => 
        ( i._id === action.idx 
          ?   { ...i,
                position: action.position,
                apply_amount: action.apply_amount,
                disbursment_mean: action.disbursment_mean,
                insurance: { 
                  beneficiary: action.beneficiary,
                  relationship: action.relationship,
                  percentage: action.percentage
                }
              }: i) )
    default:
      return state;
  }
};
