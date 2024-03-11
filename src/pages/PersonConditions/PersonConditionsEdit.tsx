import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { PersonConditionForm } from "./PersonConditionForm";

export const PersonConditionsEdit = () => {
    return (

        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Condiciones Socioeconómicos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <PersonConditionForm />

            </IonContent>
        </IonPage>
    );
}