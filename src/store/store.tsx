import { createContext, useReducer } from "react";
import { SessionReducer, Session, Actions } from "../reducer/SessionReducer";

type AppContextProviderProps = {
  children: React.ReactNode
}
interface SharedContext {
  session: Session;
  dispatchSession: React.Dispatch<Actions>;
}

export const AppContext = createContext<SharedContext >({} as SharedContext);

export const AppContextProvider = ( props: AppContextProviderProps) =>{

  const sessionInit: Session = {
    name: '',
    lastname: '',
    user: '',
    current_token: '',
    loading: false,
    loading_msg: ''
  }
  const [ session, dispatchSession] = useReducer(SessionReducer,sessionInit )
  
  const sharedCtx: SharedContext = {
    session,
    dispatchSession
  }

  return (
    <AppContext.Provider value={ {...sharedCtx}  } >
        {props.children}
    </AppContext.Provider>
  )


}
