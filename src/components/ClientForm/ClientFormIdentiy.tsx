import { IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonInput, IonButton } from "@ionic/react";
import { camera } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { useCameraTaker } from "../../hooks/useCameraTaker";
import { AppContext } from "../../store/store";
import { ButtonSlider } from "../SliderButtons";

export const ClientFormIdentity:React.FC< { onNext:any }> = ( { onNext }) =>{

    const { takePhoto, pics, setPics } = useCameraTaker();
    const { clientData} = useContext(AppContext);

    const onPhotoTitleUpdate = (e:any) =>{
        const itemPosition = pics.length - 1;
        const newData = pics.map( (i:any,n)=>( itemPosition == n  ? { base64str: i.base64str,title: e.target.value } : i ) );
        setPics([...newData]);
        
    }

    useEffect( ()=>{
        if(clientData._id){
            if( clientData.identity_pics )
                setPics(clientData.identity_pics);
        }
    },[clientData])

    const onSubmit = () =>{
        const data = {
            identity_pics: pics,
        }

        onNext(data);
    }

    return (
        <IonList className="ion-padding">
        <div className="contenido-loanform">
            <IonItem><IonLabel>Identificación (INE frontal y trasera)</IonLabel></IonItem>            
            <IonGrid>
                <IonRow>
                    {
                    pics.map((photo, index) => (
                    <IonCol size="6" key={index}>
                        <IonImg src={`data:image/jpeg;base64,${photo.base64str}`} ></IonImg>
                        {   /// si ya tiene un titulo, lo muestra, de otro modo, muestra el Input
                            photo.title ? <IonLabel>{photo.title}</IonLabel>
                            : <IonInput onIonBlur={onPhotoTitleUpdate} placeholder="Ingresa una descripcion" className="fuente-sm"></IonInput>
                        }   
                    </IonCol>
                    
                    ))
                    }
                </IonRow>
            </IonGrid>
            
            <IonButton onClick={() => takePhoto(20)}>
                <IonIcon icon={camera}></IonIcon>
            </IonButton>
        </div>
        <ButtonSlider color="primary" label='Siguiente' expand="block" onClick={onSubmit} slideDirection={"F"}></ButtonSlider>
        <ButtonSlider color="medium" label='Anterior'  expand="block" onClick={() => {} } slideDirection={"B"}></ButtonSlider>
    </IonList>        
    );
}