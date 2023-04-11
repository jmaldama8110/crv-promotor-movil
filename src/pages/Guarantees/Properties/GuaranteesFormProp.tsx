import { IonButton, IonCol, IonGrid, IonImg, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonRow, IonTextarea } from "@ionic/react";

import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useCameraTaker } from "../../../hooks/useCameraTaker";
import { Geolocation } from "@capacitor/geolocation";

export interface GuaranteePropFormProps extends RouteComponentProps {
    property?: any;
    onSubmit?: any;
}

export const GuaranteesFormProp: React.FC<GuaranteePropFormProps> = (props) => { 

    const { takePhoto, pics, setPics } = useCameraTaker();

    const [description, setDescription] = useState('');
    const [ownership_name, setOwnershipName] = useState('');
    
    const [lat,setLat] = useState(0);
    const [lng, setLng] = useState(0);

    const [street_name, setStreetName] = useState('');
    const [prop_location, setPropLocation] = useState('');
    const [zone, setZone] = useState('');

    const [water_direct_take, setWaterDirectTake] = useState('');
    const [water_public_pool, setWaterPublicPool] = useState('');
    const [water_cistern, setWaterCistern] = useState('');
    const [water_other, setWaterOther] = useState('');
    
    const [drain_public_grid, setDrainPublicGrid] = useState('');
    const [drain_dripping, setDrainDripping] = useState('');
    const [drain_septic_tank, setDrainSepticTank] = useState('');
    
    const [road_access_dirt, setRoadAccessDirt] = useState('');
    const [road_access_stone, setRoadAccessStone] = useState('');
    const [road_access_cobble, setRoadAccessCobble] = useState('');
    const [road_access_concrete, setRoadAccessConcrete] = useState('');
    const [road_access_onfoot, setRoadAccessOnfoot] = useState(''); // on foot
    const [road_access_car, setRoadAccessCar] = useState(''); // car

    const [edification_surface_size, setEdificationSurfaceSize] = useState('');
    const [edification_toliet, setEdificationToilet] = useState('');
    const [edification_garage, setEdificationGarage] = useState('');
    const [edification_rooms, setEdificationRooms] = useState('');
    const [edification_kitchen, setEdificationKitchen] = useState('');
    const [edification_dinning, setEdificationDinning] = useState('');
    const [edification_living, setEdificationLiving] = useState('');

    const [materials_foundations, setMaterialsFoundations] = useState('');
    const [materials_roof, setMaterialsRoof] = useState('');
    const [materials_doors, setMaterialsDoors] = useState('');
    const [materials_finishes, setMaterialsFinishes] = useState('');
    const [materials_walls, setMaterialsWalls] = useState('');
    const [materials_floor, setMaterialsFloor] = useState('');
    const [materials_windows, setMaterialsWindows] = useState('');
    const [materials_general_condition, setMaterialsGeneralCondition] = useState('');

    const [market_value, setMarketValue] = useState('');
    const [proportional_value, setProportionalValue] = useState('');
    const [max_loan_amount, setMaxLoanAmount] = useState('');
    const [metrics_m2_01, setMetricsM201] = useState('');
    const [metrics_up_01, setMetricsUP01] = useState('');
    const [metrics_m2_02, setMetricsM202] = useState('');
    const [metrics_up_02, setMetricsUP02] = useState('');
    const [comments, setComments] = useState('');

    useEffect( ()=>{
        //// checamos si estamos en modo edicion
        async function loadCoordinates (){
            const coordsData = await Geolocation.getCurrentPosition();
            setLat(coordsData.coords.latitude);
            setLng(coordsData.coords.longitude);
          }
          loadCoordinates();

        if( props.property ) {

            setDescription(props.property.description);
            setOwnershipName(props.property.ownership_name);

            setStreetName(props.property.street_name)
            setPropLocation(props.property.prop_location)
            setZone(props.property.zone)
            setWaterDirectTake(props.property.water_direct_take)
            setWaterPublicPool(props.property.water_public_pool)
            setWaterCistern(props.property.water_cistern)
            setWaterOther(props.property.water_other)
            setDrainDripping(props.property.drain_dripping)
            setDrainPublicGrid(props.property.drain_public_grid)
            setDrainSepticTank(props.property.drain_septic_tank)

            setRoadAccessCar(props.property.road_access_car)
            setRoadAccessCobble(props.property.road_access_cobble)
            setRoadAccessConcrete(props.property.road_access_concrete)
            setRoadAccessDirt(props.property.road_access_dirt)
            setRoadAccessOnfoot(props.property.road_access_onfoot)
            setRoadAccessStone(props.property.road_access_stone)
            
            setEdificationDinning(props.property.edification_dinning)
            setEdificationGarage(props.property.edification_garage)
            setEdificationKitchen(props.property.edification_kitchen)
            setEdificationLiving(props.property.edification_living)
            setEdificationRooms(props.property.edification_rooms)
            setEdificationSurfaceSize(props.property.edification_surface_size)
            setEdificationToilet(props.property.edification_toliet)
            setMaterialsDoors(props.property.materials_doors)
            setMaterialsFinishes(props.property.materials_finishes)
            setMaterialsFloor(props.property.materials_floor)
            setMaterialsFoundations(props.property.materials_foundations)
            setMaterialsGeneralCondition(props.property.materials_general_condition)
            setMaterialsRoof(props.property.materials_roof)
            setMaterialsWalls(props.property.materials_walls)
            setMaterialsWindows(props.property.materials_windows)
            setMarketValue(props.property.market_value)
            setProportionalValue(props.property.proportional_value)
            setMaxLoanAmount(props.property.max_loan_amount)
            setMetricsM201(props.property.metrics_m2_01)
            setMetricsM202(props.property.metrics_m2_02)
            setMetricsUP01(props.property.metrics_up_01)
            setMetricsUP02(props.property.metrics_up_02)
            setComments(props.property.comments)
            if( props.property.photos) {
                setPics( props.property.photos);
            }

        }

    },[props.property]);


    function onUpdate() {
        const data = {
            coordinates: [lat,lng],
            property: {
                description,
                ownership_name,
                street_name,
                prop_location,
                zone,
                water_direct_take,
                water_public_pool,
                water_cistern,
                water_other,
                drain_dripping,
                drain_public_grid,
                drain_septic_tank,
                road_access_car,
                road_access_cobble,
                road_access_concrete,
                road_access_dirt,
                road_access_onfoot,
                road_access_stone,
                edification_dinning,
                edification_garage,
                edification_kitchen,
                edification_living,
                edification_rooms,
                edification_surface_size,
                edification_toliet,
                materials_doors,
                materials_finishes,
                materials_floor,
                materials_foundations,
                materials_general_condition,
                materials_roof,
                materials_walls,
                materials_windows,
                market_value,
                proportional_value,
                max_loan_amount,
                metrics_m2_01,
                metrics_m2_02,
                metrics_up_01,
                metrics_up_02,
                comments,
                photos: pics
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
                    <IonLabel position="floating">Nombre del propietario</IonLabel>
                    <IonInput type="text" value={ownership_name} onIonChange={(e) => setOwnershipName(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Calle</IonLabel>
                    <IonInput type="text" value={street_name} onIonChange={(e) => setStreetName(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Ubicacion de la propiedad</IonLabel>
                    <IonInput type="text" value={prop_location} onIonChange={(e) => setPropLocation(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Zona</IonLabel>
                    <IonInput type="text" value={zone} onIonChange={(e) => setZone(e.detail.value!)}></IonInput>                
                </IonItem>

            <IonItemGroup>
                <IonItemDivider><IonLabel>Servicios Basicos</IonLabel>
                </IonItemDivider>
                <IonItem><IonLabel>Agua Potable</IonLabel></IonItem>

                <IonItem>
                    <IonLabel position="floating">Toma Directa al Domicilio</IonLabel>
                    <IonInput type="text" value={water_direct_take} onIonChange={(e) => setWaterDirectTake(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Pileta Publica</IonLabel>
                    <IonInput type="text" value={water_public_pool} onIonChange={(e) => setWaterPublicPool(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Cisterna</IonLabel>
                    <IonInput type="text" value={water_cistern} onIonChange={(e) => setWaterCistern(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Otro</IonLabel>
                    <IonInput type="text" value={water_other} onIonChange={(e) => setWaterOther(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem> <IonLabel>Alcantarillado</IonLabel></IonItem>
                <IonItem>
                    <IonLabel position="floating">Red Publica</IonLabel>
                    <IonInput type="text" value={drain_public_grid} onIonChange={(e) => setDrainPublicGrid(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Escurrimiento</IonLabel>
                    <IonInput type="text" value={drain_dripping} onIonChange={(e) => setDrainDripping(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Fosa Septica</IonLabel>
                    <IonInput type="text" value={drain_septic_tank} onIonChange={(e) => setDrainSepticTank(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem> <IonLabel>Vias de Acceso</IonLabel></IonItem>
                <IonItem>
                    <IonLabel position="floating">Tierra</IonLabel>
                    <IonInput type="text" value={road_access_dirt} onIonChange={(e) => setRoadAccessDirt(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Empedrado</IonLabel>
                    <IonInput type="text" value={road_access_stone} onIonChange={(e) => setRoadAccessStone(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Encementado</IonLabel>
                    <IonInput type="text" value={road_access_concrete} onIonChange={(e) => setRoadAccessConcrete(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Adoquinado</IonLabel>
                    <IonInput type="text" value={road_access_cobble} onIonChange={(e) => setRoadAccessCobble(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Acceso a Pie</IonLabel>
                    <IonInput type="text" value={road_access_onfoot} onIonChange={(e) => setRoadAccessOnfoot(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Acceso en Vehiculo</IonLabel>
                    <IonInput type="text" value={road_access_car} onIonChange={(e) => setRoadAccessCar(e.detail.value!)}></IonInput>                
                </IonItem>

            </IonItemGroup>

            <IonItemGroup>
                <IonItemDivider><IonLabel>Edificacion</IonLabel>
                </IonItemDivider>
                <IonItem>
                    <IonLabel position="floating">Superficie Edificada</IonLabel>
                    <IonInput type="text" value={edification_surface_size} onIonChange={(e) => setEdificationSurfaceSize(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Baño</IonLabel>
                    <IonInput type="text" value={edification_toliet} onIonChange={(e) => setEdificationToilet(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Cochera</IonLabel>
                    <IonInput type="text" value={edification_garage} onIonChange={(e) => setEdificationGarage(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Habitaciones</IonLabel>
                    <IonInput type="text" value={edification_rooms} onIonChange={(e) => setEdificationRooms(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Cocina</IonLabel>
                    <IonInput type="text" value={edification_kitchen} onIonChange={(e) => setEdificationKitchen(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Comedor</IonLabel>
                    <IonInput type="text" value={edification_dinning} onIonChange={(e) => setEdificationDinning(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Sala</IonLabel>
                    <IonInput type="text" value={edification_living} onIonChange={(e) => setEdificationLiving(e.detail.value!)}></IonInput>                
                </IonItem>

  
            </IonItemGroup>

            <IonItemGroup>
                <IonItemDivider><IonLabel>Materiales</IonLabel>
                </IonItemDivider>

                <IonItem>
                    <IonLabel position="floating">Cimentacion</IonLabel>
                    <IonInput type="text" value={materials_foundations} onIonChange={(e) => setMaterialsFoundations(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Techo</IonLabel>
                    <IonInput type="text" value={materials_roof} onIonChange={(e) => setMaterialsRoof(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Puertas</IonLabel>
                    <IonInput type="text" value={materials_doors} onIonChange={(e) => setMaterialsDoors(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Acabados</IonLabel>
                    <IonInput type="text" value={materials_finishes} onIonChange={(e) => setMaterialsFinishes(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Muros</IonLabel>
                    <IonInput type="text" value={materials_walls} onIonChange={(e) => setMaterialsWalls(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Pisos</IonLabel>
                    <IonInput type="text" value={materials_floor} onIonChange={(e) => setMaterialsFloor(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Ventanas</IonLabel>
                    <IonInput type="text" value={materials_windows} onIonChange={(e) => setMaterialsWindows(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Estado en General</IonLabel>
                    <IonInput type="text" value={materials_general_condition} onIonChange={(e) => setMaterialsGeneralCondition(e.detail.value!)}></IonInput>                
                </IonItem>


            </IonItemGroup>
 
            <IonItemGroup>
                <IonItemDivider><IonLabel>Tabla de Valores</IonLabel>
                </IonItemDivider>

                <IonItem>
                    <IonLabel position="floating">Valor Comercial 100%</IonLabel>
                    <IonInput type="text" value={market_value} onIonChange={(e) => setMarketValue(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Valor de Realizacion 85%</IonLabel>
                    <IonInput type="text" value={proportional_value} onIonChange={(e) => setProportionalValue(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Monto Maximo del Prestamo</IonLabel>
                    <IonInput type="text" value={max_loan_amount} onIonChange={(e) => setMaxLoanAmount(e.detail.value!)}></IonInput>                
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">M2</IonLabel>
                    <IonInput type="text" value={metrics_m2_01} onIonChange={(e) => setMetricsM201(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">U/P</IonLabel>
                    <IonInput type="text" value={metrics_up_01} onIonChange={(e) => setMetricsUP01(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItemDivider><IonLabel>Total 1</IonLabel></IonItemDivider>
                <IonItem>
                    <IonLabel position="floating">M2</IonLabel>
                    <IonInput type="text" value={metrics_m2_02} onIonChange={(e) => setMetricsM202(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">U/P</IonLabel>
                    <IonInput type="text" value={metrics_up_02} onIonChange={(e) => setMetricsUP02(e.detail.value!)}></IonInput>                
                </IonItem>
                <IonItemDivider><IonLabel>Total 2</IonLabel></IonItemDivider>
                <IonItem>
                    <IonLabel position="floating">Comentarios Adicionales</IonLabel>
                    <IonTextarea value={comments} onIonChange={(e) => setComments(e.detail.value!)}></IonTextarea>                
                </IonItem>

            </IonItemGroup>
 
                <div className="pics-section texto-centrado margen-arriba">
                    <IonButton onClick={ ()=> takePhoto(20)}>Tomar Fotos</IonButton>
                    <IonGrid>
                        <IonRow>
                            {pics.map((photo, index) => (
                            <IonCol size="6" key={index}>
                                {!!photo.base64str && <IonImg src={`data:image/jpeg;base64,${photo.base64str}`} ></IonImg>}
                                {!photo.base64str && <IonImg src={`${process.env.REACT_APP_BASE_URL_API}/docs/img?id=${photo._id}`}></IonImg>}
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