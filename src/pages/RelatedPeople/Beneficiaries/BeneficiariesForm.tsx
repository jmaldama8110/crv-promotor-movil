import { IonBadge, IonButton, IonInput, IonItem, IonLabel, IonList } from "@ionic/react";

import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";

export interface BeneficiariesFormProps extends RouteComponentProps {
    beneficiary?: any;
    onSubmit?: any;
}

export const BeneficiariesForm: React.FC<BeneficiariesFormProps> = (props) => { 

    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [second_lastname, setSecondLastName] = useState('');
    const [relationship, setRelationShip] = useState('');
    const [percentage, setPercentage] = useState('');
    const [phone, setPhone] = useState('');
    const [phone_verified, setPhoneVerified] = useState(false);


    useEffect( ()=>{
        //// checamos si estamos en modo edicion
        if( props.beneficiary ){
            setName(props.beneficiary.name);
            setLastName(props.beneficiary.lastname);
            setSecondLastName(props.beneficiary.second_lastname);
            setPercentage(props.beneficiary.percentage);
            setPhone(props.beneficiary.phone);
            setRelationShip(props.beneficiary.relationship);
            setPhoneVerified(props.beneficiary.phone_verified);

        }

    },[props.beneficiary]);

    function onUpdate() {
        const data = {
            fullname: `${name} ${lastname} ${second_lastname}`,
            name,
            lastname,
            second_lastname,
            relationship,
            percentage,
            phone,
            phone_verified
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
                    <IonLabel position="floating">Porcentaje</IonLabel>
                    <IonInput type="text" value={percentage} onIonChange={(e) => setPercentage(e.detail.value!)} ></IonInput>
                </IonItem>
                <IonItem>
                <IonInput type="text" value={phone} onIonChange={(e) => setPhone(e.detail.value!)}  disabled={phone_verified} placeholder='Numero celuar'></IonInput>
                    <IonBadge color={ phone_verified ? "success" : 'warning'}>
                    { phone_verified ? "Verificado!" : "No verificado.."}
                    </IonBadge>
                </IonItem>
                <div className="form-footer texto-centrado">
                    <IonButton onClick={onUpdate} color='secondary'>Guardar</IonButton>
                </div>
            </IonList>
        </div>
    );

}