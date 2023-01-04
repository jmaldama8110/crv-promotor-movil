import { IonButton, IonCol, IonGrid, IonImg, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonRow } from "@ionic/react";

import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useCameraTaker } from "../../../hooks/useCameraTaker";
import { Geolocation } from "@capacitor/geolocation";

export interface GuaranteeVhFormProps extends RouteComponentProps {
    vehicle?: any;
    onSubmit?: any;
}
interface DeprecData {
    year: string;
    amount: string;
    accum: string;
}

export const GuaranteesFormVh: React.FC<GuaranteeVhFormProps> = (props) => { 

    const { takePhoto, pics, setPics } = useCameraTaker();
    const [lat,setLat] = useState(0);
    const [lng, setLng] = useState(0);

    const [description, setDescription] = useState('');
    const [color , setColor] = useState('');
    const [model, setModel] = useState('');
    const [origin, setOrigin] = useState('');
    const [motor_number, setMotorNumber] = useState('');
    const [chasis_number, setChasisNumber] = useState('');
    const [plate_number, setPlateNumber] = useState('');
    const [doors, setDoors] = useState('');
    const [km, setKm] = useState('');
    const [general_condition, setGeneralCondition] = useState('');
    const [years_remain, setYearsRemain] = useState('');

    const [fuel, setFuel] = useState('');
    const [combustion, setCombustion] = useState('');
    const [reference, setReference] = useState('');
    const [motor_condition, setMotorConditions] = useState('');

    const [transmision, setTransmision] = useState('');
    const [velocities, setVelocities] = useState('');
    const [back_traction, setBackTraction] = useState('');
    const [front_traction, setFrontTraction] = useState('');
    const [double_traction, setDoubleTraction] = useState('');
    const [body_condition, setBodyCondition] = useState('');
    const [wheel_direction, setWheelDirection] = useState('');
    const [wheel_direction_condition, setWheelDirectionCondition] = useState('');

    const [clutch, setClutch] = useState('');
    const [suspention, setSuspension] = useState('');
    const [breaks, setBreaks] = useState('');
    const [locks, setLocks] = useState('');
    const [tapestry, setTapestry] = useState('');
    const [wheels, setWheels] = useState('');
    const [painting, setPainting] = useState('');

    const [blue_book, setBlueBook] = useState('');
    const [sale_value, setSaleValue] = useState('');
    const [depreciation, setDepreciation] = useState<DeprecData[]>([]);

    const [deprec_year, setYearDeprec] = useState('');
    const [deprec_amount, setAmountDeprec] = useState('');
    const [deprec_accum, setAccumDeprec] = useState('');

    useEffect( ()=>{
                //// loads Geolocation of device
        async function loadCoordinates () {
            const coordsData = await Geolocation.getCurrentPosition();
            setLat(coordsData.coords.latitude);
            setLng(coordsData.coords.longitude);
        }
        loadCoordinates();
        //// checamos si estamos en modo edicion
        if( props.vehicle ) {

            setDescription(props.vehicle.description);
            setColor(props.vehicle.color);
            setModel(props.vehicle.model);
            setOrigin(props.vehicle.origin);
            setMotorNumber(props.vehicle.motor_number);
            setChasisNumber(props.vehicle.chasis_number);
            setPlateNumber(props.vehicle.plate_number);
            setDoors(props.vehicle.doors);
            setKm(props.vehicle.km);
            setGeneralCondition(props.vehicle.general_condition);
            setYearsRemain(props.vehicle.years_remain);
        
            setFuel(props.vehicle.fuel);
            setCombustion(props.vehicle.combustion);
            setReference(props.vehicle.reference);
            setMotorConditions(props.vehicle.motor_condition);
        
            setTransmision(props.vehicle.transmision);
            setVelocities(props.vehicle.velocities);
            setBackTraction(props.vehicle.back_traction);
            setFrontTraction(props.vehicle.front_traction);
            setDoubleTraction(props.vehicle.double_traction);
            setBodyCondition(props.vehicle.body_condition);
            setWheelDirection(props.vehicle.wheel_direction);
            setWheelDirectionCondition(props.vehicle.wheel_direction_condition);
        
            setClutch(props.vehicle.clutch);
            setSuspension(props.vehicle.suspention);
            setBreaks(props.vehicle.breaks);
            setLocks(props.vehicle.locks);
            setTapestry(props.vehicle.tapestry);
            setWheels(props.vehicle.wheels);
            setPainting(props.vehicle.painting);
        
            setBlueBook(props.vehicle.blue_book);
            setSaleValue(props.vehicle.sale_value);

            if( props.vehicle.photos) {
                setPics( props.vehicle.photos);
            }
            if( props.vehicle.depreciation ){
                setDepreciation( props.vehicle.depreciation);
            }
            
        }

    },[props.vehicle]);
    const onAddDeprecItem = ()=>{
        const newItem: DeprecData = {
            year: deprec_year,
            amount: deprec_amount,
            accum: deprec_accum
        }
        const newArray = depreciation.map( (i:DeprecData)=> ({ year: i.year, amount: i.amount, accum:i.accum}));
        newArray.push(newItem);
        
        setDepreciation(newArray);
    }

    const onDeleteDeprecItem = (e:any) => {
        const idItemDelete = e.target.id.replace('deprec-but-','');
        const newArray = depreciation.filter( (i:DeprecData) =>i.year !== idItemDelete);
        setDepreciation( newArray);
    }

    function onUpdate() {
        const data = {
            coordinates: [lat,lng],
            vehicle: {
                description,
                color,
                model,
                origin,
                motor_number,
                chasis_number,
                plate_number,
                doors,
                km,
                general_condition,
                years_remain,
                fuel,
                combustion,
                reference,
                motor_condition,
                transmision,
                velocities,
                back_traction,
                front_traction,
                double_traction,
                body_condition,
                wheel_direction,
                wheel_direction_condition,
                clutch,
                suspention,
                breaks,
                locks,
                tapestry,
                wheels,
                painting,
                blue_book,
                sale_value,
                depreciation,
                photos: pics
            }
        }
        props.onSubmit(data);
        
    }

    return (
        <div>
            <IonList className="ion-padding">
            <IonItemGroup>

                <IonItemDivider><IonLabel>Caracteristicas </IonLabel>
                </IonItemDivider>

                <IonItem>
                    <IonLabel position="floating">Vehiculo</IonLabel>
                    <IonInput type="text" value={description} onIonChange={(e) => setDescription(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Color</IonLabel>
                    <IonInput type="text" value={color} onIonChange={(e) => setColor(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Modelo</IonLabel>
                    <IonInput type="text" value={model} onIonChange={(e) => setModel(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Procedencia</IonLabel>
                    <IonInput type="text" value={origin} onIonChange={(e) => setOrigin(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Numero de Motor</IonLabel>
                    <IonInput type="text" value={motor_number} onIonChange={(e) => setMotorNumber(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Numero de Chasis</IonLabel>
                    <IonInput type="text" value={chasis_number} onIonChange={(e) => setChasisNumber(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Placas</IonLabel>
                    <IonInput type="text" value={plate_number} onIonChange={(e) => setPlateNumber(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Numero de Puertas</IonLabel>
                    <IonInput type="text" value={doors} onIonChange={(e) => setDoors(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Kilometraje</IonLabel>
                    <IonInput type="text" value={km} onIonChange={(e) => setKm(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Condiciones Generales</IonLabel>
                    <IonInput type="text" value={general_condition} onIonChange={(e) => setGeneralCondition(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Vida Util</IonLabel>
                    <IonInput type="text" value={years_remain} onIonChange={(e) => setYearsRemain(e.detail.value!)}></IonInput>                
                </IonItem>

            </IonItemGroup>

            <IonItemGroup>
                <IonItemDivider><IonLabel>Caractéristicas del Motor</IonLabel>
                </IonItemDivider>

                <IonItem>
                    <IonLabel position="floating">Combustible</IonLabel>
                    <IonInput type="text" value={fuel} onIonChange={(e) => setFuel(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Combustión</IonLabel>
                    <IonInput type="text" value={combustion} onIonChange={(e) => setCombustion(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Referencia</IonLabel>
                    <IonInput type="text" value={reference} onIonChange={(e) => setReference(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Condiciones Generales</IonLabel>
                    <IonInput type="text" value={motor_condition} onIonChange={(e) => setMotorConditions(e.detail.value!)}></IonInput>                
                </IonItem>
            </IonItemGroup>

            <IonItemGroup>
                <IonItemDivider><IonLabel>Carrocería</IonLabel>
                </IonItemDivider>
                <IonItem>
                    <IonLabel position="floating">Transmisión</IonLabel>
                    <IonInput type="text" value={transmision} onIonChange={(e) => setTransmision(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Velocidad</IonLabel>
                    <IonInput type="text" value={velocities} onIonChange={(e) => setVelocities(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Tracción Trasera</IonLabel>
                    <IonInput type="text" value={back_traction} onIonChange={(e) => setBackTraction(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Tracción Frontal</IonLabel>
                    <IonInput type="text" value={front_traction} onIonChange={(e) => setFrontTraction(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Doble Tracción</IonLabel>
                    <IonInput type="text" value={double_traction} onIonChange={(e) => setDoubleTraction(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Condiciones General Carrocería</IonLabel>
                    <IonInput type="text" value={body_condition} onIonChange={(e) => setBodyCondition(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Dirección</IonLabel>
                    <IonInput type="text" value={wheel_direction} onIonChange={(e) => setWheelDirection(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Condición General Dirección</IonLabel>
                    <IonInput type="text" value={wheel_direction_condition} onIonChange={(e) => setWheelDirectionCondition(e.detail.value!)}></IonInput>                
                </IonItem>
            </IonItemGroup>

            <IonItemGroup>
                <IonItemDivider><IonLabel>Mecanismos y Aspectos Generales</IonLabel>
                </IonItemDivider>

                <IonItem>
                    <IonLabel position="floating">Embrague</IonLabel>
                    <IonInput type="text" value={clutch} onIonChange={(e) => setClutch(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Suspensión</IonLabel>
                    <IonInput type="text" value={suspention} onIonChange={(e) => setSuspension(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Frenos</IonLabel>
                    <IonInput type="text" value={breaks} onIonChange={(e) => setBreaks(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Cerraduras</IonLabel>
                    <IonInput type="text" value={locks} onIonChange={(e) => setLocks(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Tapicería</IonLabel>
                    <IonInput type="text" value={tapestry} onIonChange={(e) => setTapestry(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Llantas</IonLabel>
                    <IonInput type="text" value={wheels} onIonChange={(e) => setWheels(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Pintura</IonLabel>
                    <IonInput type="text" value={painting} onIonChange={(e) => setPainting(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Valor Libro Azul</IonLabel>
                    <IonInput type="text" value={blue_book} onIonChange={(e) => setBlueBook(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Valor de Liquidación</IonLabel>
                    <IonInput type="text" value={sale_value} onIonChange={(e) => setSaleValue(e.detail.value!)}></IonInput>                
                </IonItem>
            </IonItemGroup>
    
            <IonItemGroup>
                <IonItemDivider><IonLabel>Depreciación del vehiculo</IonLabel>
                </IonItemDivider>
                <IonGrid>
                    <IonRow>
                        <IonCol size="2"><IonLabel>Año</IonLabel></IonCol>
                        <IonCol size="3"><IonLabel>Importe</IonLabel></IonCol>
                        <IonCol size="4"><IonLabel>Acumulado</IonLabel></IonCol>
                        <IonCol size="2"><IonLabel></IonLabel></IonCol>
                    </IonRow>
                </IonGrid>
                <IonGrid>
                        {
                            depreciation.map( (i:any, n:number)=>(
                                <IonRow key={n}>
                                    <IonCol size="2">
                                        <IonLabel>{i.year}</IonLabel>
                                    </IonCol>
                                    <IonCol size="3">
                                        <IonLabel>{i.amount}</IonLabel>
                                    </IonCol>
                                    <IonCol size="4">
                                        <IonLabel>{i.accum}</IonLabel>
                                    </IonCol>
                                    <IonCol size="2">
                                        <IonButton onClick={onDeleteDeprecItem} id={`deprec-but-${i.year}`}>x</IonButton>
                                    </IonCol>
                                </IonRow>
                            ))
                        }
                </IonGrid>
                <IonGrid>
                    <IonRow>
                        <IonCol size="2"><IonInput className="borde-claro" placeholder="Año" value={deprec_year} onIonChange={(e) => setYearDeprec(e.detail.value!)}></IonInput></IonCol>
                        <IonCol size="3"><IonInput className="borde-claro" placeholder="valor" value={deprec_amount} onIonChange={(e) => setAmountDeprec(e.detail.value!)}></IonInput></IonCol>
                        <IonCol size="4"><IonInput className="borde-claro" placeholder="acumulado" value={deprec_accum} onIonChange={(e) => setAccumDeprec(e.detail.value!)}></IonInput ></IonCol>
                        <IonCol size="2"><IonButton onClick={onAddDeprecItem}>+</IonButton></IonCol>
                    </IonRow>
                </IonGrid>

            </IonItemGroup>
 
 
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