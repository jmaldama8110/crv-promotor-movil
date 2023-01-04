import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";

import { Guarantee } from "../../../reducer/GuaranteesReducer";

import { GuaranteesFormProp } from "./GuaranteesFormProp";


export const GuaranteesEditProp:React.FC<RouteComponentProps> = ( props )=>{

    const [editItem, setEditItem] = useState<Guarantee>();
    const [present, dismiss] = useIonLoading();

    // const { dispatchGuaranteesProperty } = useContext(AppContext);

    useEffect( ()=>{
        // async function loadData (){
        //     const itemId = props.match.url.replace("/guarantees/property/edit/", "");
        //     try {
        //         present( { message: 'Cargando...'});
        //         const apiRes = await api.get(`/guarantees?id=${itemId}`)
                
        //         const someItem = {
        //             ...apiRes.data[0].property,
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
        //     dispatchGuaranteesProperty( {
        //         type: 'EDIT_GUARANTEE_PROP',
        //         _id: apiRes.data._id,
        //         ...data.property
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
            <IonTitle>Editar {editItem?.property.description}</IonTitle>
            </IonToolbar>
      </IonHeader>
      <IonContent>
                <GuaranteesFormProp property={editItem} onSubmit={onSubmit} {...props}/>
      </IonContent>
    </IonPage>
    );
}