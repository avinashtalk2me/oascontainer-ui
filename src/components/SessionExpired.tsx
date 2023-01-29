import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { NavButton } from "./NavButton";

const SessionExpired: React.FC = () => {
  return (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar>
          <IonText>Session Timeout</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList lines="none" className="ion-padding ion-text-center">
          <IonText>Your current session has expired.</IonText>
          <IonButton
            className="ion-padding-vertical"
            expand="block"
            routerLink="/"
          >
            Click here to Login
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SessionExpired;
