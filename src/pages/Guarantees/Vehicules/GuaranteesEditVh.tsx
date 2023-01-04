import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Guarantee } from "../../../reducer/GuaranteesReducer";

import { GuaranteesFormVh } from "./GuaranteesFormVh";


export const GuaranteesEditVh:React.FC<RouteComponentProps> = ( props )=>{

    const [editItem, setEditItem] = useState<Guarantee>();
    const [present, dismiss] = useIonLoading();

    // const { dispatchGuaranteesVehicle } = useContext(AppContext);

    useEffect( ()=>{
        // async function loadData (){
        //     const itemId = props.match.url.replace("/guarantees/vehicle/edit/", "");
        //     try {
        //         present( { message: 'Cargando...'});
        //         const apiRes = await api.get(`/guarantees?id=${itemId}`)
                
        //         const someItem = {
        //             ...apiRes.data[0].vehicle,
        //             _id: apiRes.data[0]._id
        //         }
        //         setEditItem(someItem);
        //         dismiss();
        //     }
        //     catch(error){
        //         dismiss();
        //         console.log(error);
        //         alert('No fue posible cargar el elemento')
        //     }
        // }
        // loadData();
    },[]);

    const onSubmit = async (data:any) => {
        
        // try {
        //     present( {message: 'Guardando...'})
        //     // const tokenString = `Bearer ${loginInfo.current_token}`;
        //     // api.defaults.headers.common["Authorization"] = tokenString;
        //     const apiRes = await api.patch(`/guarantees/${editItem._id}`, { ...data });
        //     dispatchGuaranteesVehicle( {
        //         type: 'EDIT_GUARANTEE_VH',
        //         _id: apiRes.data._id,
        //         ...data.vehicle
        //     })

        //     dismiss();
        // }
        // catch(error){
        //     dismiss();
        //     console.log(error);
        //     alert('No fue posible actualizar, revisa tu conexion')
        // }
    }

    return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton defaultHref="/guarantees" />
            </IonButtons>
            <IonTitle>Editar {editItem!.vehicle.description}</IonTitle>
            </IonToolbar>
      </IonHeader>
      <IonContent>
                <GuaranteesFormVh vehicle={editItem} onSubmit={onSubmit} {...props}/>
      </IonContent>
    </IonPage>
    );
}