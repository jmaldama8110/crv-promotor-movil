import { db } from "../db";

type ActionName = "CREATE_UPDATE_LOAN" | "CREATE_UPDATE_CLIENT" 

type ActionDataProperty = {
    id_loan: string;
    _id: string;
    client_name?: string;  
    id_cliente?: number;
    id_solicitud?: number;
}

export interface ActionsCouchDb {
    _id: string;
    couchdb_type: "ACTION",
    name: ActionName;
    created_at: Date;
    created_by: string;
    data: ActionDataProperty
    status: "Done" | "Pending";
}

export async function createAction (action_name:ActionName, data:ActionDataProperty, user: string){

    const action: ActionsCouchDb = {
        _id: Date.now().toString(),
        couchdb_type: "ACTION",
        name: action_name,
        created_at: new Date(),
        created_by: user,
        data,
        status: "Pending"
    }
    await db.put(action)
}