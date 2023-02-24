import { IonButton, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { db } from "../../../db";
import { GroupMember } from "../../../reducer/GroupMembersReducer";
import { AppContext } from "../../../store/store";

import { InputCurrency } from "../../InputCurrency";
import { SearchData, SelectDropSearch } from "../../SelectDropSearch";

export const LoanAppMemberForm: React.FC<{ onSubmit: any}> = ({onSubmit})=>{


    const { groupMember, dispatchMember, groupMemberList } = useContext(AppContext)

    const [client_id, setClientId ] = useState<string>('');
    const [id_cliente, setIdCliente ] = useState<number>(0);
    const [id_persona, setIdPersona ] = useState<number>(0);
    const [curp, setCurp ] = useState<string>('');
    const [fullname, setFullname ] = useState<string>('');
    const [beneficiary, setBeneficiary ] = useState<string>('');
    const [relationship, setRelationship ] = useState<string>('');
    const [percentage, setPercentage ] = useState<number>(100);
    const [apply_amount, setApplyAmount ] = useState<string>('');
    const [loan_cycle, setLoanCycle ] = useState<number>(0);
    const [previous_amount, setPreviousAmount ] = useState<string>('0');
    const [entryAmtValid, setEntryAmtValid] = useState<boolean>(false);
    const [clientSearchData,setClientSearchData ] = useState<SearchData[]>([]);
    const [clientSelected, setClientSelected] = useState<SearchData>({
      id: '',
      rev: "",
      etiqueta: "",
      data: {},
    });
    let render = true;

    const [position, setPosition ] = useState<string>('');
    const [positions ] = useState<string[]>(['','Presidenta(e)','Secretaria(o)', 'Tesorera(o)']);

    const [disbursment_mean, setDisbursmentMean ] = useState<number>(2);
    const [disbursmeans ] = useState([{ id: 1, mean:'Cheque'}, {id:2, mean:'OPR'}]);


    useEffect( ()=>{    
        if( render && !groupMember._id ){
          render = false;
         db.createIndex( {
          index: { fields: [ "couchdb_type"] }
         }).then( function (){
            console.log('Index, created...');
            db.find({
              selector: {
                couchdb_type: "CLIENT"
              }
            }).then( data =>{
              /// remove clients listed within same group List
              const newSearchList = data.docs.filter( (curr:any) =>{
                const found = groupMemberList.find( (x:GroupMember) => x.client_id === curr._id )
                return !found
              })
              const newData = newSearchList.map( (i:any)=>(
                  {   id: i._id,
                            rev: i._rev,
                            etiqueta: `${i.name} ${i.lastname} ${i.second_lastname}`,
                            data: {
                              id_cliente: i.id_cliente,
                              id_persona: i.id_persona,
                              name: i.name,
                              curp: i.curp,
                              loan_cycle: i.loan_cycle
                            }
                }))
              
              setClientSearchData( newData as SearchData[]);
              console.log('Clients Loaded: ', newData.length)
          })
         })
        
          
        }
        return () =>{
          // resets member detail
          dispatchMember({ type:'RESET_MEMBER'})
        }

      },[])
    
      useEffect( ()=>{
        if( clientSelected.id ){
          /// 
          
          setClientId(clientSelected.id); 
          setIdCliente(clientSelected.data.id_cliente) 
          setIdPersona(clientSelected.data.id_persona)
          setFullname(clientSelected.etiqueta)
          setCurp(clientSelected.data.curp)
          setLoanCycle( clientSelected.data.loan_cycle)
          
        } else {
            setClientId('');
            setFullname('');
            setIdCliente(0);
            setIdPersona(0);
            setCurp('');
            setLoanCycle(0);
        }
      },[clientSelected])
    
      useEffect( ()=>{
        
          if( groupMember._id ){ /// we are editing a member
            setClientId( groupMember.client_id);
            setIdCliente( groupMember.id_cliente);
            setIdPersona( groupMember.id_persona);
            setCurp( groupMember.curp);
            setPosition( groupMember.position);
            setFullname(groupMember.fullname);
            setApplyAmount( groupMember.apply_amount);
            setLoanCycle( groupMember.loan_cycle);
            setPreviousAmount( groupMember.previous_amount);
            setBeneficiary( groupMember.insurance.beneficiary);
            setPercentage( groupMember.insurance.percentage);
            setRelationship( groupMember.insurance.relationship);
          }

      },[groupMember]);

      async function getBeneficiary (e:any) {
        if( !beneficiary ){ /// if not entere, try to retrieve
          
          db.createIndex( {
            index: { fields: [ "couchdb_type"] }
          }).then( function (){
              console.log('Index, created...');
              db.find({
                selector: {
                  couchdb_type: "RELATED-PEOPLE"
                }
              }).then( data =>{
                const beneficiaryData:any = 
                  data.docs.find( (i:any) => i.client_id === client_id && i.relation_type === 'beneficiary');
                if( beneficiaryData ){
                  setBeneficiary( beneficiaryData.fullname);
                  setPercentage( beneficiaryData.percentage);
                  setRelationship( beneficiaryData.relationship)
                }

            })
          })
          
        } else {
            setBeneficiary(e.target.value.toUpperCase());
        }
        
      }
  

    function onSend() {
        const data = {
            client_id,
            id_cliente: clientSelected.data.id_cliente,
            id_persona: clientSelected.data.id_persona,
            curp,
            apply_amount,
            fullname,
            position,
            loan_cycle,
            beneficiary,
            relationship,
            percentage,
            disbursment_mean
        }
        onSubmit(data);
        
    }

    return (
        <IonList>
            { !groupMember._id &&<SelectDropSearch
                  dataList={clientSearchData}
                  setSelectedItemFx={setClientSelected}
                  currentItem={clientSelected}
                  description={'Buscar...'}                  
                />}
            <IonItem>
                <IonLabel position="floating" >Identificador del Cliente (HF) </IonLabel>
                <IonInput type="text" value={id_cliente} onIonChange={ (e:any)=>setIdCliente(e.detail.value)} disabled={true}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel position="floating" >CURP </IonLabel>
                <IonInput type="text" value={curp} onIonChange={ (e)=>setCurp(e.detail.value!)} disabled={true}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel position="floating" >Nombre completo</IonLabel>
                <IonInput type="text" value={fullname} onIonChange={ (e)=>setFullname(e.detail.value!)} disabled={true}></IonInput>
            </IonItem>
            <IonItem>
                <IonSelect
                value={position}
                okText="Ok"
                cancelText="Cancelar"
                onIonChange={(e) => setPosition(e.detail.value)}
                >
                {positions.map(  (c: any,n:number) => (
                    <IonSelectOption key={n} value={c}>
                    {c}
                    </IonSelectOption>
                ))}
                </IonSelect>
            </IonItem>
            <IonItem>
                <IonLabel position="floating" >Ciclo</IonLabel>
                <IonInput type="text" value={loan_cycle} onIonChange={ (e)=>setLoanCycle( parseFloat(e.detail.value!))} disabled={true}></IonInput>
            </IonItem>
            
            <IonItem>
                <IonLabel position="floating" >Beneficiario</IonLabel>
                <IonInput type="text" value={beneficiary} onIonChange={ (e)=>setBeneficiary( e.detail.value!)} onIonBlur={getBeneficiary}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel position="floating" >Parentesco</IonLabel>
                <IonInput type="text" value={relationship} onIonChange={ (e)=>setRelationship( e.detail.value!)} ></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel position="floating" >Porcentaje</IonLabel>
                <IonInput type="text" value={percentage} onIonChange={ (e)=>setPercentage( parseFloat(e.detail.value!))} ></IonInput>
            </IonItem>
            
            <IonItem>
                <IonLabel position="floating" >Importe Anterior</IonLabel>
                <IonInput type="text" value={previous_amount} onIonChange={ (e)=>setPreviousAmount(e.detail.value!)} disabled={true}></IonInput>
            </IonItem>

            <IonItem>
                <IonLabel>Importe Solicitado:</IonLabel>
            </IonItem>
            <IonItem>
              <InputCurrency InputString={apply_amount} fxUpdateInput={setApplyAmount} BadgeFlag={entryAmtValid} fxUpdateBadge={setEntryAmtValid} />
            </IonItem>
            <IonItem>
                <IonSelect
                value={disbursment_mean}
                okText="Ok"
                cancelText="Cancelar"
                onIonChange={(e) => setDisbursmentMean(e.detail.value)}
                >
                {disbursmeans.map(  (c: any,n:number) => (
                    <IonSelectOption key={n} value={c.id}>
                    {c.mean}
                    </IonSelectOption>
                ))}
                </IonSelect>
            </IonItem>
            <p></p>
            <IonButton onClick={onSend} color='medium' disabled={!entryAmtValid} expand='block'>Guardar</IonButton>
        </IonList>
        
    );


}