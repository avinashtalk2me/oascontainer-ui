import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, useIonRouter } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

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
import Login from "./pages/Login";
import Register from "./pages/User/Register";
import RegisterSuccess from "./pages/User/SuccessRegister";
import ContainerSailingRoute from "./ContainerSailingRoute";
import ContainerDeliveryRoute from './ContainerDeliveryRoute'
import { Menu } from "./components/Menu";
import { App as MobileApp } from "@capacitor/app";
import Maintenance from "./components/Maintenance";
import SessionExpired from "./components/SessionExpired";
import { useEffect } from "react";
import { setupIonicReact } from "@ionic/react";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordSuccess from "./pages/SuccessPassword";
import Unsubscribe from "./pages/Unsubscribe";
import LoadAccessModule from './pages/LoadAccessModule';
import InitialAppLandingPage from "./pages/InitialAppLandingPage";

setupIonicReact({
  mode: "md",
});

const App: React.FC = () => {

  useEffect(() => {
    async function BackButton() {
      MobileApp.addListener("backButton", ({ canGoBack }) => {
        if (
          !canGoBack ||
          window.location.pathname === "/loadAccessModule" ||
          window.location.pathname === "/" ||
          window.location.pathname === "/login" ||
          window.location.pathname === "/sessionexpired" ||
          window.location.pathname === "/maintenance" ||
          window.location.pathname === "/registersuccess" ||
          window.location.pathname === "/unsubscribe" ||
          window.location.pathname === "/passwordsuccess"
        ) {
          MobileApp.exitApp();
        }
      });
    }
    BackButton();
  }, []);


  return (
    <IonApp>
      <IonReactRouter>
        <Menu />
        <IonRouterOutlet id="main">
          <Route exact path="/">
            <InitialAppLandingPage />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/loadAccessModule">
            <LoadAccessModule />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/forgotpassword">
            <ForgotPassword />
          </Route>
          <Route exact path="/registersuccess">
            <RegisterSuccess />
          </Route>
          <Route exact path="/passwordsuccess">
            <PasswordSuccess />
          </Route>
          <Route path="/sailing-container">
            <ContainerSailingRoute />
          </Route>
          <Route path="/delivery-container">
            <ContainerDeliveryRoute />
          </Route>
          <Route exact path="/maintenance">
            <Maintenance />
          </Route>
          <Route exact path="/sessionexpired">
            <SessionExpired />
          </Route>
          <Route exact path="/unsubscribe">
            <Unsubscribe />
          </Route>
          {/* <Redirect exact to="/container-sail/sailing" /> */}
          {/* <Redirect exact path="/login" to="/" /> */}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
