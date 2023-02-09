import { IonButton, IonCol, IonGrid, IonItemDivider, IonLabel, IonList, IonRow, IonTextarea } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/store";
import { ButtonSlider } from "../SliderButtons";


export const ClientFormSummary: React.FC<{disabledAddress?: boolean, onNext:any}> = ( {disabledAddress, onNext}) =>{

  const { clientData } = useContext(AppContext);
  const [comment, setComment] = useState<string>('');
    const getAddresFromType = ( type: string) =>{
      let address = {
        address_line1: "",
        city: ['', ''],
        colony: ['', ''],
        country: ['', ''],
        municipality: ['', ''],
        post_code: "",
        province: ['', ''],
        type: ""
      }


      const tmp = clientData.address.find( (i:any) => i.type === type);
      if( tmp )
        address = tmp;
      return `${address.address_line1} ${address.colony[1]} ${address.city[1]}`;

    }
    useEffect( ()=>{
        if(clientData._id){
            setComment(clientData.comment);
        }
    },[clientData])
    
    function onSubmit( ){
      const data = {
        comment,
      }
      onNext(data);
    }

    return (
        <IonList className='ion-padding'>
                    <IonItemDivider><IonLabel>Resumen de Informacion</IonLabel></IonItemDivider>
            <IonGrid className="fuente-sm">
                <IonRow>
                  <IonCol size="4">Nombre:</IonCol> <IonCol>{ `${clientData.name} ${clientData.lastname} ${clientData.second_lastname}`}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Curp:</IonCol> <IonCol>{  `${clientData.curp}`}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Profesion:</IonCol> <IonCol>{clientData.business_data.profession[1]}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Escolaridad:</IonCol> <IonCol>{clientData.education_level[1]}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Estado Civil:</IonCol> <IonCol>{clientData.marital_status[1]}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Actividad Económica:</IonCol> <IonCol>{clientData.business_data.economic_activity[1]}</IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="4">Domicilio</IonCol> <IonCol>{ getAddresFromType('DOMICILIO') }</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Tengo Negocio?</IonCol> <IonCol>{clientData.not_bis ? 'No' : 'Si, tengo un negocio'}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">Coord Geo:</IonCol> <IonCol>{ clientData.coordinates? `${clientData.coordinates[0]}, ${clientData.coordinates[1]}` : '' }</IonCol>
                </IonRow>
                {!clientData.not_bis &&
                    <IonRow>
                      <IonCol size="4">Nombre del negocio</IonCol><IonCol>{clientData.business_data.business_name} {!disabledAddress ? '(En el domicilio)' : ''}</IonCol>
                    </IonRow>
                }
                {
                  !clientData.not_bis && !disabledAddress &&
                  <IonRow>
                    <IonCol size="4">Ubicado en:</IonCol><IonCol>{ getAddresFromType('NEGOCIO')}</IonCol>
                  </IonRow>              
                }
                <IonRow>
                  <IonCol> <IonTextarea placeholder="Comentar aqui.." value={comment} onIonChange={(e) =>setComment(e.detail.value!)}></IonTextarea></IonCol>
                </IonRow>
              </IonGrid>
              <IonButton expand="block" onClick={onSubmit} color='success'>Guardar</IonButton>
              <ButtonSlider onClick={()=>{}} slideDirection={'B'} color="light" expand="block" label="Anterior" />

        </IonList>
    );
}