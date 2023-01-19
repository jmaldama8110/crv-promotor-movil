import { createContext, useReducer } from "react";
import { SessionReducer, Session, ActionsSession } from "../reducer/SessionReducer";
import { ClientDataReducer, ClientData, ActionsClientData, clientDataDef } from "../reducer/ClientDataReducer";
import { GuaranteesReducer, Guarantee, ActionsGuarantee } from "../reducer/GuaranteesReducer";
import { RelatedPeopleReducer, RelatedPeople, ActionsRelatedPeople } from "../reducer/RelatedpeopleReducer";

type AppContextProviderProps = {
  children: React.ReactNode
}
interface SharedContext {
  session: Session;
  dispatchSession: React.Dispatch<ActionsSession>;
  guaranteesList: Guarantee[];
  dispatchGuaranteesList: React.Dispatch<ActionsGuarantee>;
  relatedpeopleList: RelatedPeople[];
  dispatchRelatedPeople: React.Dispatch<ActionsRelatedPeople>;
  clientData: ClientData;
  dispatchClientData: React.Dispatch<ActionsClientData>;
}

export const AppContext = createContext<SharedContext >({} as SharedContext);

export const AppContextProvider = ( props: AppContextProviderProps) =>{

  const sessionInit: Session = {
    name: "",
    lastname: "",
    user: "",
    branch: [0,""],
    current_token: "",
    token_expiration: "",
    loading: false,
    loading_msg: ''
  }
 
  

  const [ session, dispatchSession] = useReducer(SessionReducer,sessionInit );
  const [ guaranteesList, dispatchGuaranteesList] = useReducer( GuaranteesReducer, [] );  
  const [ relatedpeopleList, dispatchRelatedPeople] = useReducer( RelatedPeopleReducer, [] ); 
  const [ clientData, dispatchClientData] = useReducer( ClientDataReducer,clientDataDef) 

  const sharedCtx: SharedContext = {
    session,
    dispatchSession,
    guaranteesList,
    dispatchGuaranteesList,
    relatedpeopleList,
    dispatchRelatedPeople,
    clientData,
    dispatchClientData
  }

  return (
    <AppContext.Provider value={ {...sharedCtx}  } >
        {props.children}
    </AppContext.Provider>
  )


}
