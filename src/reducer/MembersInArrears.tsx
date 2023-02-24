
export type ActionsMembersInArrears =
  | {
      type: "POPULATE_MEMBERS_INARREARS";
      data: MemberInArrears[]
    }
  | {
    type: "UPDATE_MEMBER_INARREARS_CHECK",
    idx: string;
    is_in_arrears: boolean;
  } |{
    type: "UPDATE_MEMBER_INARREARS_AMT",
    idx: string;
    arrears_amount: string;
  }
  
export interface MemberInArrears {
  _id: string; // member id  
  client_id: string; // CLIENT (couchdb_type) link to member record
  fullname: string;
  arrears_amount: string;
  is_in_arrears: boolean;
}

type State = MemberInArrears[];

export const MembersInArreasReducer = (state: State, action: ActionsMembersInArrears) => {
  switch (action.type) {
    case "POPULATE_MEMBERS_INARREARS":
      return action.data;
    case "UPDATE_MEMBER_INARREARS_CHECK": 
        return state.map( (i:MemberInArrears) => 
        ( i._id === action.idx 
          ?   { ...i,
                is_in_arrears: action.is_in_arrears
              }: i) )
    case "UPDATE_MEMBER_INARREARS_AMT": 
        return state.map( (i:MemberInArrears) => 
        ( i._id === action.idx 
          ?   { ...i,
                arrears_amount: action.arrears_amount
              }: i) )
    default:
      return state;
  }
};
