export type ActionsRelatedPeople =
  | {
      type: "POPULATE_RP";
      data: RelatedPeople[]
    }
  | {
    type: "ADD_RP",
    item: RelatedPeople
  }


export interface RelatedPeople {
  _id: string;
  client_id: string;
  coordinates?: [number, number];
  couchdb_type: "RELATED-PEOPLE";
  relation_type: "guarantor"|"beneficiary"|"reference",
  created_at: Date;
  created_by: string;
  status: [number, string],

  name: string;
  lastname: string;
  second_lastname: string;
  fullname: string;
  phone?: string;
  phone_verified?: boolean;
  curp?: string;
  address?: string;
  relationship: string;
  percentage?: string;

}

type State = RelatedPeople[];

export const RelatedPeopleReducer = (state: State, action: ActionsRelatedPeople) => {
  switch (action.type) {
    case "POPULATE_RP":
      return action.data;
    case "ADD_RP":
      return [ ...state, action.item]
    default:
      return state;
  }
};
