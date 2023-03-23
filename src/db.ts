import PouchDB from 'pouchdb';
PouchDB.plugin( require('pouchdb-find').default);

export const db = new PouchDB(process.env.REACT_APP_POUCHDB_NAME);
export const remoteDB = new PouchDB(`${process.env.REACT_APP_COUCHDB_PROTOCOL}://${process.env.REACT_APP_COUCHDB_USER}:${process.env.REACT_APP_COUCHDB_PASS}@${process.env.REACT_APP_COUCHDB_HOST}:${process.env.REACT_APP_COUCHDB_PORT}/${process.env.REACT_APP_COUCHDB_NAME}`);
