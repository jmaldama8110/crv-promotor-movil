import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { IncomeExpensesForm } from "./IncomeExpensesForm";

export const IncomeExpensesEdit = () => {
    return (

        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Datos Socioeconómicos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <IncomeExpensesForm />

            </IonContent>
        </IonPage>
    );
}