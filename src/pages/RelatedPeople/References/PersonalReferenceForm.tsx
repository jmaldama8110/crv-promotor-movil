import { IonBadge, IonButton, IonInput, IonItem, IonLabel, IonList, useIonLoading } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";


export interface PersonalReferenceFormProps extends RouteComponentProps {
    personref?: any;
    onSubmit?: any;
}

export const PersonalReferenceForm: React.FC<PersonalReferenceFormProps> = (props) => {

    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [second_lastname, setSecondLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [phone_verified, setPhoneVerified] = useState(false);
    
    const [relationship, setRelationShip] = useState('');

    useEffect( ()=>{
        //// checamos si estamos en modo edicion
        if( props.personref ) {
            setName(props.personref.name);
            setLastName( props.personref.lastname);
            setSecondLastName( props.personref.second_lastname);
            setPhone(props.personref.phone);
            setRelationShip(props.personref.relationship);
            setPhoneVerified(props.personref.phone_verified);
            
        }
    },[props.personref]);

    function onUpdate() {
        const data = {
            fullname: `${name} ${lastname} ${second_lastname}`,
            name,
            lastname,
            second_lastname,
            relationship,
            status: [1,'Pendiente'],
            phone_verified,
            phone
        }
        props.onSubmit(data);
        
    }


    return (
        <div>
            <IonList className="ion-padding">

                <IonItem>
                    <IonLabel position="floating">Nombre</IonLabel>
                    <IonInput type="text" value={name} onIonChange={(e) => setName(e.detail.value!)} onIonBlur={(e:any)=>setName(e.target.value.toUpperCase())}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Apellido Paterno</IonLabel>
                    <IonInput type="text" value={lastname} onIonChange={(e) => setLastName(e.detail.value!)} onIonBlur={(e:any)=>setLastName(e.target.value.toUpperCase())}></IonInput>
                </IonItem> 
                <IonItem>
                    <IonLabel position="floating">Apellido Materno</IonLabel>
                    <IonInput type="text" value={second_lastname} onIonChange={(e) => setSecondLastName(e.detail.value!)} onIonBlur={(e:any)=>setSecondLastName(e.target.value.toUpperCase())}></IonInput>
                </IonItem> 
                <IonItem>
                    <IonLabel position="floating">Relacion con la persona</IonLabel>
                    <IonInput type="text" value={relationship} onIonChange={(e) => setRelationShip(e.detail.value!)} onIonBlur={(e:any)=>setRelationShip(e.target.value.toUpperCase())}></IonInput>
                </IonItem>
                <IonItem>
                <IonInput type="text" value={phone} onIonChange={(e) => setPhone(e.detail.value!)}  disabled={phone_verified} placeholder='Numero celuar'></IonInput>
                    <IonBadge color={ phone_verified ? "success" : 'warning'}>
                    { phone_verified ? "Verificado!" : "No verificado.."}
                    </IonBadge>
                </IonItem>
                <p></p>
                <IonButton color="medium" onClick={onUpdate}>Guardar</IonButton> 



            </IonList>
        </div>
    );

}