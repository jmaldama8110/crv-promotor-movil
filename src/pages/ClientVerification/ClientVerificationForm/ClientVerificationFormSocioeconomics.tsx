import { IonCheckbox, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonSelect, IonSelectOption, IonTextarea } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { InputCurrency } from "../../../components/InputCurrency";
import { ButtonSlider } from "../../../components/SliderButtons";
import { AppContext } from "../../../store/store";

export const ClientVerificationFormSocioeconomics: React.FC<{ onNext:any, onSetProgress:any}> = ({ onNext, onSetProgress}) => {

  const { clientVerification } = useContext(AppContext);

    const [partnerName, setPartnerName] = useState<string>('');
    const [partnerOcupation, setPartnerOcupation] = useState<string>('');
    const [placeOfWork, setPlaceOfWork] = useState<string>('');
    const [weeklyIncome, setWeeklyIncome] = useState<string>('');
    const [weeklyIncomeValid, setWeeklyIncomeValid] = useState<boolean>(false);
    
    const [hasChildren, setHasChildren] = useState<string>('No');
    const [numberOfChildren] = useState([
        "No",
        "1",
        "2",
        "3",
        "Mas de 3",
      ]);

    const [childrenGoToSchool, setChildrenGoToSchool] = useState<boolean>(false);
    const [schoolName, setSchoolName] = useState<string>('');

    const [cleanHome, setCleanHome] = useState<boolean>(false);
    const [tv, setTv] = useState<boolean>(false);
    const [concreteFloor, setConcreteFloor] = useState<boolean>(false);
    const [floorTile, setFloorTile] = useState<boolean>(false);
    const [microwave, setMicrowave] = useState<boolean>(false);
    const [concreteRoof, setConcreteRoof] = useState<boolean>(false);
    const [stove, setStove] = useState<boolean>(false);
    const [laminateRoof, setLaminateRoof] = useState<boolean>(false);
    const [computer, setComputer] = useState<boolean>(false);
    const [internet, setInternet] = useState<boolean>(false);

    const [householdOwned, setHouseholdOwned] = useState<boolean>(false);
    const [householdRent, setHouseholdRent] = useState<boolean>(false);
    const [householdRelatives, setHouseholdRelatives] = useState<boolean>(false);
    const [bisAndHomeSameAddress, setBisAndHomeSameAddress] = useState<boolean>(false);
    const [yearsResidence, setYearsResidence] = useState<string>('');
    const [peopleLiving, setPeopleLiving] = useState<string>('');
    const [rentAmount, setRentAmount] = useState<string>('');
    const [rentAmountValid, setRentAmountValid] = useState<boolean>(false);
    const [familyIsAwareOfLoan, setFamilyAwareOfLoan] = useState<boolean>(false);
  
    const [bisSupplies, setBisSupplies] = useState<boolean>(false);
    const [bisArticles, setBisArticles] = useState<boolean>(false);
    const [bisAssets, setBisAssets] = useState<boolean>(false);
    const [bisCommets, setBisCommets] = useState<string>('');

    function onSend(){
      onSetProgress(0.75);
      const data:any = {
        partnerName,
        partnerOcupation,
        placeOfWork,
        weeklyIncome,
        hasChildren,
        childrenGoToSchool,
        schoolName,
        cleanHome,
        tv,
        concreteFloor,
        microwave,
        floorTile,
        concreteRoof,
        stove,
        laminateRoof,
        computer,
        internet,
        householdOwned,
        householdRent,
        householdRelatives,
        bisAndHomeSameAddress,
        yearsResidence,
        peopleLiving,
        rentAmount,
        familyIsAwareOfLoan,
        bisArticles,
        bisSupplies,
        bisAssets,
        bisCommets
      }
      onNext(data);
    }
    useEffect(()=>{
        if( clientVerification._id){
          setPartnerName(clientVerification.partnerName)
          setPartnerOcupation(clientVerification.partnerOcupation)
          setPlaceOfWork(clientVerification.placeOfWork)
          setWeeklyIncome(clientVerification.weeklyIncome)
          setHasChildren(clientVerification.hasChildren)
          setChildrenGoToSchool(clientVerification.childrenGoToSchool)
          setSchoolName(clientVerification.schoolName)
          setCleanHome( clientVerification.cleanHome)
          setTv(clientVerification.tv)
          setConcreteFloor(clientVerification.concreteFloor)
          setMicrowave(clientVerification.microwave)
          setFloorTile(clientVerification.floorTile)
          setConcreteRoof(clientVerification.concreteRoof)
          setStove(clientVerification.stove)
          setLaminateRoof(clientVerification.laminateRoof)
          setComputer(clientVerification.computer)
          setInternet(clientVerification.internet)
          setHouseholdOwned(clientVerification.householdOwned)
          setHouseholdRent(clientVerification.householdRent)
          setHouseholdRelatives(clientVerification.householdRelatives)
          setBisAndHomeSameAddress(clientVerification.bisAndHomeSameAddress)
          setYearsResidence(clientVerification.yearsResidence)
          setPeopleLiving(clientVerification.peopleLiving)
          setRentAmount(clientVerification.rentAmount)
          setFamilyAwareOfLoan(clientVerification.familyIsAwareOfLoan)
          setBisArticles(clientVerification.bisArticles)
          setBisSupplies(clientVerification.bisSupplies)
          setBisAssets(clientVerification.bisAssets)
          setBisCommets(clientVerification.bisCommets)          
        }
    },[clientVerification])

    return (
        <IonList>
            <IonItemDivider><IonLabel>Datos Socioeconomicos</IonLabel></IonItemDivider>

            <IonItem>
                <IonLabel position="floating">Nombre completo de su pareja</IonLabel>
                <IonInput type="text" placeholder="...Si no es Soltera(o)" value={partnerName} onIonChange={(e)=>setPartnerName(e.detail.value!) } onIonBlur={(e:any)=>setPartnerName(e.target.value.toUpperCase())}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Ocupación de su pareja:</IonLabel>
                <IonInput type="text" value={partnerOcupation} onIonChange={(e)=>setPartnerOcupation(e.detail.value!) } onIonBlur={(e:any)=>setPartnerOcupation(e.target.value.toUpperCase())}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel position="floating">¿En dónde trabaja?</IonLabel>
                <IonInput type="text" value={placeOfWork} onIonChange={(e)=>setPlaceOfWork(e.detail.value!) } onIonBlur={(e:any)=>setPartnerName(e.target.value.toUpperCase())}></IonInput>
            </IonItem>
            <InputCurrency InputString={weeklyIncome} fxUpdateInput={setWeeklyIncome} BadgeFlag={weeklyIncomeValid} fxUpdateBadge={setWeeklyIncomeValid} placeholder="Ingresos de la pareja" />
            <IonItem>
            <IonLabel>¿Tienes Hijos?</IonLabel>
            <IonSelect
              value={hasChildren}
              okText="Ok"
              cancelText="Cancelar"
              onIonChange={(e) => setHasChildren(e.detail.value)}
            >
              {numberOfChildren.map((c: string, n: number) => (
                <IonSelectOption key={n} value={c}>
                  {c}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>¿Asisten a la escuela?</IonLabel>
            <IonCheckbox
            checked={childrenGoToSchool}
            onIonChange={async (e) =>setChildrenGoToSchool(e.detail.checked)} />
          </IonItem>
          <IonItem>
                <IonLabel position="floating">Nombre de la(s) escuela(s):</IonLabel>
                <IonInput type="text" value={schoolName} onIonChange={(e)=>setSchoolName(e.detail.value!) } onIonBlur={(e:any)=>setPartnerName(e.target.value.toUpperCase())}></IonInput>
            </IonItem>


          <IonItem><IonLabel>Orden y Limpieza en el Hogar</IonLabel>
            <IonCheckbox checked={cleanHome} onIonChange={async (e) =>setCleanHome(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>TV</IonLabel>
            <IonCheckbox checked={tv} onIonChange={async (e) =>setTv(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>Piso Firme</IonLabel>
            <IonCheckbox checked={concreteFloor} onIonChange={async (e) =>setConcreteFloor(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>Microondas</IonLabel>
            <IonCheckbox checked={microwave} onIonChange={async (e) =>setMicrowave(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>Loseta</IonLabel>
            <IonCheckbox checked={floorTile} onIonChange={async (e) =>setFloorTile(e.detail.checked)} />
          </IonItem>

          <IonItem><IonLabel>Techo Losa</IonLabel>
            <IonCheckbox checked={concreteRoof} onIonChange={async (e) =>setConcreteRoof(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>Estufa</IonLabel>
            <IonCheckbox checked={stove} onIonChange={async (e) =>setStove(e.detail.checked)} />
          </IonItem>

          <IonItem><IonLabel>Techo Lamina</IonLabel>
            <IonCheckbox checked={laminateRoof} onIonChange={async (e) =>setLaminateRoof(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>Computadora</IonLabel>
            <IonCheckbox checked={computer} onIonChange={async (e) =>setComputer(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>Internet</IonLabel>
            <IonCheckbox checked={internet} onIonChange={async (e) =>setInternet(e.detail.checked)} />
          </IonItem>


          <IonItem><IonLabel>Casa Propia</IonLabel>
            <IonCheckbox checked={householdOwned} onIonChange={async (e) =>setHouseholdOwned(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>Rentada</IonLabel>
            <IonCheckbox checked={householdRent} onIonChange={async (e) =>setHouseholdRent(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>Familiares</IonLabel>
            <IonCheckbox checked={householdRelatives} onIonChange={async (e) =>setHouseholdRelatives(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>¿La Direccion del cliente es la misma que la del negocio?</IonLabel>
            <IonCheckbox checked={bisAndHomeSameAddress} onIonChange={async (e) =>setBisAndHomeSameAddress(e.detail.checked)} />
          </IonItem>


          <IonItem>
                <IonLabel position="floating">Años de Residir en la Vivienda</IonLabel>
                <IonInput type="text" placeholder="" value={yearsResidence} onIonChange={(e) =>setYearsResidence(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
                <IonLabel position="floating">¿Cuántas personas viven en su casa?</IonLabel>
                <IonInput type="text" placeholder="" value={peopleLiving} onIonChange={(e)=>setPeopleLiving(e.detail.value!)}></IonInput>
          </IonItem>
          <InputCurrency InputString={rentAmount} fxUpdateInput={setRentAmount} BadgeFlag={rentAmountValid} fxUpdateBadge={setRentAmountValid} placeholder="Cuanto paga de Renta" />

          <IonItem><IonLabel>¿Su familia sabe que tiene crédito con CONSERVA?</IonLabel>
            <IonCheckbox checked={familyIsAwareOfLoan} onIonChange={async (e) =>setFamilyAwareOfLoan(e.detail.checked)} />
          </IonItem>

          <IonItemDivider><IonLabel>Inversión realizada por el cliente con el Crédito CONSERVA</IonLabel></IonItemDivider>

          <IonItem><IonLabel>Insumos para el Negocio</IonLabel>
            <IonCheckbox checked={bisSupplies} onIonChange={async (e) =>setBisSupplies(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>Compra de Mercancias</IonLabel>
            <IonCheckbox checked={bisArticles} onIonChange={async (e) =>setBisArticles(e.detail.checked)} />
          </IonItem>
          <IonItem><IonLabel>Compra de Activos (maquinas, herramientas, mobiliario</IonLabel>
            <IonCheckbox checked={bisAssets} onIonChange={async (e) =>setBisAssets(e.detail.checked)} />
          </IonItem>
          <IonItem>
              <IonLabel position="floating">Describa la compra</IonLabel>
              <IonTextarea placeholder="ingrese aqui una descripción de la inversion que realiza el cliente en su negocio" value={bisCommets} onIonChange={(e)=>setBisCommets(e.detail.value!)}></IonTextarea>
          </IonItem>
                <p></p>
            <ButtonSlider color="primary" expand="block" label='Siguiente' onClick={onSend} slideDirection={"F"}></ButtonSlider>
            <ButtonSlider color="medium" expand="block" label='Anterior' onClick={() => { onSetProgress(0.25)} } slideDirection={"B"}></ButtonSlider>

        </IonList>
    );
}