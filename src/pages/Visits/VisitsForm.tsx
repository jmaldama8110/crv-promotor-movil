import { IonButton, IonCheckbox, IonCol, IonGrid, IonIcon, IonImg, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonRow, useIonActionSheet } from "@ionic/react";
import { camera, trashOutline } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";

import { StarRank } from "../../components/StarRank";
import { GeneralPhoto, useCameraTaker } from "../../hooks/useCameraTaker";
import { Geolocation } from "@capacitor/geolocation";
import { AppContext } from "../../store/store";
import { MemberInArrears } from "../../reducer/MembersInArrearsReducer";
import { locationOutline } from 'ionicons/icons';
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { Browser } from "@capacitor/browser";
import { QuizElement } from "../../reducer/QuizReducer";

export const VisitsForm: React.FC<{onSubmit:any, visitData?:any}> = ({onSubmit, visitData})=>{

    const { takePhoto, pics, setPics } = useCameraTaker();

    const onPhotoTitleUpdate = (e:any) =>{
        const itemPosition = pics.length - 1;
        const newData = pics.map( (i:GeneralPhoto,n)=>( itemPosition == n  ? { base64str: i.base64str,title: e.target.value,mimetype: i.mimetype, _id: i._id } : i ) );
        setPics([...newData]);
    }

    const [ asisstStars, setAssistStars ]=  useState<boolean[]>([false, false, false,false, false])
    const [ harmonyStars, setHarmonyStars ]=  useState<boolean[]>([false, false, false,false, false])
    const [ punctualtStars, setPuntualStars ]=  useState<boolean[]>([false, false, false,false, false])
 
    const [completePayment, setCompletePayment] = useState<boolean>(false);
    const [internalArrears, setInternalArreas] = useState<boolean>(false);

    const [visitQuiz, setVisitQuiz] = useState<boolean>(false);
    
    
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [present] = useIonActionSheet();
    const [geoActions, setGeoActions] = useState<OverlayEventDetail>();
    
    const { membersInArrears, dispatchMembersInArrears, visitQuizChecklist, dispatchVisitQuizChecklist } = useContext(AppContext)

    async function onSend(){
        const data = {
            asisstStars,
            harmonyStars,
            punctualtStars,
            completePayment,
            internalArrears,
            visits_pics: pics,
            membersInArrears,
            visitQuizChecklist,
            visitQuiz,
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

    async function onVisitCheckChange(e:any) {
        const idx = parseInt(e.target.id.split("-")[1])
        const updateCheck = {
            idx,
            done: e.target.checked
        }
        dispatchVisitQuizChecklist( { type: "UPDATE_QUIZ_CHECK",...updateCheck   })
        
    }

    async function onInputNoteChange (e:any) {
        const idx = parseInt(e.target.id.split('-')[1]);
        const updateNote = {
            idx,
            note: e.target.value
        }
        dispatchVisitQuizChecklist({ type: 'UPDATE_QUIZ_NOTE',...updateNote})
    }
    useEffect(() => {
        async function loadCoordinates() {
          const coordsData = await Geolocation.getCurrentPosition();
          setLat(coordsData.coords.latitude);
          setLng(coordsData.coords.longitude);
        }
        loadCoordinates();
      }, []);

      useEffect( ()=>{

        /// If we are in edit mode
        if( !!visitData ){
            setHarmonyStars(visitData.harmonyStars);
            setPuntualStars(visitData.punctualtStars);
            setAssistStars( visitData.asisstStars);
            setPics( visitData.visits_pics);
            setCompletePayment(visitData.completePayment);
            setInternalArreas(visitData.internalArrears);
            setVisitQuiz(visitData.visitQuiz);
            if(visitData.internalArrears){
                dispatchMembersInArrears( { type: "POPULATE_MEMBERS_INARREARS",data: visitData.membersInArrears});
            }
            if( visitData.visitQuiz){
                dispatchVisitQuizChecklist({type: "POPULATE_QUIZ", data: visitData.visitQuizChecklist })
            }
        }
      },[visitData])

      function onViewLocations () {
        const buttons = [ 
                          { text: 'Indicaciones', role:"destructive",data: { action: 'directions'}},
                          { text: 'Ver Mapa', data: { action: "map-view" } }
                        ]
                        present(
                          { header: 'Ubicacion',
                            subHeader: 'Indique modo del mapa:',
                            buttons,
                              onDidDismiss: ({ detail }) => setGeoActions(detail),
                            })
      }
      useEffect( ()=>{

        async function loadOptions (){
          if( geoActions) {
            if( geoActions.data ){
                if( geoActions.data.action === 'directions'){
                  await Browser.open({ url: `https://www.google.com/maps/dir/?api=1&destination=${visitData.coordinates[0]}%2C${visitData.coordinates[1]}` });
                }
                if( geoActions.data.action === 'map-view'){
                  await Browser.open({ url: `https://www.google.com/maps/@?api=1&map_action=map&zoom=18&center=${visitData.coordinates[0]}%2C${visitData.coordinates[1]}` });            
                }
            }
          }
            
        }
        loadOptions();
      },[geoActions])
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
                        {! photo.base64str &&<IonImg src={`${process.env.REACT_APP_BASE_URL_API}/docs/img?id=${photo._id}`}></IonImg>}
                        {!!photo.base64str && <IonImg src={`data:image/jpeg;base64,${photo.base64str}`}></IonImg>}
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
            <IonItem>
                <IonLabel>Mi Espacio Mujer</IonLabel>
                <IonCheckbox slot='start' checked={visitQuiz} onIonChange={async (e) =>setVisitQuiz(e.detail.checked)} />
            </IonItem>

            { internalArrears &&
            <>
                <IonItemDivider><IonLabel>Integrantes</IonLabel></IonItemDivider>
                {membersInArrears.map( (mb:MemberInArrears)=>(
                    <IonItem key={mb._id}>
                        <IonCheckbox slot="start" checked={mb.is_in_arrears} onIonChange={onItemArrearsChange} id={`arrearsmemb-${mb._id}`}></IonCheckbox>
                        <IonLabel>{mb.fullname}</IonLabel>
                        <IonInput type='text' placeholder="importe adeudo" value={mb.arrears_amount} id={`arrearsamtinput-${mb._id}`} onIonBlur={onInputAmountChange}></IonInput>
                    </IonItem>
                ))}
            </>}
            { visitQuiz &&
            <>
                <IonItemDivider><IonLabel>Acciones Realizas</IonLabel></IonItemDivider>
                { visitQuizChecklist.map( (ac:QuizElement) =>(
                    <IonItem key={ac.id}>
                        <IonCheckbox slot="start" checked={ac.done} onIonChange={onVisitCheckChange} id={`certificationactioncheck-${ac.id}`}></IonCheckbox>
                        <IonLabel>{ac.title}</IonLabel>
                        <IonInput type='text' placeholder="...describa" value={ac.note} id={`certificationactionnote-${ac.id}`} onIonBlur={onInputNoteChange}></IonInput>
                    </IonItem>
                ))

                }
                
            </>
            }


            <p></p>
            { !visitData && <IonButton color='success' disabled={!pics.length} onClick={onSend}>Guardar Visita</IonButton>}
            { !!visitData && <IonButton color="success" onClick={onViewLocations}> <IonIcon icon={locationOutline}></IonIcon>Ubicación</IonButton>}
        </IonList>
    );
}
