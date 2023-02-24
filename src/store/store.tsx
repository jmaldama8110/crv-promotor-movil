import { createContext, useReducer } from "react";
import { SessionReducer, Session, ActionsSession } from "../reducer/SessionReducer";
import { ClientDataReducer, ClientData, ActionsClientData, clientDataDef } from "../reducer/ClientDataReducer";
import { GuaranteesReducer, Guarantee, ActionsGuarantee } from "../reducer/GuaranteesReducer";
import { RelatedPeopleReducer, RelatedPeople, ActionsRelatedPeople } from "../reducer/RelatedpeopleReducer";
import { ActionsGroupData, GroupData, groupDataDef, GroupDataReducer } from "../reducer/GroupDataReducer";
import { ActionsLoanAppGroup, LoanAppGroup, loanAppGroupDef, LoanAppGroupReducer } from "../reducer/LoanAppGroupReducer";
import { ActionsGroupMember, GroupMember, GroupMembersReducer } from "../reducer/GroupMembersReducer";
import { ActionsMember, MemberReducer,groupMemberDef } from "../reducer/GroupMemberReducer";
import { ActionsDropout, DropoutReducer, DroupOutType } from "../reducer/DropoutReducer";
import { ActionsClientVerification, ClientVerification, clientVerificationDefault, ClientVerificationReducer } from "../reducer/ClientVerificationReducer";
import { ActionsMembersInArrears, MemberInArrears, MembersInArreasReducer } from "../reducer/MembersInArrears";

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
  groupData: GroupData;
  dispatchGroupData: React.Dispatch<ActionsGroupData>;

  loanAppGroup: LoanAppGroup;
  dispatchLoanAppGroup: React.Dispatch<ActionsLoanAppGroup>;

  groupMemberList: GroupMember[];
  dispatchGroupMember: React.Dispatch<ActionsGroupMember>;

  groupMember: GroupMember;
  dispatchMember: React.Dispatch<ActionsMember>;

  dropoutMembers: DroupOutType[];
  dispatchDropoutMembers: React.Dispatch<ActionsDropout>;

  clientVerification: ClientVerification;
  dispatchClientVerification: React.Dispatch<ActionsClientVerification>;

  membersInArrears: MemberInArrears[];
  dispatchMembersInArrears: React.Dispatch<ActionsMembersInArrears>;

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
  const [ clientData, dispatchClientData] = useReducer( ClientDataReducer,clientDataDef);
  const [ groupData, dispatchGroupData] = useReducer( GroupDataReducer, groupDataDef);
  const [ loanAppGroup, dispatchLoanAppGroup] = useReducer( LoanAppGroupReducer, loanAppGroupDef);
  const [ groupMemberList, dispatchGroupMember] = useReducer( GroupMembersReducer, []);
  const [ groupMember, dispatchMember] = useReducer(MemberReducer, groupMemberDef);
  const [ dropoutMembers, dispatchDropoutMembers] = useReducer( DropoutReducer, []);
  const [clientVerification, dispatchClientVerification] = useReducer(ClientVerificationReducer, clientVerificationDefault);
  const [membersInArrears, dispatchMembersInArrears ] = useReducer(MembersInArreasReducer, []);
  const sharedCtx: SharedContext = {
    session,
    dispatchSession,
    guaranteesList,
    dispatchGuaranteesList,
    relatedpeopleList,
    dispatchRelatedPeople,
    clientData,
    dispatchClientData,
    groupData,
    dispatchGroupData,
    loanAppGroup,
    dispatchLoanAppGroup,
    groupMemberList,
    dispatchGroupMember,
    groupMember,
    dispatchMember,
    dropoutMembers,
    dispatchDropoutMembers,
    clientVerification,
    dispatchClientVerification,
    membersInArrears,
    dispatchMembersInArrears
  }
  

  return (
    <AppContext.Provider value={ {...sharedCtx}  } >
        {props.children}
    </AppContext.Provider>
  )


}
