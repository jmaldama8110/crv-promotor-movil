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
  personAddOutline,
  notificationsCircleOutline,
  constructOutline
} from "ionicons/icons";

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
import './pages/WhereToPay/WhereToPay.css';
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

import { ClientsFromHF } from "./pages/Clients/ClientsFromHF";

import { GroupAdd } from "./pages/Groups/GroupAdd";
import { LoanAppGroupHome } from "./pages/LoanAppGroup/LoanAppGroupHome";
import { GroupEdit } from "./pages/Groups/GroupEdit";
import { LoanAppGroupEdit } from "./pages/LoanAppGroup/LoanAppGroupEdit";

import { LoanAppMemberAdd } from "./components/LoanAppGroupForm/LoanAppGroupFormMember/LoanAppMemberAdd";
import { LoanAppMemberEdit } from "./components/LoanAppGroupForm/LoanAppGroupFormMember/LoanAppMemberEdit";
import { GroupFromHF } from "./pages/Groups/GroupFromHF";
import { GroupImport } from "./pages/Groups/GroupImport/GroupImport";
import { useDBSync } from "./hooks/useDBSync";
import { ContractDetail } from "./pages/Contracts/ContractDetail";
import { ClientVerificationAdd } from "./pages/ClientVerification/ClientVerificationAdd";
import { ClientVerificationHome } from "./pages/ClientVerification/ClientVerificationHome";
import { ClientVerificationEdit } from "./pages/ClientVerification/ClientVerificationEdit";
import { VisitsHome } from "./pages/Visits/VisitsHome";
import { VisitsAdd } from "./pages/Visits/VisitsAdd";
import { VisitsEdit } from "./pages/Visits/VisitsEdit";
import { WhereToPayHome } from "./pages/WhereToPay/WhereoToPayHome";
import { ActionLog } from "./pages/ActionLog/ActionLog";
import { DigitalArchive } from "./pages/Clients/DigitalArchive";
import { LoanAppGroupAdd } from "./pages/LoanAppGroup/LoanAppGroupAdd";

setupIonicReact();

const App: React.FC = () => {
  let render = true;
  const [present, dismiss] = useIonLoading();
  const { session } = useContext(AppContext);
  const { couchDBSyncDownload, evaluateTokenExpiration} = useDBSync();

  useEffect(() => {
    
    if (session.loading) {
      present({ message: session.loading_msg });
    } else {
      dismiss();
    }
  }, [session]);

  useEffect(() => {
    const loadRender = async () => {
      if (render) {
        ///// what needs to be rendered once goes here!
        await couchDBSyncDownload();
        
        render = false;      
      }
    };
    loadRender();

    
  }, []);

  async function onTabChange  (){
      await evaluateTokenExpiration();
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            
            <Route
              exact
              path="/clients"
              render={(props) => {
                return !!session.current_token ? <ClientsHome /> : <MyProfile {...props} />;
              }}
            />


            <Route exact path="/clients/edit/:id" component={ClientsEdit}></Route>
            <Route exact path="/clients/socioeconomics/edit/:id" component={SocioEconomicsForm}></Route>
            <Route exact path="/clients/add" component={ClientsAdd}></Route>
            <Route exact path="/clients/add-from-hf/:external_id" component={ClientsFromHF}></Route> 
            
            <Route exact path="/clients/:id/loanapps" component={LoanApplicationHome}></Route>
            <Route exact path="/clients/:id/loanapps/add" component={LoanApplicationAdd}></Route>
            <Route exact path="/clients/:id/loanapps/edit/:id" component={LoanApplicationEdit}></Route>

            <Route exact path="/clients/:id/verifications" component={ClientVerificationHome}></Route>
            <Route exact path="/clients/:id/verfications/add" component={ClientVerificationAdd}></Route>
            <Route exact path="/clients/:id/verfications/edit/:id" component={ClientVerificationEdit}></Route>

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

            <Route
              exact
              path="/groups"
              render={(props) => {
                return !!session.current_token ? <GroupsHome {...props} /> : <MyProfile {...props}/>;
              }}
            />

            <Route exact path="/groups/add" component={GroupAdd}></Route>
            <Route exact path="/groups/add-from-hf" component={GroupFromHF}></Route>
            <Route exact path="/groups/edit/:id" component={GroupEdit}></Route>

            <Route exact path="/groups/:id/loanapps" component={LoanAppGroupHome}></Route>
            <Route exact path="/groups/:id/loanapps/add" component={LoanAppGroupAdd}></Route>
            <Route exact path="/groups/:id/loanapps/edit/:id" component={LoanAppGroupEdit}></Route>

            <Route exact path="/groups/:id/loanapps/add/members/add" component={LoanAppMemberAdd}></Route>
            <Route exact path="/groups/:id/loanapps/add/members/edit/:id" component={LoanAppMemberEdit}></Route>

            <Route exact path="/groups/:id/loanapps/edit/:id/members/add" component={LoanAppMemberAdd}></Route>
            <Route exact path="/groups/:id/loanapps/edit/:id/members/edit/:id" component={LoanAppMemberEdit}></Route>

            <Route exact path="/groups/import" component={GroupImport}></Route>
            <Route exact path="/contracts/:contractId" component={ContractDetail}></Route>
            <Route exact path="/contracts/:contractId/visits" component={VisitsHome}></Route>
            <Route exact path="/contracts/:contractId/visits/add" component={VisitsAdd}></Route>
            <Route exact path="/contracts/:contractId/visits/edit/:id" component={VisitsEdit}></Route>
            <Route exact path="/wheretopay/:id" component={WhereToPayHome}></Route>
            <Route exact path="/digitalachive/:id" component={DigitalArchive}></Route>
            

            <Route exact path="/actionlog" component={ActionLog}></Route>
            <Route exact path="/supervisor" component={SupervisorHome}></Route>
            <Route exact path="/notifications" component={Notifications}></Route>
            
            <Route exact path="/" component={MyProfile}></Route>

          </IonRouterOutlet>

          <IonTabBar slot="bottom" onClick={onTabChange}>
            <IonTabButton tab="home" href="/">
              <IonIcon icon={personCircleOutline} />
              <IonLabel>Mi Perfil</IonLabel>
            </IonTabButton>
            <IonTabButton tab="clients" href="/clients" disabled={!session.current_token} >
              <IonIcon icon={personAddOutline} />
              <IonLabel>Clientes</IonLabel>
            </IonTabButton>
            <IonTabButton tab="groups" href="/groups" disabled={!session.current_token}>
              <IonIcon icon={peopleOutline} />
              <IonLabel>Grupos</IonLabel>
            </IonTabButton>
            <IonTabButton tab="supervisor" href="/actionlog">
              <IonIcon icon={constructOutline} />
              <IonLabel>HighFinance</IonLabel>
            </IonTabButton>
            <IonTabButton tab="notifications" href="/notifications" disabled>
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
