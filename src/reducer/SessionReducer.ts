export type Actions =
  | {
      type: "LOGIN";
      name: string;
      lastname: string;
      user: string;
      current_token: string;
    }
  | {
    type: "SET_LOADING",
    loading: boolean;
    loading_msg: string;
  };

export interface Session {
  name: string;
  lastname: string;
  user: string;
  current_token: string;
  loading: boolean;
  loading_msg: string;
}

type State = Session;

export const SessionReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        name: action.name,
        lastname: action.lastname,
        user: action.user,
        current_token: action.current_token,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
        loading_msg: action.loading_msg
      };
    default:
      return state;
  }
};
