import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import api from "../../../api/api";
import { AppContext } from "../../../store/store";
import { GuaranteesFormEq } from "./GuaranteesFormEq";
import { Guarantee } from "../../../reducer/GuaranteesReducer";

export const GuaranteesEditEq:React.FC<RouteComponentProps> = ( props )=>{

    const [editItem, setEditItem] = useState<Guarantee>();
    const [present, dismiss] = useIonLoading();

    // const { dispatchGuaranteesEquipment } = useContext(AppContext);

    useEffect( ()=>{
        // async function loadData (){
        //     const itemId = props.match.url.replace("/guarantees/equipment/edit/", "");
        //     try {
        //         present( { message: 'Cargando...'});
        //         const apiRes = await api.get(`/guarantees?id=${itemId}`)
                
        //         const someItem = {
        //             ...apiRes.data[0].equipment,
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
        //     dispatchGuaranteesEquipment( {
        //         type: 'EDIT_GUARANTEE_EQ',
        //         _id: apiRes.data._id,
        //         ...data.equipment
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
            <IonTitle>Editar {editItem?.equipment.description}</IonTitle>
            </IonToolbar>
      </IonHeader>
      <IonContent>
                <GuaranteesFormEq equipment={editItem} onSubmit={onSubmit} {...props}/>
      </IonContent>
    </IonPage>
    );
}