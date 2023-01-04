import { IonButton, IonCol, IonGrid, IonImg, IonInput, IonItem, IonLabel, IonList, IonRow, IonSegment, IonSegmentButton } from "@ionic/react";

import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useCameraTaker } from "../../../hooks/useCameraTaker";
import { Geolocation } from "@capacitor/geolocation";

export interface GuaranteeEqFormProps extends RouteComponentProps {
    equipment?: any;
    onSubmit?: any;
}

export const GuaranteesFormEq: React.FC<GuaranteeEqFormProps> = (props) => { 
    const [newUsed, setNewUsed] = useState('used');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [itemType, setItemType] = useState('');
    const [serie, setSerie] = useState('');
    const [yearPurchase, setYearPurchase] = useState('');
    const [yearRemain, setYearsReamain] = useState('');
    const [commercialValue, setCommercialValue] = useState('');
    const [lessOneYear, setLessOneYear] = useState('');
    const [actualConditions, setActualConditions] = useState('');

    const [lat,setLat] = useState(0);
    const [lng, setLng] = useState(0);


    const { takePhoto, pics, setPics } = useCameraTaker();

    useEffect( ()=>{
        //// checamos si estamos en modo edicion
        async function loadCoordinates (){
            const coordsData = await Geolocation.getCurrentPosition();
            setLat(coordsData.coords.latitude);
            setLng(coordsData.coords.longitude);
          }
          loadCoordinates();

        if( props.equipment ) {
            setBrand(props.equipment.brand);
            setCommercialValue(props.equipment.commercial_value);
            setActualConditions( props.equipment.condition);
            setDescription(props.equipment.description);
            setItemType(props.equipment.item_type);
            setLessOneYear(props.equipment.less_one_year);
            setNewUsed(props.equipment.new_used);
            if( props.equipment.photos) {
                setPics( props.equipment.photos);
            }
            setSerie(props.equipment.serie);
            setYearPurchase( props.equipment.year_purchase);
            setYearsReamain(props.equipment.years_remain);
            
        }

    },[props.equipment]);

    function onUpdate() {
        const data = {
            coordinates: [lat,lng],
            equipment: {
                brand,
                commercial_value: commercialValue,
                condition: actualConditions,
                description,
                item_type: itemType,
                less_one_year: lessOneYear,
                new_used: newUsed,
                photos: pics,
                serie,
                year_purchase: yearPurchase,
                years_remain: yearRemain,
            }
        }
        props.onSubmit(data);

    }

    return (
        <div>
            <IonList className="ion-padding">
                <IonItem>
                    <IonLabel position="floating">Descripcion</IonLabel>
                    <IonInput type="text" value={description} onIonChange={(e) => setDescription(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Marca</IonLabel>
                    <IonInput type="text" value={brand} onIonChange={(e) => setBrand(e.detail.value!)}></IonInput>
                </IonItem> 
                <IonItem>
                    <IonLabel position="floating">Tipo</IonLabel>
                    <IonInput type="text" value={itemType} onIonChange={(e) => setItemType(e.detail.value!)}></IonInput>
                </IonItem> 
                <IonItem>
                    <IonLabel position="floating">Serie</IonLabel>
                    <IonInput type="text" value={serie} onIonChange={(e) => setSerie(e.detail.value!)}></IonInput>
                </IonItem> 
                <IonItem>
                    <IonLabel position="floating">Año Compra</IonLabel>
                    <IonInput type="text" value={yearPurchase} onIonChange={(e) => setYearPurchase(e.detail.value!)}></IonInput>
                </IonItem> 
                <IonItem>
                    <IonLabel position="floating">Años Que Restan (Vida Util)</IonLabel>
                    <IonInput type="text" value={yearRemain} onIonChange={(e) => setYearsReamain(e.detail.value!)}></IonInput>
                </IonItem> 
                <IonItem>
                    <IonLabel position="floating">Valor Estimado</IonLabel>
                    <IonInput type="text" value={commercialValue} onIonChange={(e) => setCommercialValue(e.detail.value!)}></IonInput>
                </IonItem> 
                <IonSegment value={newUsed} onIonChange={(e) => setNewUsed(e.detail.value!)}>
                    <IonSegmentButton value="new"> <IonLabel>Nuevo</IonLabel> </IonSegmentButton>
                    <IonSegmentButton value="used"> <IonLabel>Usado</IonLabel> </IonSegmentButton>
               </IonSegment>
               {
                newUsed === 'new' && 
                <IonItem>
                    <IonLabel position="floating">Tiene Menos de 1 año?</IonLabel>
                    <IonInput type="text" value={lessOneYear} onIonChange={(e) => setLessOneYear(e.detail.value!)}></IonInput>
                </IonItem> 
               }
               {
                newUsed === 'used' &&
                <IonItem>
                    <IonLabel position="floating">Condicion</IonLabel>
                    <IonInput type="text" value={actualConditions} onIonChange={(e) => setActualConditions(e.detail.value!)}></IonInput>
                </IonItem> 
               }
                <div className="pics-section texto-centrado margen-arriba">
                    <IonButton onClick={ ()=> takePhoto(20)}>Tomar Fotos</IonButton>
                    <IonGrid>
                        <IonRow>
                            {pics.map((photo, index) => (
                            <IonCol size="6" key={index}>
                                <IonImg src={`data:image/jpeg;base64,${photo.base64str}`} ></IonImg>
                            </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>

                </div>
                <div className="form-footer texto-centrado">
                    <IonButton onClick={onUpdate} color='secondary'>Guardar</IonButton>
                </div>


   
            </IonList>
        </div>
    );

}