import PouchDB from 'pouchdb';
const SYNC_ID = '1001'
const DOC_TYPE = 'SYNCS'
export class Sync {
    
    _id: string = SYNC_ID;
    user: string = 'master';
    last_sync?: Date;
    
    constructor(){
        const db = new PouchDB('test');
        db.info().then(function (info) {
            console.log('Localdatabase created...',info.db_name);
            
            db.get(SYNC_ID).then( (data)=> {
                /// sync data found, load data
                console.log('sync found:',data);
                           
                
            }).catch( e =>{
                /// when sync not found, then try to PUT
                db.put({ _id: SYNC_ID,
                    type: DOC_TYPE,
                    data: {
                        last_sync: '',
                        user: '',
                        branches: ['oriente','teran','merida pte'], 
                    }
                }).then(doc =>{
                    /// creation of the new sync data
                    console.log('not found, so created...',doc)
                }).catch(e => {
                    console.log(e);
                })
            })

        }).catch( err => {
            console.log(err);
        })  
    }

    SetUpReplication () {

    }

    

}



