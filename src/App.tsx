import { Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonLoading,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  peopleOutline,
  personCircleOutline,
  lockClosedOutline,
  personAddOutline,
  notificationsCircleOutline,
} from "ionicons/icons";

import jwt_decode from "jwt-decode";
import ClientsHome from "./pages/Home/ClientsHome";
import GroupsHome from "./pages/Home/GroupsHome";
import SupervisorHome from "./pages/Home/SupervisorHome";
import { Notifications } from "./pages/Home/Notifications";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./globalstyles.css";
import { MyProfile } from "./pages/Home/MyProfile";
import { useContext, useEffect } from "react";
import { AppContext } from "./store/store";
import { ClientsEdit } from "./pages/Clients/ClientsEdit";
import { ClientsAdd } from "./pages/Clients/ClientsAdd";
import { SocioEconomicsForm } from "./pages/Socioeconomics/SocioEconomicsForm";
import { LoanApplicationHome } from "./pages/LoanApp/LoanApplicationHome";
import { LoanApplicationAdd } from "./pages/LoanApp/LoanApplicationAdd";
import { LoanApplicationEdit } from "./pages/LoanApp/LoanApplicationEdit";
import { GuaranteesHome } from "./pages/Guarantees/GuaranteesHome";
import { GuaranteeAddEq } from "./pages/Guarantees/Equipment/GuaranteesAddEq";
import { GuaranteesEditEq } from "./pages/Guarantees/Equipment/GuaranteesEditEq";
import { GuaranteeAddVh } from "./pages/Guarantees/Vehicules/GuaranteesAddVh";
import { GuaranteesEditVh } from "./pages/Guarantees/Vehicules/GuaranteesEditVh";
import { GuaranteeAddProp } from "./pages/Guarantees/Properties/GuaranteesAddProp";
import { GuaranteesEditProp } from "./pages/Guarantees/Properties/GuaranteesEditProp";
import { RelatedPeopleHome } from "./pages/RelatedPeople/RelatedPeopleHome";
import { GuarantorAdd } from "./pages/RelatedPeople/Guarantors/GuarantorAdd";
import { GuarantorEdit } from "./pages/RelatedPeople/Guarantors/GuarantorEdit";
import { PersonalReferenceAdd } from "./pages/RelatedPeople/References/PersonalReferenceAdd";
import { PersonalReferenceEdit } from "./pages/RelatedPeople/References/PersonalReferenceEdit";
import { BeneficiariesAdd } from "./pages/RelatedPeople/Beneficiaries/BeneficiariesAdd";
import { BeneficiariesEdit } from "./pages/RelatedPeople/Beneficiaries/BeneficiariesEdit";
import { LOGIN_KEY_PREFERENCES } from "./pages/Session/Login";
import { Preferences } from "@capacitor/preferences";
import { ClientsFromHF } from "./pages/Clients/ClientsFromHF";
import { GroupAdd } from "./pages/Groups/GroupAdd";
import { db, remoteDB } from "./db";

setupIonicReact();

interface SyncInfo {
  local_target: string;
  remote_target: string;
  sync_expiration: Date;
}


