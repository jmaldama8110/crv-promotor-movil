import { IonInput, IonItem, IonLabel, IonList } from "@ionic/react";

export const ClientsForm: React.FC = () => {

    return( 
        <IonList className="ion-padding">
            <IonItem>
                <IonLabel position='floating'>Nombre(s)</IonLabel>
                <IonInput type='text'></IonInput>
            </IonItem>
        </IonList>
    );
}