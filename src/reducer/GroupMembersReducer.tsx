
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
    position: [number, string];
  }
  
export interface GroupMember {
  _id: string;
  id_cliente: number;
  id_persona: number;
  client_id: string;
  fullname: string;
  position: [number, string];
  created_at: Date;
  created_by: string;

}

type State = GroupMember[];

export const GuaranteesReducer = (state: State, action: ActionsGroupMember) => {
  switch (action.type) {
    case "POPULATE_GROUP_MEMBERS":
      return action.data;
    case "ADD_GROUP_MEMBER":
      return [ ...state, action.item]
    case "REMOVE_GROUP_MEMBER":
        return state.filter( (i:GroupMember)=> (i._id === action.idx))
    case "UPDATE_GROUP_MEMBER": 
        return state.map( (i:GroupMember) => ( i._id === action.idx ? { ...i, position: action.position }: i) )
    default:
      return state;
  }
};
