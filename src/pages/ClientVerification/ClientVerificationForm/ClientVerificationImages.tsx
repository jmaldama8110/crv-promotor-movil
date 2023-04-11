import { IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonImg, IonInput, IonButton, IonIcon } from "@ionic/react";
import { camera, trashOutline } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { ButtonSlider } from "../../../components/SliderButtons";
import { GeneralPhoto, useCameraTaker } from "../../../hooks/useCameraTaker";
import { AppContext } from "../../../store/store";


export const ClientVerificationImages:React.FC< { onNext:any }> = ( { onNext }) =>{

    const { takePhoto, pics, setPics } = useCameraTaker();
    const { clientVerification } = useContext(AppContext);


    const onPhotoTitleUpdate = (e:any) =>{
        const itemPosition = pics.length - 1;
        const newData = pics.map( (i:GeneralPhoto,n)=>( itemPosition == n  ? { base64str: i.base64str,title: e.target.value, mimetype:i.mimetype, _id: i._id } : i ) );
        setPics([...newData]);
        
    }

    useEffect( ()=>{
        if(clientVerification._id){
            if( clientVerification.verification_imgs ){
                setPics(clientVerification.verification_imgs);
            }
        }
    },[clientVerification])

    const onSubmit = () =>{
        const data = {
            verification_imgs: pics,
        }

        onNext(data);
    }

    return (
        <IonList>
        <div>
            <IonItem><IonLabel>Fotos de Verificacion</IonLabel></IonItem>            
            <IonGrid>
                <IonRow>
                    {
                    pics.map((photo, index) => (
                    <IonCol size="6" key={index}>
                        {!photo.base64str && <IonImg src={`${process.env.REACT_APP_BASE_URL_API}/docs/img?id=${photo._id}`}></IonImg>}
                        {!!photo.base64str && <IonImg src={`data:image/jpeg;base64,${photo.base64str}`} ></IonImg>}
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
            { !!pics.length && !clientVerification._id &&<IonButton color='warning' onClick={ ()=>{
                setPics([]);
            }}><IonIcon icon={trashOutline}></IonIcon></IonButton>}
        </div>
        <ButtonSlider color="primary" label='Siguiente' expand="block" onClick={onSubmit} slideDirection={"F"}></ButtonSlider>
        <ButtonSlider color="medium" label='Anterior'  expand="block" onClick={() => {} } slideDirection={"B"}></ButtonSlider>
    </IonList>        
    );
}