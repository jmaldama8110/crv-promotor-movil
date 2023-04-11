import { IonButton, IonCol, IonGrid, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonRow } from "@ionic/react";
import { camera, trashOutline } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { GeneralPhoto, useCameraTaker } from "../../hooks/useCameraTaker";
import { AppContext } from "../../store/store";
import { ButtonSlider } from "../SliderButtons";


export const ClientFormComprobanteDomicilio: React.FC<{ onNext:any}> = ({ onNext })=>{

    const { takePhoto, pics, setPics } = useCameraTaker();
    const { clientData } = useContext(AppContext);

    const onPhotoTitleUpdate = (e:any) =>{
        const itemPosition = pics.length - 1;
        const newData = pics.map( (i:GeneralPhoto,n)=>( itemPosition == n  ? { base64str: i.base64str,title: e.target.value,mimetype: i.mimetype, _id: i._id } : i ) );
        setPics([...newData]);   
    }

    const onSubmit = () =>{
        const data = {
            comprobante_domicilio_pics: pics,
        }

        onNext(data);
    }
    
    useEffect( ()=>{
        if(clientData._id){
            if( clientData.comprobante_domicilio_pics){
                setPics(clientData.comprobante_domicilio_pics);
            }
        }
    },[clientData])
    return (
        <IonList className="ion-padding">
        <div>
            <IonItem><IonLabel>Comprobante Domicilio</IonLabel></IonItem>            
            <IonGrid>
                <IonRow>
                    {
                    
                    pics.map((photo, index) => (
                    <IonCol size="6" key={index}>
                        {! photo.base64str &&<IonImg src={`${process.env.REACT_APP_BASE_URL_API}/docs/img?id=${photo._id}`}></IonImg>}
                        {!! photo.base64str && <IonImg src={`data:image/jpeg;base64,${photo.base64str}`}></IonImg>}
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
            { !!pics.length &&<IonButton color='warning' onClick={ ()=>{
                setPics([]);
            }}><IonIcon icon={trashOutline}></IonIcon></IonButton>}
        </div>
        <ButtonSlider color="primary" label='Siguiente' expand="block" onClick={onSubmit} slideDirection={"F"}></ButtonSlider>
        <ButtonSlider color="medium" label='Anterior'  expand="block" onClick={() => {} } slideDirection={"B"}></ButtonSlider>
    </IonList>        
    );
}