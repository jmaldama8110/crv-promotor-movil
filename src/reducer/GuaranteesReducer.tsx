export type ActionsGuarantee =
  | {
      type: "POPULATE_GUARANTEES";
      data: Guarantee[]
    }
  | {
    type: "ADD_GUARANTEE",
    item: Guarantee
  }


export interface Guarantee {
  _id: string;
  client_id: string;
  coordinates?: [number, number];
  couchdb_type: "GUARANTEE";
  created_at: Date;
  created_by: string;
  guarantee_type: "vehicle" | "property" | "equipment"
  vehicle?: any;
  property?: any;
  equipment?: any;

}

type State = Guarantee[];

export const GuaranteesReducer = (state: State, action: ActionsGuarantee) => {
  switch (action.type) {
    case "POPULATE_GUARANTEES":
      return action.data;
    case "ADD_GUARANTEE":
      return [ ...state, action.item]
    default:
      return state;
  }
};
