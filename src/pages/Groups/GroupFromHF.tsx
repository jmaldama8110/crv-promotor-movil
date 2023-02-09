import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast } from "@ionic/react";
import { useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import api from "../../api/api";
import { db } from "../../db";
import { useDBSync } from "../../hooks/useDBSync";
import { LoanAppGroup } from "../../reducer/LoanAppGroupReducer";
import { AppContext } from "../../store/store";


interface GroupLoanApplicationHF {
    idCliente: number;
    nombreCliente: string;
    idSolicitud: number;
    estatus: string;
    sub_estatus: string;
    idTipoCliente: number;
    TipoCliente: string;
}

export const GroupFromHF: React.FC<RouteComponentProps>  = (props)=>{
    
    const [groupName, setGroupName ] = useState<string>('');
    const [groupExistId, setGroupExistId]  = useState<string>(''); 

    const [presentAlert] = useIonAlert();
    const [ present, dismiss] = useIonLoading();
    const { couchDBSyncUpload } = useDBSync();
    const { session } = useContext(AppContext);
    const [loansList, setLoansList] = useState<GroupLoanApplicationHF[]>([])
    const [selectLoan, setSelectLoad] = useState<GroupLoanApplicationHF>({
        idCliente: 0, 
        nombreCliente: '', 
        idSolicitud: 0,
        estatus:'',
        sub_estatus: '',
        idTipoCliente: 0,
        TipoCliente: ''
    })

    const selectLoansListRef = useRef<any>(null);

    function onSearch() {
        setLoansList([])
        const groupNameSearch = groupName.toUpperCase();
            present( {message:'Buscando...'})
            db.createIndex( {
                index: { fields: ["couchdb_type"]}
            }).then( ()=>{
            db.find({
                selector: { 
                couchdb_type:'GROUP'
                }
            }).then( async (data:any) =>{
                
                    const groupSearch = data.docs.find( (i:any)=>(i.group_name === groupNameSearch))
                    if( groupSearch  ){       
                        setGroupExistId(groupSearch._id);
                    }
                    try{
                        api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
                        const apiRes = await api.get(`/clients/hf/search?branchId=${session.branch[0]}&clientName=${groupNameSearch}`);

                        dismiss();
                        
                        if( !apiRes.data.length) {
                            presentAlert({
                                header: 'Busqueda sin resultados',
                                subHeader: 'Favor de verificar el nombre correcto del grupo',
                                message: 'El nombre buscado no fue encontrado en la oficina: ' + session.branch[1],
                                buttons: ['OK'],
                            });
                            
                        } else {
                            const reversedData = apiRes.data.reverse() as GroupLoanApplicationHF[]
                            setLoansList( reversedData);
                        }

                    }
                    catch(err){
                        console.log(err);
                        dismiss();
                        presentAlert({
                            header: 'No fue posible procesar la solicitud de informacion',
                            subHeader: 'Error al generar la solicitud, puede que no tengas datos',
                            message: 'Error al enviar tu solicitud de busqueda!',
                            buttons: ['OK'],
                        })
                    }
                })
            })

    }

    useEffect(() =>{
            if( loansList.length ){

                const defualtSelection = loansList.find( (i:GroupLoanApplicationHF) =>
                    i.sub_estatus === 'PRESTAMO ACTIVO' || i.sub_estatus === 'NUEVO TRAMITE');
                if( defualtSelection){
                    setSelectLoad(defualtSelection);

                } else {
                    presentAlert({
                        header: 'OJO en esta busqueda',
                        subHeader: 'Se mostraran los folios de solicitud de los grupos encontrados con el nombre: ' + groupName,
                        message: 'De la lista encontrada, se marcara el prestamo en estatus ACTIVO por default para proceder con la renovacion',
                        buttons: ['OK'],
                    })
            }
            } 

            
    },[loansList])
    

    async function onImportGroupData(){
        
        try{
            present({ message:"Cargando..."})
            api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
            const apiRes = await api.get(`/groups/hf/loanapps?branchId=${session.branch[0]}&applicationId=${selectLoan.idSolicitud}`);
            
            ///// this parts is only because the Post Code in groups is not assigned
            let colony:any = {}
            db.createIndex({
                index: { fields: ["couchdb_type"]}
            }).then( ()=>{
            db.find({
                    selector: { 
                    couchdb_type:'NEIGHBORHOOD'}
                }).then(  (data:any) => {
                    colony = data.docs.find( (i:any) =>i._id === apiRes.data.group_data.address.colony[0] )
                    /// colony can be empty if not colonies found, 
                    
                    // Save new record
                    /// assigns the _id of the group when it does exists
                    const newGroupId = !groupExistId ? Date.now().toString() : groupExistId;

                    if( !groupExistId ){
                        // Creates the group when it does not exists
                        db.put({
                            ...apiRes.data.group_data,
                            address: {
                                ...apiRes.data.group_data.address,
                                post_code: colony ? colony.codigo_postal : ''
                            },
                            couchdb_type: "GROUP",
                            _id: newGroupId,
                            created_by: session.user,
                            branch: session.branch,
                            created_at: new Date(),
                            status: [2, "Activo"],
                        });
                    }
                    /// creates the Loan App from HF
                    const newLoaApp: LoanAppGroup = {
                        ...apiRes.data.loan_app,
                        _id: Date.now().toString(),
                        apply_by: newGroupId,
                        apply_at: (new Date()).toISOString(),
                        created_by: session.user,
                        created_at: (new Date()).toISOString(),
                        branch: session.branch,
                        status:[1, "NUEVO TRAMITE"],
                        couchdb_type:"LOANAPP_GROUP"
                    }
                    db.put(newLoaApp).then( async ()=>{
                            await couchDBSyncUpload();
                            clearDataForm();
                            dismiss();
                    })                    
                });
            })
    
            /**
             * 1. Resolver si crear los clientes desde lo integrantes o no
             * 2. Renovar un credito grupal, desde una solicitud anterior (simular como lo hace el HF)
             * 
             */
         
        }
        catch(err){
            console.log(err);
            dismiss();
        }
}

    function clearDataForm(){
        setGroupExistId('');
        setLoansList([]);
        setGroupName('');
        setSelectLoad({
            idCliente: 0, 
            nombreCliente: '', 
            idSolicitud: 0,
            estatus:'',
            sub_estatus: '',
            idTipoCliente: 0,
            TipoCliente: ''
        });
    }


    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Buscar Grupo en HighFinance</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Importar Datos</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonList className='ion-padding'>
               
                  <IonItem>
                      <IonLabel position="floating">Ingresa Nombre del Grupo</IonLabel>
                      <IonInput type='text' value={groupName}  onIonChange={ (e) => setGroupName(e.detail.value!)} onIonBlur={(e:any)=>setGroupName(e.target.value.toUpperCase())}></IonInput>
                  </IonItem>
                  <IonButton onClick={onSearch} disabled={!groupName}>Buscar</IonButton>
                
                    <IonItem>
                        <IonLabel>Client Local Id</IonLabel>
                        <IonInput type="text" value={groupExistId}></IonInput>
                    </IonItem>
                    <IonItem>
                    <IonLabel position="stacked">Folios de Solicitudes:</IonLabel>
                        <IonSelect
                            ref={selectLoansListRef}
                            value={selectLoan}
                            okText="Ok"
                            cancelText="Cancelar"
                            onIonChange={(e) => setSelectLoad(e.detail.value)}
                        >
                            {loansList.map((c: GroupLoanApplicationHF, n: number) => (
                            <IonSelectOption key={n} value={c}>
                                <p className="cl-warning">Folio: {c.idSolicitud}, {c.nombreCliente}</p>
                            </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                    <IonItem><IonLabel>Tipo: {selectLoan.TipoCliente}</IonLabel></IonItem>                
                    <IonItem><IonLabel>Id Cliente: {selectLoan.idCliente}</IonLabel></IonItem>                
                             
                    <IonItem><IonLabel>Estatus: {selectLoan.sub_estatus}</IonLabel></IonItem>                

            <p></p>
            <IonButton color='success' disabled={!selectLoan.idSolicitud} onClick={onImportGroupData}>Importar Grupo</IonButton>

            </IonList>
          </IonContent>
        </IonPage>
      );

}