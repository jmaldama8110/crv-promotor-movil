import { IonButton, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, useIonLoading, useIonToast } from "@ionic/react";

import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";

import { SearchData, SelectDropSearch } from "../../../components/SelectDropSearch";
import { db } from "../../../db";

export interface GuarantorFormProps extends RouteComponentProps {
    guarantor?: any;
    onSubmit?: any;
}

export const GuarantorForm: React.FC<GuarantorFormProps> = (props) => { 

    let render = true;
    const [fullname, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [curp, setCurp] = useState('');
    const [showToast] = useIonToast();
    
    const [relationship, setRelationShip] = useState('');
    const [status, setStatus] = useState('');
    const [ err, setErr] = useState(true);


    const [clientSearchData,setClientSearchData ] = useState<SearchData[]>([]);
    const [clientSelected, setClientSelected] = useState<SearchData>({
      id: '',
      rev: "",
      etiqueta: "",
    });
  

    const displayToast = (position: 'top' | 'middle' | 'bottom', message: string, duration: number) => {
        showToast({
          message,
          duration,
          position
        });
      };
    useEffect( ()=>{
        //// checamos si estamos en modo edicion
        
        if( props.guarantor ) {

            setFullName(`${props.guarantor.fullname}`);
            setCurp( props.guarantor.curp);
            setAddress( props.guarantor.address);
            setPhone(props.guarantor.phone);
            setRelationShip(props.guarantor.relationship);
            setStatus(props.guarantor.status[1]);
        }

    },[props.guarantor]);
    useEffect( ()=>{

        const client_id = props.match.url.split("/")[2];
        if( !props.guarantor ) displayToast( 'top','OJO: Una persona Aval, debe estar registrado previamente...', 3500)  
        if( render ){
         db.createIndex( {
          index: { fields: [ "couchdb_type"] }
         }).then( function (){
            
            db.find({
              selector: {
                couchdb_type: "CLIENT"
              }
            }).then( data =>{
              const newData = data.docs.map( (i:any)=>({ id: i._id, rev: i._rev, etiqueta: `${i.name} ${i.lastname} ${i.second_lastname}`}))
              setClientSearchData( newData.filter( (i:any) => i.id !== client_id));
          })
         })
          render = false;
        }
      },[])

    function onUpdate() {
        const data = {
            fullname,
            phone,
            curp,
            address,            
            relationship   
        }
        props.onSubmit(data);
        
    }
    useEffect(()=>{
        if( clientSelected.id) {
            db.get( clientSelected.id ).then( (clientData:any) =>{
                
                if( !!clientData.phones ){
                   const phoneData = clientData.phones.find( (i:any)=>(i.type === 'Móvil') )
                   if( !!phoneData.phone ){
                        setPhone(phoneData.phone);
                   }
                }
                if( !!clientData.address){
                    const homeAddress = clientData.address.find( (i:any)=> (i.type === 'DOMICILIO'));
                    if( !!homeAddress.address_line1 ){
                        setAddress(homeAddress.address_line1)
                        
                    }
                }
                setFullName( clientSelected.etiqueta);               
                setCurp( clientData.curp);
                setStatus( clientData.status[1])
            })
        }
    },[clientSelected])

    function onSetRelationship () {
        if( clientSelected.id && relationship ){
            setErr(false);
        }
    }

    return (
        <div>
            
            <IonList className="ion-padding">
                { !props.guarantor && <IonItemGroup>
                        <IonItemDivider><IonLabel>Buscar una persona ya registrada</IonLabel></IonItemDivider>
                        <SelectDropSearch
                        dataList={clientSearchData}
                        setSelectedItemFx={setClientSelected}
                        currentItem={clientSelected}
                        description={'Buscar...'}
                        />
                </IonItemGroup>  }              
                <IonItem>
                    <IonLabel position="floating">Estatus</IonLabel>
                    <IonInput type="text"  disabled={true} value={status} onIonChange={(e) => setStatus(e.detail.value!)}></IonInput>
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Nombre Completo</IonLabel>
                    <IonInput type="text"  disabled={props.guarantor} value={fullname} onIonChange={(e) => setFullName(e.detail.value!)}  onIonBlur={(e:any)=>setFullName(e.target.value.toUpperCase())}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Curp</IonLabel>
                    <IonInput type="text" disabled={props.guarantor} value={curp} onIonChange={(e) => setCurp(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Direccion Domicilio</IonLabel>
                    <IonInput type="text" disabled={props.guarantor} value={address} onIonChange={(e) => setAddress(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Numero Celuar</IonLabel>
                    <IonInput type="text" value={phone} onIonChange={(e) => setPhone(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Cual es su relacion?</IonLabel>
                    <IonInput type="text" value={relationship}  onIonBlur={onSetRelationship} onIonChange={(e) => setRelationShip(e.detail.value!)}></IonInput>
                </IonItem>
                <p></p>
                <IonButton color='medium' onClick={onUpdate} disabled={err}>Guardar</IonButton>

            </IonList>

                
            

        </div>
    );

}