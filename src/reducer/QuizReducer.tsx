
export type ActionsQuiz =
  | {
      type: "POPULATE_QUIZ";
      data: QuizElement[]
    }
  | {
    type: "UPDATE_QUIZ_CHECK",
    idx: number;
    done: boolean;
  } |{
    type: "UPDATE_QUIZ_NOTE",
    idx: number;
    note: string;
  }


export interface QuizElement {
    id: number;
    title: string;
    note?: string;
    done: boolean;
}   

type State = QuizElement[];

export const QuizReducer = (state: State, action: ActionsQuiz) => {
  switch (action.type) {
    case "POPULATE_QUIZ":
      return action.data;
    case "UPDATE_QUIZ_CHECK": 
        return state.map( (i:QuizElement) => 
        ( i.id === action.idx 
          ?   { ...i,
                done: action.done
              }: i) )
    case "UPDATE_QUIZ_NOTE": 
        return state.map( (i:QuizElement) => 
        ( i.id === action.idx 
          ?   { ...i,
                note: action.note
              }: i) )
    default:
      return state;
  }
};
