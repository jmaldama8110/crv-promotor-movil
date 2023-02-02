import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast } from "@ionic/react";
import { useContext, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import api from "../../api/api";
import { db, remoteDB } from "../../db";
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

    const [presentAlert] = useIonAlert();
    const [ present, dismiss] = useIonLoading();
    
    const { session, dispatchSession, dispatchClientData } = useContext(AppContext);
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
                
                    if( data.docs.find( (i:any)=>(i.group_name === groupNameSearch)) ){
                        dismiss();                      
                        presentAlert({
                            header: 'Este registro no fue encontrado o ya existe en la App',
                            subHeader: 'El nombre de grupo debe ser unico en cada sucursal',
                            message: 'Verifica que el grupo no este registrado!',
                            buttons: ['OK'],
                        })
                        return;
                    }
                    try{
                        api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
                        const apiRes = await api.get(`/groups/hf/search?branchId=${session.branch[0]}&groupName=${groupNameSearch}`);


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
            present({message:"Cargando..."})
            api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
            const apiRes = await api.get(`/groups/hf/loanapps?branchId=${session.branch[0]}&applicationId=${selectLoan.idSolicitud}`);
            
            let colony:any = {}
            db.createIndex({
                index: { fields: ["couchdb_type"]}
            }).then( ()=>{
            db.find({
                    selector: { 
                    couchdb_type:'NEIGHBORHOOD'}
                }).then(  (data:any) => {
                    colony = data.docs.find( (i:any) =>i._id === apiRes.data.group_data.address.colony[0] )
                    
                    // Save new record
                    db.put({
                        ...apiRes.data.group_data,
                        address: {
                            ...apiRes.data.group_data.address,
                            post_code: colony ? colony.codigo_postal : ''
                        },
                        couchdb_type: "GROUP",
                        _id: Date.now().toString(),
                        created_by: session.user,
                        branch: session.branch,
                        created_at: new Date(),
                        status: [2, "Activo"],
                    }).then((doc) => {

                        


                        clearDataForm();
                        try{
                            dispatchSession({ type: "SET_LOADING", loading: true, loading_msg: "Subiendo datos..."});
                            db.replicate.to(remoteDB).on('complete', function () {
                                dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
                            }).on('error', function (err) {
                                dispatchSession({ type: "SET_LOADING", loading: false, loading_msg: "" });
                            });
                        }
                        catch(error){
                            console.log(error);
                        }
                    }).catch((e) => {
                        alert("No se pudo guardar el dato del cliente");
                    });




                });
            })
    
            dismiss();
         
        }
        catch(err){
            console.log(err);
            dismiss();
        }
}

    function clearDataForm(){
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
                
                  <div>
                  <IonItem>
                      <IonLabel position="floating">Ingresa Nombre del Grupo</IonLabel>
                      <IonInput type='text' value={groupName}  onIonChange={ (e) => setGroupName(e.detail.value!)} onIonBlur={(e:any)=>setGroupName(e.target.value.toUpperCase())}></IonInput>
                  </IonItem>
                  <IonButton onClick={onSearch} disabled={!groupName}>Buscar</IonButton>
                </div>
                
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