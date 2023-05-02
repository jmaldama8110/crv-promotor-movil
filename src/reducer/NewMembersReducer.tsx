
export type ActionsNewMembers = 
{
    type: "POPULATE_NEW_MEMBERS",
    data: NewMembersType[]
} |
{
    type: "ADD_NEW_MEMBER",
    item: NewMembersType
}

export interface NewMembersType {
    id_cliente: number;
    id_persona: number;
    fullname: string;
    member_id: string; // link to member record
    updated_at: string;
}

type State = NewMembersType[]


export const NewMembersReducer = (state: State, action: ActionsNewMembers) => {
    switch (action.type) {
      case "POPULATE_NEW_MEMBERS":
        return action.data;
      case "ADD_NEW_MEMBER":
        return [ ...state, action.item]
      default:
        return state;
    }
  };