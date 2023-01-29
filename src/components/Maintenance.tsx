import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
} from "@ionic/react";

const Maintenance: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>Maintenance</IonToolbar>
      </IonHeader>
      <IonContent>
        <IonContent className="ion-padding">
          <IonGrid>
            <IonRow>
              <IonCol size="12" className="ion-text-center">
                <h3>Site is currently under maintenance</h3>
              </IonCol>
              <IonCol size="12">
                <IonImg
                  src={"../assets/images/maintenance-sign.jpg"}
                  style={{ height: "100%" }}
                />
              </IonCol>
              <IonCol size="12" className="ion-text-center">
                <h3>Please check on us later.</h3>
                <h3>Sorry for inconvience</h3>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Maintenance;
