import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from "@ionic/react";
import { AddressForm } from "./AddressForm";

export const AddressEditDomicilio = ( ) => {


    return (

        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Domicilio particular</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <AddressForm addressType={"DOMICILIO"}/>

            </IonContent>
        </IonPage>
    );
}