import { createContext, useReducer } from "react";
import { SessionReducer, Session, ActionsSession } from "../reducer/SessionReducer";
import { GuaranteesReducer, Guarantee, ActionsGuarantee } from "../reducer/GuaranteesReducer";

type AppContextProviderProps = {
  children: React.ReactNode
}
interface SharedContext {
  session: Session;
  dispatchSession: React.Dispatch<ActionsSession>;
  guaranteesList: Guarantee[];
  dispatchGuaranteesList: React.Dispatch<ActionsGuarantee>;
}


export const AppContext = createContext<SharedContext >({} as SharedContext);

export const AppContextProvider = ( props: AppContextProviderProps) =>{

  const sessionInit: Session = {
    name: "",
    lastname: "",
    user: "",
    current_token: "",
    token_expiration: "",
    loading: false,
    loading_msg: ''
  }
  

  const [ session, dispatchSession] = useReducer(SessionReducer,sessionInit );
  const [ guaranteesList, dispatchGuaranteesList] = useReducer( GuaranteesReducer, [] );  

  const sharedCtx: SharedContext = {
    session,
    dispatchSession,
    guaranteesList,
    dispatchGuaranteesList
  }

  return (
    <AppContext.Provider value={ {...sharedCtx}  } >
        {props.children}
    </AppContext.Provider>
  )


}
