import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonCheckbox,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonRow,
  IonSelect,
  IonSelectOption,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ButtonSlider } from "../../../components/SliderButtons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../store/store";
import { db } from "../../../db";
import api from "../../../api/api";
import avatar from '../../../../src/assets/avatar.svg';
import { GroupData, groupDataDef } from "../../../reducer/GroupDataReducer";
import { LoanAppGroup, loanAppGroupDef } from "../../../reducer/LoanAppGroupReducer";
import { formatDate, formatLocalCurrency, formatLocalCurrencyV2 } from "../../../utils/numberFormatter";
import { GroupMember } from "../../../reducer/GroupMembersReducer";
import { clientDataDef } from "../../../reducer/ClientDataReducer";


interface GroupLoanApplicationHF {
  idCliente: number;
  nombreCliente: string;
  idSolicitud: number;
  estatus: string;
  sub_estatus: string;
  idTipoCliente: number;
  TipoCliente: string;
}

interface MemberHf extends GroupMember{
  isActive: boolean;
}

export const GroupImportImportForm: React.FC<{setProgress: React.Dispatch<React.SetStateAction<number>>, onSubmit: any}> = ({ setProgress, onSubmit }) => {
  
  const [groupName, setGroupName] = useState<string>("");
  const [groupExistId, setGroupExistId] = useState<string>("");
  const [membersHf, setMembersHf] = useState<MemberHf[]>([]);
  
  const [presentAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  
  const { session } = useContext(AppContext);
  const [loansList, setLoansList] = useState<GroupLoanApplicationHF[]>([]);
  const [selectLoan, setSelectLoad] = useState<GroupLoanApplicationHF>({
    idCliente: 0,
    nombreCliente: "",
    idSolicitud: 0,
    estatus: "",
    sub_estatus: "",
    idTipoCliente: 0,
    TipoCliente: "",
  });
  const [group_data, setGroupData] = useState<GroupData>(groupDataDef);
  const [loan_app, setLoanApp] = useState<LoanAppGroup>(loanAppGroupDef);
  const [contract, setContract] = useState<any>({});
  const [createNewLoanApp, setCreateNewLoanApp] = useState<boolean>(false);

  async function onGroupSearchNext  (){
    setProgress(0.66);
    await onUpdateMembersList();


  }

  function onMembersCheckNext(){
    setProgress(1);
    try{
      onVerifyMembersExist(membersHf);
    }
    catch(e){
      alert('No fue posible verificar')
    }

  }

  const onUpdateMembersList = async () => {
    
    try{
      present({ message:"Cargando..."})
      
      api.defaults.headers.common["Authorization"] = `Bearer ${session.current_token}`;  
      const apiRes = await api.get(`/groups/hf/loanapps?branchId=${session.branch[0]}&applicationId=${selectLoan.idSolicitud}`);
      const apiRes2 = await api.get(`/clients/hf/getBalance?idCliente=${selectLoan.idCliente}`);
      if( apiRes2.data[0]){
        setContract( apiRes2.data[0])
      }

      setGroupData( apiRes.data.group_data);
      setLoanApp( apiRes.data.loan_app);
      const newMemberData: MemberHf[] = apiRes
                                        .data.
                                        loan_app.members.map( (mem:MemberHf, count:number)=>(
                                      { _id: '',
                                        id_member: mem.id_member,
                                        id_cliente: mem.id_cliente,
                                        id_persona: mem.id_persona,
                                        client_id: '',
                                        fullname: mem.fullname,
                                        curp: mem.curp,
                                        position: mem.position,
                                        apply_amount: mem.apply_amount,
                                        previous_amount: mem.previous_amount,
                                        approved_amount: mem.approved_amount,
                                        loan_cycle: mem.loan_cycle,
                                        disbursment_mean: mem.disbursment_mean,
                                        estatus: 'TRAMITE',
                                        sub_estatus: 'NUEVO TRAMITE',
                                        insurance: {
                                          id: count,
                                          beneficiary: mem.insurance.beneficiary,
                                          relationship: mem.insurance. relationship,
                                          percentage: mem.insurance.percentage,
                                        },
                                        isActive: false,
                                      }));
      
      await onVerifyMembersExist(newMemberData);
      
      dismiss();
    }
    catch(err:any){
      dismiss();
      try{

        const emailTo = process.env.NODE_ENV === 'development' ? 'josman.gomez.aldama@gmail.com' : session.user       
        await api.post(`/sendemail?toEmail=${emailTo}&templateId=d-644621db309643f0aba469b4e229f776&fromEmail=soporte.hf@grupoconserva.mx`,
        { /// Data for email Template
          actionType: "IMPORTAR Una solicitud de grupo",
          clientName: selectLoan.nombreCliente,
          errors: err.message
        })

      }
      catch(e){
        alert('NO fue posible enviar el correo a soporte')
      }

      alert(`No fue posible procesar las solicitudes al HF`)
    }

  };

  function onSearch() {
    
    setLoansList([]);
    const groupNameSearch = groupName.toUpperCase();
    present({ message: "Buscando..." });
    db.createIndex({
      index: { fields: ["couchdb_type"] },
    }).then(() => {
      db.find({
        selector: {
          couchdb_type: "GROUP",
        },
      }).then(async (data: any) => {
        const groupSearch = data.docs.find(
          (i: any) => i.group_name === groupNameSearch
        );
        
        if (groupSearch) {
          setGroupExistId(groupSearch._id);
        }
        
        try {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${session.current_token}`;
          const apiRes = await api.get(`/clients/hf/search?branchId=${session.branch[0]}&clientName=${groupNameSearch}`);
          dismiss();
          
          const resultData = apiRes.data.filter( (i:any)=>  (i.sub_estatus === "PRESTAMO ACTIVO" && i.nombreCliente ===groupNameSearch ))
          if (!resultData) {
            presentAlert({
              header: "Busqueda sin resultados",
              subHeader: "Favor de verificar el nombre correcto del grupo",
              message:
                "El nombre buscado no fue encontrado en la oficina: " +
                session.branch[1],
              buttons: ["OK"],
            });
            clearDataForm();
          } else{
            const reversedData = resultData.reverse() as GroupLoanApplicationHF[];
            setLoansList(reversedData);
          }
          
        } catch (err) {
          console.log(err);
          dismiss();
          presentAlert({
            header: "No fue posible procesar la solicitud de informacion",
            subHeader:
              "Error al generar la solicitud, puede que no tengas datos",
            message: "Error al enviar tu solicitud de busqueda!",
            buttons: ["OK"],
          });
        }
      });
    });
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

  useEffect(() => {
    if (loansList.length) {
      const defualtSelection = loansList.find(
        (i: GroupLoanApplicationHF) =>
          i.sub_estatus === "PRESTAMO ACTIVO" ||
          i.sub_estatus === "NUEVO TRAMITE"
      );
      if (defualtSelection) {
        setSelectLoad(defualtSelection);
      } else {
        presentAlert({
          header: "OJO en esta busqueda",
          subHeader:
            "Se mostraran los folios de solicitud de los grupos encontrados con el nombre: " +
            groupName,
          message:
            "De la lista encontrada, se marcara el prestamo en estatus ACTIVO por default para proceder con la renovacion",
          buttons: ["OK"],
        });
      }
    }
  }, [loansList]);

  const onVerifyMembersExist = async (data:MemberHf[])=>{      
    //// verifies and updates the list of members, whether ther are Register locally or not
    await db.createIndex( { index: { fields: ["couchdb_type"]}});
    const clientsData = await db.find( { selector: { couchdb_type: "CLIENT"}});
    
    const newMemberData: MemberHf[] = data.map( (mem:MemberHf, itemNumber:number)=>{
      const isFound = clientsData.docs.find( (i:any) => ( mem.id_cliente === i.id_cliente  ))      
        return {
          _id: itemNumber.toString(),
          id_member: mem.id_member,
          id_cliente: mem.id_cliente,
          id_persona: mem.id_persona,
          fullname: mem.fullname,
          curp: mem.curp,
          position: mem.position,
          previous_amount: mem.previous_amount,
          apply_amount: mem.apply_amount,
          approved_amount: mem.approved_amount,
          loan_cycle: mem.loan_cycle,
          disbursment_mean: mem.disbursment_mean,
          estatus: mem.estatus,
          sub_estatus: mem.sub_estatus,
          dropout_reason: mem.dropout_reason,
          insurance: {
            id: mem.insurance.id,
            beneficiary: mem.insurance.beneficiary,
            relationship: mem.insurance. relationship,
            percentage: mem.insurance.percentage,
          },
          isActive: !!isFound,
          client_id: !!isFound ? isFound._id : '',
        }
    })
    
    setMembersHf( newMemberData);
  }


  function onUpdateIsActive(clientId:number){
    /// sets an item as Checked when item is click,
    /// the action can be cancel, still does not validates that
    /// it validetes when the final button is called at the next swipe
    const newData = membersHf.map( (i:MemberHf)=> {
      if( (i.id_cliente == clientId ) ){
        return {
          ...i,
          isActive: true
        }
      } else {
        return {
          ...i
        }
      }
    })
    setMembersHf(newData);
  }


  async function onImportAllMembers() {

    let apiCall = 0;

    present({message: `Importando...` })
    let membersHfCopy = membersHf;
    while ( apiCall < membersHf.length ){
      try {
        if( ! (membersHf[apiCall].isActive) ){

            const idCliente = membersHf[apiCall].id_cliente;
            const newArrayState = membersHfCopy.map( (i:MemberHf)=> (i.id_cliente == idCliente ) ?
                                  {...i, isActive: true } :
                                   i )
            // setMembersHf(newArrayState);
            membersHfCopy = newArrayState;
            setMembersHf(membersHfCopy)
            const apiRes = await api.get(`/clients/hf?externalId=${idCliente}`);            
            
            const newClientId = Date.now().toString()          
            await db.put({  ...clientDataDef,
                            ...apiRes.data, 
                            business_data: {
                              ...clientDataDef.business_data,
                              ...apiRes.data.business_data
                            },
                            
                            couchdb_type: 'CLIENT',
                            _id: newClientId,
                            status: [2,'Aprovado'] });
        }
          
        
      }
      catch(e){  
        apiCall = membersHf.length
        console.log(e);  
      }
      apiCall++;
    }

    dismiss();
    



  }

  function onFinish(){
  
      if( !!membersHf.find( (i:MemberHf) => !i.isActive) ){
        presentAlert({
          header: "Verificar los integrantes",
          subHeader:
            "Parece que alguno de los integrantes no fueron registrados",
          message: "Vuelve a la vista de integrantes, y guarda los marcados en amarillo!",
          buttons: ["OK"],
        });
      } else {

        const data ={
            selectLoan,
            groupName,
            groupExistId,
            group_data,
            loan_app,
            membersHf,
            contract,
            createNewLoanApp
        }

        onSubmit(data);
      }
  }

  return (
    <Swiper spaceBetween={50} slidesPerView={1} allowTouchMove={false}>
      <SwiperSlide>
        <IonList className="ion-padding">
          <IonItem>
            <IonLabel position="floating">Ingresa Nombre del Grupo</IonLabel>
            <IonInput
              type="text"
              value={groupName}
              onIonChange={(e) => setGroupName(e.detail.value!)}
              onIonBlur={(e: any) => setGroupName(e.target.value.toUpperCase())}
            ></IonInput>
          </IonItem>
          <IonButton onClick={onSearch} disabled={!groupName}>
            Buscar
          </IonButton>

          <IonItem>
            <IonLabel>No Serie Grupo </IonLabel>
            <IonInput type="text" value={groupExistId}></IonInput>
            <IonBadge color={groupExistId ? "success" : "warning"}>
                {groupExistId ? "Ya existe" : "Nuevo Registro"}
            </IonBadge>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Folios de Solicitudes:</IonLabel>
            <IonSelect
              value={selectLoan}
              okText="Ok"
              cancelText="Cancelar"
              onIonChange={(e) => setSelectLoad(e.detail.value)}
            >
              {loansList.map((c: GroupLoanApplicationHF, n: number) => (
                <IonSelectOption key={n} value={c}>
                  <p className="cl-warning">
                    Folio: {c.idSolicitud}, {c.nombreCliente}
                  </p>
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Tipo: {selectLoan.TipoCliente}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Id Cliente: {selectLoan.idCliente}</IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Estatus: {selectLoan.sub_estatus}</IonLabel>
          </IonItem>

          <p></p>
          <ButtonSlider label="Siguiente" color="medium" slideDirection="F" expand="block" onClick={onGroupSearchNext}/>
        </IonList>
      </SwiperSlide>

      <SwiperSlide>
            <IonList className="ion-padding">
              <IonItem>
                <IonLabel>Contrato Actual: {!contract.idContrato? "No hay contrato activo" : contract.idContrato}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Ciclo: {contract.Ciclo}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Ult Pago Realizado: {formatDate(contract.fechaUltimoReembolso)}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>periodicidad: {contract.periodicidad}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Pago: {formatLocalCurrency(contract.montoReembolso)}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Importe: {formatLocalCurrency(contract.montoTotalAutorizado)}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Saldo: {formatLocalCurrency(contract.saldoActual)}</IonLabel>
              </IonItem>
              <IonItemDivider><IonLabel>¿Generer una Nueva Solicitud?</IonLabel></IonItemDivider>
              <IonItem>
                <IonLabel>Si, crear una nueva solicitud</IonLabel>
                <IonCheckbox
                checked={createNewLoanApp}
                onIonChange={async (e) =>setCreateNewLoanApp(e.detail.checked)} />
              </IonItem>
              <p></p>
            <ButtonSlider label="Siguiente" color="medium" slideDirection="F" expand="block" onClick={()=>{}} />
            <ButtonSlider label="Anterior" color="light" slideDirection="B" expand="block" onClick={() => {}} />
          </IonList>

      </SwiperSlide>

      <SwiperSlide>
        <IonList className="ion-padding">
          <IonItem>
            <IonLabel>Integrantes:</IonLabel>
            <IonButton color="warning" onClick={onImportAllMembers}>Importar Todos</IonButton>
          </IonItem>
        {
          membersHf.length ?
          membersHf.map((i: MemberHf,n:number) => (
            <IonItem key={n} button id={`${i.id_cliente}`} >
              <IonAvatar slot="start" id={`${i.id_cliente}`}>
                <img
                  alt="Perfil de usuario sin foto"
                  src={avatar}
                />
              </IonAvatar>
              <IonLabel id={`${i.id_cliente}`}>{i.fullname}</IonLabel>
              <IonBadge color={!i.isActive ? 'warning' : 'success'}>{ !i.isActive ? '!' : 'Ok'}</IonBadge>
            </IonItem>
          
          ))
          :
          <IonItem><IonLabel><p>...sin integrantes</p></IonLabel></IonItem>
        }
        
          <ButtonSlider label="Siguiente" color="medium" slideDirection="F" expand="block" onClick={onMembersCheckNext} disabled={ !!membersHf.find( (i:MemberHf) => !i.isActive)} />
          <ButtonSlider label="Anterior" color="light" slideDirection="B" expand="block" onClick={() => { setProgress(0.33) }} />
        </IonList>
        
      </SwiperSlide>

      <SwiperSlide>
        <IonList className="ion-padding">
        <IonItemDivider><IonLabel>Resumen de Informacion</IonLabel></IonItemDivider>
            <IonGrid className="fuente-sm">
                <IonRow>
                  <IonCol size="4">Grupo:</IonCol> <IonCol>{ groupName } (AppId: {!groupExistId ? 'Nuevo' : groupExistId})</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Dia Horario Reunion:</IonCol> <IonCol>{ group_data.weekday_meet}, {group_data.hour_meet} horas</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Total Credito:</IonCol> <IonCol>{ formatLocalCurrencyV2(loan_app.approved_total,"$","","")}</IonCol>
                </IonRow>
              </IonGrid>
              <IonItem><IonLabel>Integrantes ({membersHf.length})</IonLabel></IonItem>
                        <IonGrid>
                            { membersHf.map((i:MemberHf)=> (
                                <IonRow key={i.id_cliente}>
                                  <IonCol size="9">
                                    <IonLabel className="xs">{i.fullname}</IonLabel>
                                  </IonCol>
                                  <IonCol>
                                    <IonLabel> {formatLocalCurrencyV2(i.approved_amount,"","","")}</IonLabel>
                                  </IonCol>

                                </IonRow>) )
                              }

                        </IonGrid>

          <ButtonSlider label="Finalizar" color="success" slideDirection="F" expand="block" onClick={onFinish}/>
          <ButtonSlider label="Anterior" color="light" slideDirection="B" expand="block" onClick={() => { setProgress(0.66)}} />
        </IonList>
      </SwiperSlide>
    </Swiper>
  );
};
