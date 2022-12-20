
import PouchDB from 'pouchdb';
PouchDB.plugin( require('pouchdb-find').default);

export const db = new PouchDB('sample');

export const remoteDB = new PouchDB(`${process.env.REACT_APP_COUCHDB_PROTOCOL}://${process.env.REACT_APP_COUCHDB_USER}:${process.env.REACT_APP_COUCHDB_PASS}@${process.env.REACT_APP_COUCHDB_HOST}:${process.env.REACT_APP_COUCHDB_PORT}/${process.env.REACT_APP_COUCHDB_NAME}`);

export async function startReplication() {

    db.replicate.to(remoteDB).on('complete', function () {
        console.log('Local => RemoteDB, Ok!')
      }).on('error', function (err) {
        console.log(err);
      });

    db.replicate.from( remoteDB).on('complete', ()=>{
      console.log('Remote => Local, Ok!');
    }).on('error', (err)=>{
      console.log(err);
    })

}
