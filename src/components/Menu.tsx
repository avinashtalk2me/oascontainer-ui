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
import { deactivateAccount } from '../store/actions';
import { useRef } from 'react'

export const Menu: React.FC = () => {
  const menuRef = useRef<HTMLIonMenuElement>(null);
  const accordionSailingGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const accordionDeliveryGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const accordionConfigurationGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const history = useHistory();
  const state = useSelector((state: any) => state);
  const dispatch: any = useDispatch();

  const selectedSailId = state.pallet.selectedSailId;
  const selectedPalletId = state.package.selectedSailId;
  const selectedDeliveryId = state.location.selectedDeliveryId;
  const selectedLocationId = state.dropOff.selectedLocationId;

  const authToken: any = JSON.parse(
    localStorage.getItem("_authResponse") || "{}"
  );
  const userRoles = authToken && authToken.userRoles;
  const isAdmin = userRoles && userRoles.admin_access ? true : false;

  const handleCloseMenu = () => {
    async function isOpen() {
      const isOpenMenu = await menuRef.current?.isOpen();
      if (!isOpenMenu) {
        if (accordionSailingGroup.current) {
          accordionSailingGroup.current.value = undefined;
        }
        if (accordionConfigurationGroup.current) {
          accordionConfigurationGroup.current.value = undefined;
        }
        if (accordionDeliveryGroup.current) {
          accordionDeliveryGroup.current.value = undefined;
        }
      }
    }
    isOpen()
  }
  const handleIsOpen = () => {
    async function isOpen() {
      const isOpenMenu = await menuRef.current?.isOpen();
      if (isOpenMenu) {
        if (history.location.pathname.includes("sailing-container")) {
          if (!accordionSailingGroup.current) {
            return;
          }
          if (accordionSailingGroup.current.value !== "sailing") {
            accordionSailingGroup.current.value = "sailing";
          }
          if (!accordionConfigurationGroup.current) {
            return;
          }
          accordionConfigurationGroup.current.value = undefined;
        }
        if (history.location.pathname.includes("delivery-container")) {
          if (!accordionDeliveryGroup.current) {
            return;
          }
          if (accordionDeliveryGroup.current.value !== "delivery") {
            accordionDeliveryGroup.current.value = "delivery"
          }
          if (!accordionConfigurationGroup.current) {
            return;
          }
          accordionConfigurationGroup.current.value = undefined;
        }

        if (history.location.pathname.includes("configuration")) {
          if (!accordionConfigurationGroup.current) {
            return;
          }
          if (accordionConfigurationGroup.current.value !== "configuration") {
            accordionConfigurationGroup.current.value = "configuration"
          }
          if (!accordionSailingGroup.current) {
            return;
          }
          accordionSailingGroup.current.value = undefined;
        }
      }
    }
    isOpen()
  }

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
      if (value) {
        dispatch(deactivateAccount());
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

  const handleMenuToggle = () => {
    menuRef.current?.toggle();
  }

  const DeliveryAccordion = () => (
    <IonAccordionGroup ref={accordionDeliveryGroup}>
      <IonAccordion className="ion-no-padding" value="delivery">
        <IonItem slot="header" lines="inset" className="ion-no-padding">
          <IonLabel>Delivery Access</IonLabel>
        </IonItem>
        <div className="ion-no-padding submenu" slot="content">
          <>
            {history.location.pathname.includes("deliveries") && (
              <>
                {DeliveryMenuItem}
              </>
            )}
            {history.location.pathname.includes("location") && (
              <>
                {DeliveryMenuItem}
                {LocationMenuItem}
              </>
            )}
            {history.location.pathname.includes("dropoffpackages") && (
              <>
                {DeliveryMenuItem}
                {LocationMenuItem}
                {DropOffPackagesMenuItem}
              </>
            )}
          </>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  )

  const SailingAccordion = () => (
    <IonAccordionGroup ref={accordionSailingGroup}>
      <IonAccordion className="ion-no-padding" value="sailing">
        <IonItem slot="header" lines="inset" className="ion-no-padding">
          <IonLabel>Sailing Access</IonLabel>
        </IonItem>
        <div className="ion-no-padding submenu" slot="content">
          <>
            {history.location.pathname.includes("sails") && (
              <>
                {SaiingMenuItem}
              </>
            )}
            {history.location.pathname.includes("pallet") && (
              <>
                {SaiingMenuItem}
                {PalletMenuItem}
              </>
            )}
            {history.location.pathname.includes("package") && (
              <>
                {SaiingMenuItem}
                {PalletMenuItem}
                {PackageMenuItem}
              </>
            )}
          </>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  )

  const SailingAccess = (
    <div className={`${history.location.pathname.includes("sailing-container") && 'multimenu-header'}`}>
      <IonItem
        button
        routerLink={`/sailing-container/sails`}
        className={`ion-no-padding`}
        onClick={handleMenuToggle}
      >
        <IonLabel>Sailing Access</IonLabel>
      </IonItem>
    </div>
  )

  const DeliveryAccess = (
    <div className={`${history.location.pathname.includes("delivery-container") && 'multimenu-header'}`}>
      <IonItem
        button
        routerLink={`/delivery-container/deliveries`}
        className={`ion-no-padding`}
        onClick={handleMenuToggle}
      >
        <IonLabel>Delivery Access</IonLabel>
      </IonItem>
    </div>
  )

  const SaiingMenuItem = (
    <IonItem
      className={`${history.location.pathname.includes("sails") && 'multimenu-label'} ion-no-padding`}
      button
      routerLink={"/sailing-container/sails"}
      routerDirection="none"
      onClick={handleMenuToggle}
    >
      <IonLabel>Sailing</IonLabel>
    </IonItem>
  )

  const PalletMenuItem = (
    <IonItem
      className={`${history.location.pathname.includes("pallet") && 'multimenu-label'} ion-no-padding`}
      button
      routerLink={`/sailing-container/pallet/${selectedSailId}`}
      routerDirection="none"
      onClick={handleMenuToggle}
    >
      <IonLabel>Pallet</IonLabel>
    </IonItem>
  )

  const PackageMenuItem = (
    <IonItem
      className={`${history.location.pathname.includes("package") && 'multimenu-label'} ion-no-padding`}
      button
      routerLink={`/sailing-container/package/${selectedPalletId}`}
      routerDirection="none"
      onClick={handleMenuToggle}
    >
      <IonLabel>Package</IonLabel>
    </IonItem>
  )

  const DeliveryMenuItem = (
    <IonItem
      className={`${history.location.pathname.includes("deliveries") && 'multimenu-label'} ion-no-padding`}
      button
      routerLink={"/delivery-container/deliveries"}
      routerDirection="none"
      onClick={handleMenuToggle}
    >
      <IonLabel>Delivery</IonLabel>
    </IonItem>
  )

  const LocationMenuItem = (
    <IonItem
      className={`${history.location.pathname.includes("location") && 'multimenu-label'} ion-no-padding`}
      button
      routerLink={`/delivery-container/location/${selectedDeliveryId}`}
      routerDirection="none"
      onClick={handleMenuToggle}
    >
      <IonLabel>Location</IonLabel>
    </IonItem>
  )

  const DropOffPackagesMenuItem = (
    <IonItem
      className={`${history.location.pathname.includes("dropoffpackages") && 'multimenu-label'} ion-no-padding`}
      button
      routerLink={`/delivery-container/dropoffpackages/${selectedDeliveryId}/${selectedLocationId}`}
      routerDirection="none"
      onClick={handleMenuToggle}
    >
      <IonLabel>Package</IonLabel>
    </IonItem>
  )

  const Menu = (
    <>

      {(((userRoles?.sailing_access === 1 && userRoles?.delivery_access === 0)
        || (userRoles?.sailing_access === 1 && userRoles?.delivery_access === 1)
        || (userRoles?.sailing_access === 2 && userRoles?.delivery_access === 0)
        || (userRoles?.sailing_access === 2 && userRoles?.delivery_access === 2)
        || userRoles?.admin_access === 1)) ?
        (
          <>
            {!history.location.pathname.includes("sailing-container") && SailingAccess}
            {history.location.pathname.includes("sailing-container") && SailingAccordion()}
          </>
        )
        : (<></>)}

      {(((userRoles?.sailing_access === 0 && userRoles?.delivery_access === 1)
        || (userRoles?.sailing_access === 1 && userRoles?.delivery_access === 1)
        || (userRoles?.sailing_access === 0 && userRoles?.delivery_access === 2)
        || (userRoles?.sailing_access === 2 && userRoles?.delivery_access === 2)
        || userRoles?.admin_access === 1)) ?
        (
          <>
            {!history.location.pathname.includes("delivery-container") && DeliveryAccess}
            {history.location.pathname.includes("delivery-container") && DeliveryAccordion()}
          </>
        )
        : (<></>)}
    </>
  )

  const Configuration = <>
    <IonAccordionGroup ref={accordionConfigurationGroup}>
      <IonAccordion className="ion-no-padding" value="configuration">
        <IonItem slot="header" lines="inset" className="ion-no-padding">
          <IonLabel>Configuration</IonLabel>
        </IonItem>
        <div className="ion-no-padding submenu" slot="content">
          {isAdmin && <>
            <IonItem
              button
              className={`${history.location.pathname.includes("users") && 'multimenu-label'} ion-no-padding`}
              routerLink={`/configuration/users`}
              onClick={handleMenuToggle}
              routerDirection="none"
            >
              <IonLabel>Users</IonLabel>
            </IonItem>
            <IonItem
              button
              className={`${history.location.pathname.includes("appsettings") && 'multimenu-label'} ion-no-padding`}
              routerLink={`/configuration/appsettings`}
              onClick={handleMenuToggle}
              routerDirection="none"
            >
              <IonLabel>Settings</IonLabel>
            </IonItem>
          </>}
          {/* {!isAdmin && <>
            <IonItem
              button
              className={`${history.location.pathname.includes("my-profile") ? 'multimenu-label' : ''} ion-no-padding`}
              routerLink={`/configuration/my-profile`}
              onClick={handleMenuToggle}
              routerDirection="none"
            >
              <IonLabel>My Profile</IonLabel>
            </IonItem>
            <IonItem
              button
              className={`${history.location.pathname.includes("change-password") ? 'multimenu-label' : ''} ion-no-padding`}
              routerLink={`/configuration/user/change-password`}
              onClick={handleMenuToggle}
              routerDirection="none"
            >
              <IonLabel>Change Password</IonLabel>
            </IonItem>
          </>} */}
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  </>

  return (
    <IonMenu ref={menuRef} side="start" contentId="main" onIonDidClose={handleCloseMenu} onIonDidOpen={handleIsOpen} disabled={getUserSession()}>
      <IonHeader >
        <IonToolbar className="ion-menu-header">
          <IonTitle>MANIFEST</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList className="ion-no-padding">
          {/* <IonMenuToggle auto-hide="false"> */}
          <div className="menu-items">
            {Menu}
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
