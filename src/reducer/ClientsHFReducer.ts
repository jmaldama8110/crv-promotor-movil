export type Actions =
  | {
      type: "POPULATE";
      data: []
    };

export interface ClientHf {
  name: string;
  lastname: string;
  second_lastname: string;
  curp: string;
}

type State = ClientHf[];

export const ClientsHfReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case "POPULATE":
      return [
        ...state,
        action.data
      ];
    default:
      return state;
  }
};
