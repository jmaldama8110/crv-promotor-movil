

export type ActionsDropout =
  | {
      type: "POPULATE_DROPOUTS";
      data: DroupOutType[]
    }
  | {
    type: "ADD_DROPOUT",
    item: DroupOutType
  }
  

export interface DroupOutType {
    id_cliente: number;
    id_persona: number;
    fullname: string;
    member_id: string; // link to member record
    reasonType: string;
    dropoutReason: [number, string];
    updated_at: string;
}

type State = DroupOutType[];

export const DropoutReducer = (state: State, action: ActionsDropout) => {
  switch (action.type) {
    case "POPULATE_DROPOUTS":
      return action.data;
    case "ADD_DROPOUT":
      return [ ...state, action.item]
    default:
      return state;
  }
};
