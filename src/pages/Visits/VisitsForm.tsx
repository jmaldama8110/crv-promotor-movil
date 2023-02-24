import { IonButton, IonCheckbox, IonCol, IonGrid, IonIcon, IonImg, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonRow } from "@ionic/react";
import { camera, trashOutline } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";

import { StarRank } from "../../components/StarRank";
import { useCameraTaker } from "../../hooks/useCameraTaker";
import { Geolocation } from "@capacitor/geolocation";
import { AppContext } from "../../store/store";
import { MemberInArrears } from "../../reducer/MembersInArrears";


export const VisitsForm: React.FC<{onSubmit:any}> = ({onSubmit})=>{

    const { takePhoto, pics, setPics } = useCameraTaker();
    const onPhotoTitleUpdate = (e:any) =>{
        const itemPosition = pics.length - 1;
        const newData = pics.map( (i:any,n)=>( itemPosition == n  ? { base64str: i.base64str,title: e.target.value } : i ) );
        setPics([...newData]);
        
    }

    const [ asisstStars, setAssistStars ]=  useState<boolean[]>([false, false, false,false, false])
    const [ harmonyStars, setHarmonyStars ]=  useState<boolean[]>([false, false, false,false, false])
    const [ punctualtStars, setPuntualStars ]=  useState<boolean[]>([false, false, false,false, false])
 
    const [completePayment, setCompletePayment] = useState<boolean>(false);
    const [internalArrears, setInternalArreas] = useState<boolean>(false);
    
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    
    const { membersInArrears, dispatchMembersInArrears } = useContext(AppContext)

    function onSend(){
        const data = {
            asisstStars,
            harmonyStars,
            punctualtStars,
            completePayment,
            internalArrears,
            visits_pics: pics,
            membersInArrears,
            coordinates: [lat,lng]
        }
        onSubmit(data);
    }

    async function onItemArrearsChange(e:any) {
        const idx = e.target.id.split("-")[1]
        const updateMbm = {
            idx,
            is_in_arrears: e.target.checked
        }
        dispatchMembersInArrears( { type: "UPDATE_MEMBER_INARREARS_CHECK",...updateMbm   })
    }

    async function onInputAmountChange(e:any) {
        const idx = e.target.id.split("-")[1]
        const updateMbm = {
            idx,
            arrears_amount: e.target.value
        }
        dispatchMembersInArrears( { type: "UPDATE_MEMBER_INARREARS_AMT",...updateMbm   })

    }
    useEffect(() => {
        async function loadCoordinates() {
          const coordsData = await Geolocation.getCurrentPosition();
          setLat(coordsData.coords.latitude);
          setLng(coordsData.coords.longitude);
        }
        loadCoordinates();
        
      }, []);

    return (
        <IonList>
            <IonItemDivider><IonLabel>Ranking General</IonLabel></IonItemDivider>
            <IonItem>
                <IonLabel>Asistencia</IonLabel>
                <StarRank starArray={asisstStars} setStarArray={setAssistStars}/>
            </IonItem>
            <IonItem>
                <IonLabel>Armonía</IonLabel>
                <StarRank starArray={harmonyStars} setStarArray={setHarmonyStars}/>
            </IonItem>
            <IonItem>
                <IonLabel>Pago puntual</IonLabel>
                <StarRank starArray={punctualtStars} setStarArray={setPuntualStars}/>
            </IonItem>
            <p></p>
            <div>
            <IonItemDivider><IonLabel>Fotos de las visita</IonLabel></IonItemDivider>            
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
            { !!pics.length &&<IonButton color='warning' onClick={ ()=>{
                setPics([]);
            }}><IonIcon icon={trashOutline}></IonIcon></IonButton>}
        </div>
            <IonItemDivider><IonLabel>Información del Pago</IonLabel></IonItemDivider>

            <IonItem>
                <IonLabel>Pago Completo por <strong>3,450</strong></IonLabel>
                <IonCheckbox slot='start' checked={completePayment} onIonChange={async (e) =>setCompletePayment(e.detail.checked)} />
            </IonItem>
            <IonItem>
                <IonLabel>Mora interna</IonLabel>
                <IonCheckbox slot='start' checked={internalArrears} onIonChange={async (e) =>setInternalArreas(e.detail.checked)} />
            </IonItem>
            { internalArrears &&
            <>
                <IonItemDivider><IonLabel>Integrantes</IonLabel></IonItemDivider>
                {membersInArrears.map( (mb:MemberInArrears)=>(
                    <IonItem key={mb._id}>
                        <IonCheckbox slot="start" value={mb.is_in_arrears} onIonChange={onItemArrearsChange} id={`arrearsmemb-${mb._id}`}></IonCheckbox>
                        <IonLabel>{mb.fullname}</IonLabel>
                        <IonInput type='text' placeholder="importe adeudo" value={mb.arrears_amount} id={`arrearsamtinput-${mb._id}`} onIonBlur={onInputAmountChange}></IonInput>
                    </IonItem>
                ))}
            </>}

            <p></p>
            <IonButton color='success' disabled={!pics.length} onClick={onSend}>Guardar Visita</IonButton>
        </IonList>
    );
}