const App: React.FC = () => {
  let render = true;
  const [present, dismiss] = useIonLoading();
  const { session, dispatchSession } = useContext(AppContext);


  useEffect(() => {
    if (session.loading) {
      present({ message: session.loading_msg });
    } else {
      dismiss();
    }
  }, [session]);

  useEffect(() => {
    const loadRender = () => {

      if (render) {

        ///// what needs to be rendered once goes here!
        dispatchSession({
          type: "SET_LOADING",
          loading: true,
          loading_msg: "Bajando cambios ...",
        });
        db.replicate.from( remoteDB).on('complete', ()=>{
          
          dispatchSession({type: "SET_LOADING",loading: false,loading_msg: ""});
          console.log('Remote => Local, Ok!');
        }).on('error', (err)=>{
          dispatchSession({type: "SET_LOADING",loading: false,loading_msg: ""});
          alert('No fue posible conectarse a la BD remota! verifique su conexion')
        })

        render = false;      }
    };
    loadRender();

  }, []);

  async function onTabChange  (){
    /**
     * Evaluar si el token aun esta vigente
     */
    let hoursDiff = 0;

    if( session.current_token ){
      const decoded:any = jwt_decode(session.current_token);
      const sync: SyncInfo = decoded.sync_info
      if( sync.sync_expiration ){
        const queryDate = new Date(sync.sync_expiration);
        const now = new Date();
        const timeDiff =  queryDate.getTime() - now.getTime();
          // To calculate the no. of Hours between two dates
        hoursDiff = timeDiff / (1000 * 3600 );
        if( hoursDiff <= 0 ){
            dispatchSession({
              type: "SET_LOADING",
              loading: true,
              loading_msg: "Cerrando la sesion..."
            })

            setTimeout( async ()=> {
              dispatchSession({
                type: "SET_LOADING",
                loading: false,
                loading_msg: ""
              })
              await Preferences.remove({ key: LOGIN_KEY_PREFERENCES });
        
              dispatchSession({
                type: "LOGIN",
                name: "",
                lastname: "",
                user: "",
                branch: [0,""],
                current_token: "",
                token_expiration: ""
              });
              
        
            },3000)
          
        }
      }

    }
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/clients" component={ClientsHome}></Route>
            <Route exact path="/clients/edit/:id" component={ClientsEdit}></Route>
            <Route exact path="/clients/socioeconomics/edit/:id" component={SocioEconomicsForm}></Route>
            <Route exact path="/clients/add" component={ClientsAdd}></Route>
            <Route exact path="/clients/add-from-hf" component={ClientsFromHF}></Route>
            <Route exact path="/clients/:id/loanapps" component={LoanApplicationHome}></Route>
            <Route exact path="/clients/:id/loanapps/add" component={LoanApplicationAdd}></Route>
            <Route exact path="/clients/:id/loanapps/edit/:id" component={LoanApplicationEdit}></Route>

            <Route exact path="/clients/:id/guarantees" component={GuaranteesHome}></Route>
            <Route exact path="/clients/:id/guarantees/equipment/add" component={GuaranteeAddEq}></Route>
            <Route exact path="/clients/:id/guarantees/equipment/edit/:id" component={GuaranteesEditEq}></Route>
            <Route exact path="/clients/:id/guarantees/vehicle/add" component={GuaranteeAddVh}></Route>
            <Route exact path="/clients/:id/guarantees/vehicle/edit/:id" component={GuaranteesEditVh}></Route>
            <Route exact path="/clients/:id/guarantees/property/add" component={GuaranteeAddProp}></Route>
            <Route exact path="/clients/:id/guarantees/property/edit/:id" component={GuaranteesEditProp}></Route>

            <Route exact path="/clients/:id/related-people" component={RelatedPeopleHome}></Route>
            <Route exact path="/clients/:id/related-people/guarantor/add" component={GuarantorAdd}></Route>
            <Route exact path="/clients/:id/related-people/guarantor/edit/:id" component={GuarantorEdit}></Route>
            <Route exact path="/clients/:id/related-people/personalreference/add" component={PersonalReferenceAdd}></Route>
            <Route exact path="/clients/:id/related-people/personalreference/edit/:id" component={PersonalReferenceEdit}></Route>
            <Route exact path="/clients/:id/related-people/beneficiaries/add" component={BeneficiariesAdd}></Route>
            <Route exact path="/clients/:id/related-people/beneficiaries/edit/:id" component={BeneficiariesEdit}></Route>

          
            <Route exact path="/groups" component={GroupsHome}></Route>
            <Route exact path="/groups/add" component={GroupAdd}></Route>
            <Route exact path="/supervisor" component={SupervisorHome}></Route>
            <Route exact path="/notifications" component={Notifications}></Route>
            <Route exact path="/" component={MyProfile}></Route>

          </IonRouterOutlet>

          <IonTabBar slot="bottom" onClick={onTabChange}>
            <IonTabButton tab="tab4" href="/">
              <IonIcon icon={personCircleOutline} />
              <IonLabel>Mi Perfil</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab1" href="/clients" disabled={!session.user} >
              <IonIcon icon={personAddOutline} />
              <IonLabel>Clientes</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/groups">
              <IonIcon icon={peopleOutline} />
              <IonLabel>Grupos</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/supervisor" disabled>
              <IonIcon icon={lockClosedOutline} />
              <IonLabel>Supervisor</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab5" href="/notifications">
              <IonIcon icon={notificationsCircleOutline} />
              <IonLabel>Mensajes</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};
export default App;
