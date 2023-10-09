
export type ActionsUpdatesLog =
  | {
      type: "POPULATE_UPDATE_LOGS";
      data: UpdateLog[]
    }
  | {
    type: "ADD_UPDATE_LOG",
    item: UpdateLog
  }
  |
  {
    type: "REMOVE_UPDATE_LOG",
    idx: string
  }
  | {
    type: "UPDATE_UPDATE_LOG",
    idx: string; // update log id
    status: "Done" | "Pending";
    isOk: boolean,
    errors: any[];
    hf_info?: {
      client_name: string | undefined;
      hf_client_id: number | undefined;
      hf_application_id: number | undefined;
    }
  }
  
  
export interface UpdateLog {
  _id: string;
  name: string, 
  status: "Done" | "Pending", // pending | done
  isOk: boolean;
  hf_info?: {
    client_name: string | undefined;
    hf_client_id: number | undefined;
    hf_application_id: number | undefined;
  }
  errors?: any[]; // thrown errors by validation
}


type State = UpdateLog[];

export const UpdatesLogReducer = (state: State, action: ActionsUpdatesLog) => {
  switch (action.type) {
    case "POPULATE_UPDATE_LOGS":
      return action.data;
    case "ADD_UPDATE_LOG":
      return [ ...state, action.item]
    case "REMOVE_UPDATE_LOG":
      return state.filter( (x:UpdateLog) => x._id !== action.idx)
    case "UPDATE_UPDATE_LOG": 
        return state.map( (i:UpdateLog) => 
        ( i._id === action.idx 
          ?   { ...i,
                status: action.status,
                isOk: action.isOk,
                errors: action.errors,
                hf_info: {
                  client_name: action.hf_info?.client_name,
                  hf_client_id: action.hf_info?.hf_client_id,
                  hf_application_id: action.hf_info?.hf_application_id
                }
              }: i) )
    default:
      return state;
  }
};
