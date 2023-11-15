import { IonBadge, IonButton, IonCol, IonGrid, IonImg, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonRow, useIonLoading, useIonToast } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";
import api from "../../api/api";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { DocumentIdProperties } from "../../reducer/ClientDataReducer";
import { useCameraTaker } from "../../hooks/useCameraTaker";


export const IdentityVerification = () =>{

    const { clientData, session } = useContext(AppContext);
    const { takePhoto, pics, setPics } = useCameraTaker();
    const { couchDBSyncUpload } = useDBSync();
    const [showToast] = useIonToast();
    const [uuid, setUuid ] = useState("");
    const [documentData, setDocumentData] =    
    useState<DocumentIdProperties>({
            age: '0',
            voter_key: '',
            nationality: '',
            expiration_date: '',
            doc_number: '',
            folio_number: '',
            dob: '',
            ocr_number: '',
            sex: '',
            lastname: '',
            second_lastname: '',
            name: '',
            duplicates: '',
            curp: '',
            street_address: '',
            suburb_address: ''})
    
    // const [selfi, setSelfi ] = useState("");
    // const [docPortrait, setDocuPortrait ] = useState("");

    const [status, setStatus] = useState<"sent" | "pending">("pending"); /// sent | pending
    const [result, setResult] = useState<"ok" | "waiting" | "fail">("waiting"); /// ok | fail | waiting
    
    const [showLoading, dismissLoading ] = useIonLoading();

    function getResultStatus () {
        if( result === 'ok') {
            return 'Listo!'
        }
        if( result === 'fail') {
            return 'Fallo!'
        }
        if( result === 'waiting') {
            return '... Espere'
        }
        return ''
    }
    function getResultStatusMessage () {
        if( result === 'ok') {
            return 'Prueba de Vida Existosa!'
        }
        if( result === 'fail') {
            return 'No fue posible comprobar identidad'
        }
        if( result === 'waiting') {
            return '...en proceso de verificacion'
        }
        return ''
    }
    function getColorStatus () {
        if( result === 'ok') {
            return 'success'
        }
        if( result === 'fail') {
            return 'danger'
        }
        return 'warning'
    }
    useEffect( ()=>{

        if( clientData.identity_verification ){
            setStatus(clientData.identity_verification.status);
            setResult( clientData.identity_verification.result);
            setUuid( clientData.identity_verification.uuid);
            
            if( clientData.identity_verification.documentData )
                setDocumentData( clientData.identity_verification.documentData);
                    
        }
    },[clientData])

    async function onSend () {
        showLoading({message:'Enviando imagenes...'});
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
            const apiRes = await api.post(`/verify?clientId=${clientData._id}`,{
                frontImage: pics[0].base64str,
                backImage: pics[1].base64str,
                faceImage: pics[2].base64str
            });
            if( apiRes.data ){
                setUuid(apiRes.data);
                setStatus('sent');
                
                // Update selected Client
                db.get(clientData._id as string).then( async (clientDbData:any) => {
                return db.put({
                    ...clientDbData,
                    identity_verification: {
                        uuid: apiRes.data,
                        status: 'sent',
                        result,
                        created_at: (new Date()).toISOString(),
                        updated_at: ''
                        }
                    }).then( async ()=>{
                        await couchDBSyncUpload();
                    })
                })
            }
            dismissLoading();
        }
        catch(e){
            dismissLoading();
            alert('Oops ocurrion un detalle al procesar tu solitud!')
        }
    }
    const onRefresh = async () => {
        showLoading({message:'Verificando estatus...'});

        try {

            api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
            const apiRes = await api.post(`/verify/status?uuid=${uuid}`);
            if( apiRes.data === 'Checked' ){

                const apiRes2 = await api.post(`/verify/results?uuid=${uuid}&includeImages=false`);
                const biometrics = apiRes2.data.documentVerifications.find( (i:any)=> (i.category ==='Biometrics' && i.name==='Comprobación Facial') );
                const proofLife = apiRes2.data.documentVerifications.find( (i:any)=> (i.category ==='Biometrics' && i.name==='Prueba de Vida') );

                if( biometrics.result && proofLife.result ) {
                    setResult('ok');
                   const documentDataTmp: DocumentIdProperties = {
                    age:              findDocDataValue(apiRes2.data.documentData, 'Age'),
                    voter_key:        findDocDataValue(apiRes2.data.documentData, 'Voter Key'),
                    nationality:      findDocDataValue(apiRes2.data.documentData, 'Nationality Code'),          
                    expiration_date:  findDocDataValue(apiRes2.data.documentData, 'Date of Expiry'),
                    doc_number:       findDocDataValue(apiRes2.data.documentData, 'Document Number'),
                    folio_number:     findDocDataValue(apiRes2.data.documentData, 'Folio Number'),
                    dob:              findDocDataValue(apiRes2.data.documentData, 'Date of Birth'),
                    ocr_number:       findDocDataValue(apiRes2.data.documentData, 'OCR Number'),
                    sex:              findDocDataValue(apiRes2.data.documentData, 'Sex'),
                    lastname:         findDocDataValue(apiRes2.data.documentData, 'Father Surname'),
                    second_lastname:  findDocDataValue(apiRes2.data.documentData, 'Mother Surname'),
                    name:             findDocDataValue(apiRes2.data.documentData, 'Name'),
                    duplicates:       findDocDataValue(apiRes2.data.documentData, 'Number of Duplicates'),
                    curp:             findDocDataValue(apiRes2.data.documentData, 'Personal Number'),
                    street_address:   findDocDataValue(apiRes2.data.documentData, 'Address Street'),
                    suburb_address:   findDocDataValue(apiRes2.data.documentData, 'Address Suburb'),
                };
                setDocumentData( documentDataTmp)
                    // setDocuPortrait(apiRes2.data.documentPortraitImage);
                    // setSelfi(apiRes2.data.faceImage);  

                    // Update selected Client
                    db.get(clientData._id as string).then( async (clientDbData:any) => {
                        return db.put({
                            ...clientDbData,
                            identity_verification: {
                                ...clientDbData.identity_verification,                  
                                result: 'ok',
                                updated_at: (new Date()).toISOString(),
                                documentData: documentDataTmp
                                }
                            }).then( async ()=>{
                                await couchDBSyncUpload();
                            })
                        })
    
                }
   
            }
            dismissLoading();
        }
        catch(e){
            dismissLoading();
            showToast('Verificación sin resultados aun...',1500)
        }
    };

    function findDocDataValue (data: any[], tipo:string){
        const item = data.find( i => i.type === tipo )
        return item ? item.value : ''
    }
    
    return (
        <IonList className="ion-padding">
            <IonItemDivider><IonLabel>Prueba de Vida</IonLabel></IonItemDivider>

                <IonGrid>
                    <IonRow>
                        
                        <IonCol size="5" >
                            { pics.length > 0 
                                ? !! pics[0].base64str &&  <IonImg src={`data:image/jpeg;base64,${pics[0].base64str}`}></IonImg>
                                : <IonButton color='medium' onClick={()=> takePhoto(20)}>INE Frontal</IonButton>
                            }
                        </IonCol> 
                        
                        <IonCol size="5" >
                            { pics.length > 1
                                ? !! pics[1].base64str &&  <IonImg src={`data:image/jpeg;base64,${pics[1].base64str}`}></IonImg>
                                : <IonButton color='medium' onClick={()=> takePhoto(20)} disabled={pics.length != 1}>INE Posterior</IonButton>
                            }
                        </IonCol> 

                    </IonRow>
                    <IonRow>
                        <IonCol size="5" >
                            { pics.length > 2
                                ? !! pics[2].base64str &&  <IonImg src={`data:image/jpeg;base64,${pics[2].base64str}`}></IonImg>
                                : <IonButton color='medium' onClick={()=> takePhoto(20)} disabled={ pics.length != 2}>Selfi</IonButton>
                            }
                        </IonCol> 
                    </IonRow>
                </IonGrid>


            { result !== 'ok' &&
            <>
                { status ==='pending' &&
                    <IonButton onClick={onSend} disabled={pics.length !== 3}>Enviar</IonButton>}
                {status === 'sent' && 
                <>
                <IonItem>
                    <IonButton color='medium' onClick={onRefresh}>Actualizar</IonButton>
                </IonItem>
                <IonItem>
                    <IonLabel>UUID: {uuid}</IonLabel>
                </IonItem>
                </>
                     }  
            </>}

            { result === 'ok' &&
            <>  
                { status ==='sent'&&
                <>
                <IonItem>
                    <IonInput type="text" disabled value={getResultStatusMessage ()}></IonInput>
                    <IonBadge color={getColorStatus()}>{getResultStatus()}</IonBadge>
                </IonItem>
                    <IonItemGroup>
                        <IonItem><IonLabel>Nombre: {documentData.name}</IonLabel></IonItem>
                        <IonItem><IonLabel>Apellido Paterno: {documentData.lastname}</IonLabel></IonItem>
                        <IonItem><IonLabel>Apellido Materno: {documentData.second_lastname}</IonLabel></IonItem>
                        <IonItem><IonLabel>CURP: {documentData.curp}</IonLabel></IonItem>
                        <IonItem><IonLabel>Edad : {documentData.age}</IonLabel></IonItem>
                        <IonItem><IonLabel>Vigencia INE: {documentData.expiration_date}</IonLabel></IonItem>
                        <IonItem><IonLabel>Nacionalidad: {documentData.nationality}</IonLabel></IonItem>
                        <IonItem><IonLabel>Clave Elector: {documentData.voter_key}</IonLabel></IonItem>
                        <IonItem><IonLabel>Duplicados: {documentData.duplicates}</IonLabel></IonItem>
                        <IonItem><IonLabel>Direccion: {documentData.street_address}, {documentData.suburb_address}</IonLabel></IonItem>
                    </IonItemGroup>
                </>
                
                }
            </>}
        </IonList>
    );
}