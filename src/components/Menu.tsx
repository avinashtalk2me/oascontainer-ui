import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { LOGOUT } from "../store/types";
import { Dialog } from "@capacitor/dialog";
import { deleteUser } from '../store/actions';

export const Menu: React.FC = () => {
  const history = useHistory();
  const state = useSelector((state: any) => state);
  const dispatch = useDispatch();

  const selectedSailId = state.pallet.selectedSailId;
  const selectedDeliveryId = state.location.selectedDeliveryId;
  const authToken: any = JSON.parse(
    localStorage.getItem("_authResponse") || "{}"
  );
  const userRoles = authToken && authToken.userRoles;

  const isAdmin = userRoles && userRoles.admin_access && true;

  const handleLogout = () => {
    dispatch({ type: LOGOUT });
    localStorage &&
      localStorage.getItem("_authResponse") &&
      localStorage.removeItem("_authResponse");
    history.push('/login');
  };

  const handleUnsubscribe = (event: any) => {
    event.preventDefault();
    const showConfirm = async () => {
      const { value } = await Dialog.confirm({
        title: "Confirm",
        message: `Are you sure you'd like to delete your account?`,
      });
      const auth: any = localStorage &&
        localStorage.getItem("_authResponse")
      if (value) {
        dispatch(deleteUser(JSON.parse(auth).userId));
        history.push("/unsubscribe");
      }
    };
    showConfirm();
  }

  const getUserSession = () => {
    const authToken: any = JSON.parse(
      localStorage.getItem("_authResponse") || "{}"
    );
    const idToken = authToken && authToken.access_token;
    if (!idToken) {
      return true
    }
    return false
  }

  const SailingAccess = userRoles?.sailing_access !== 0 && (
    <div className={`${history.location.pathname.includes("sailing-container") && 'multimenu-header'}`}>
      <IonItem
        button
        routerLink={`/sailing-container/sailing`}
        className={`${history.location.pathname.includes("sailing-container") && 'multimenu-label'} ion-no-padding`}
      >
        <IonLabel>Sailing Access</IonLabel>
      </IonItem>
    </div>
  )

  const DeliveryAccess = userRoles?.delivery_access !== 0 && (
    <div className={`${history.location.pathname.includes("delivery-container") && 'multimenu-header'}`}>
      <IonItem
        button
        routerLink={`/delivery-container/delivery`}
        className={`${history.location.pathname.includes("delivery-container") && 'multimenu-label'} ion-no-padding`}
      >
        <IonLabel>Delivery Access</IonLabel>
      </IonItem>
    </div>
  )

  const MenuSailing =
    <>
      {SailingAccess}
      {((userRoles?.sailing_access === 1 && userRoles?.delivery_access === 0)
        || (userRoles?.sailing_access === 1 && userRoles?.delivery_access === 1)
        || (userRoles?.sailing_access === 2 && userRoles?.delivery_access === 2)) ?
        (
          <>
            {history.location.pathname.includes("sailing-container") && history.location.pathname.includes("pallet") && (
              <>
                <IonItem
                  className="ion-no-padding"
                  button
                  routerLink={"/sailing-container/sailing"}
                  routerDirection="none"
                >
                  <IonLabel>Sailing</IonLabel>
                </IonItem>
              </>
            )}
            {history.location.pathname.includes("sailing-container") && history.location.pathname.includes("package") && (
              <>
                <IonItem
                  className="ion-no-padding"
                  button
                  routerLink={"/sailing-container/sailing"}
                  routerDirection="none"
                >
                  <IonLabel>Sailing</IonLabel>
                </IonItem>
                <IonItem
                  className="ion-no-padding"
                  button
                  routerLink={`/sailing-container/sailing/pallet/${selectedSailId}`}
                  routerDirection="none"
                >
                  <IonLabel>Pallet</IonLabel>
                </IonItem>
              </>
            )}
          </>
        )
        : (<></>)}
      {DeliveryAccess}
      {((userRoles?.sailing_access === 1 && userRoles?.delivery_access === 0)
        || (userRoles?.sailing_access === 1 && userRoles?.delivery_access === 1)
        || (userRoles?.sailing_access === 2 && userRoles?.delivery_access === 2)) ?
        (
          <>
            {history.location.pathname.includes("delivery-container") && history.location.pathname.includes("location") && (
              <>
                <IonItem
                  className="ion-no-padding"
                  button
                  routerLink={"/delivery-container/delivery"}
                  routerDirection="none"
                >
                  <IonLabel>Delivery</IonLabel>
                </IonItem>
              </>
            )}
            {history.location.pathname.includes("delivery-container") && history.location.pathname.includes("dropoffpackages") && (
              <>
                <IonItem
                  className="ion-no-padding"
                  button
                  routerLink={"/delivery-container/delivery"}
                  routerDirection="none"
                >
                  <IonLabel>Delivery</IonLabel>
                </IonItem>
                <IonItem
                  className="ion-no-padding"
                  button
                  routerLink={`/delivery-container/location/${selectedDeliveryId}`}
                  routerDirection="none"
                >
                  <IonLabel>Location</IonLabel>
                </IonItem>
              </>
            )}
          </>
        )
        : (<></>)}
    </>


  const Configuration = <>
    <IonAccordionGroup >
      <IonAccordion className="ion-no-padding">
        <IonItem slot="header" lines="inset" className="ion-no-padding">
          <IonLabel>Configuration</IonLabel>
        </IonItem>
        <div className="ion-no-padding submenu" slot="content">
          <IonItem
            button
            className="ion-no-padding"
            onClick={handleLogout}
            routerDirection="none"
          >
            <IonLabel>Users</IonLabel>
          </IonItem>
          <IonItem
            button
            className="ion-no-padding"
            onClick={handleLogout}
            routerDirection="none"
          >
            <IonLabel>Setting</IonLabel>
          </IonItem>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  </>



  return (
    <IonMenu side="start" contentId="main" disabled={getUserSession()}>
      <IonHeader >
        <IonToolbar className="ion-menu-header">
          <IonTitle>MANIFEST</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList className="ion-no-padding">
          {/* <IonMenuToggle auto-hide="false"> */}
            <div className="menu-items">
              {MenuSailing}
              {isAdmin && Configuration}
              <IonItem
                button
                className="ion-no-padding"
                onClick={handleLogout}
                routerDirection="none"
              >
                <IonLabel>Logout</IonLabel>
              </IonItem>
              <IonItem
                className="ion-no-padding">
                <IonLabel className="ion-no-padding ion-unsubscribe">
                  <IonButton onClick={handleUnsubscribe}>
                    Unsubscribe
                  </IonButton>
                </IonLabel>
              </IonItem>
            </div>
          {/* </IonMenuToggle> */}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};
