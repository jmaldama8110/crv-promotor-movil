import { GroupMember } from "./GroupMembersReducer"

export type ActionsMember = {
    type: "SET_MEMBER",
    member: GroupMember
} |{
    type: "RESET_MEMBER"
}
export const groupMemberDef: GroupMember = {
    _id: '', // member id
    id_cliente: 0,
    id_persona: 0,
    id_member: 0,
    client_id: '', // CLIENT (couchdb_type) link to member record
    fullname: '',
    curp: '',
    position:  '',
    apply_amount: 0,
    previous_amount: 0,
    approved_amount: 0,
    loan_cycle: 0,
    disbursment_mean: 2,
    estatus: '',
    sub_estatus: '',
    dropout_reason: [0,''],
    insurance: {
        beneficiary: "",
        relationship: "",
        percentage: 100
    }

  }
export const MemberReducer = (state: GroupMember, action:ActionsMember ) => {

    switch (action.type) {
        case "SET_MEMBER":
            return {
                ...state,
                ...action.member
            }
        case "RESET_MEMBER":
            return {
                ...state,
                ...groupMemberDef
            }
        default: 
        return state;
    }

}