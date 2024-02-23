import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from "@ionic/react";
import { AddressForm } from "./AddressForm";

export const AddressEditNegocio = () => {
    return (

        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Dirección del Negocio</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <AddressForm addressType="NEGOCIO" />

            </IonContent>
        </IonPage>
    );
}