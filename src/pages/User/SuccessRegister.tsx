import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonPage, IonRow, IonText, IonToolbar } from "@ionic/react";


const RegisterSuccess: React.FC = () => {
    return (
        <IonPage className="page">
            <IonHeader>
                <IonToolbar>Confirmation</IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol size="12">
                            <IonImg src={'/assets/images/complete.png'} style={{ height: '180px' }} />
                        </IonCol>
                        <IonCol size="12" className="ion-text-center ion-margin-top">
                            <IonText className="ion-font-bold">Registration completed successfully</IonText>
                        </IonCol>
                        <IonCol size="12" className="ion-text-center ion-margin-top">
                            <IonText className="ion-font-bold">Click 'LOGIN' to go to Login page</IonText>
                        </IonCol>
                        <IonCol>
                            <IonButton expand="full" routerLink="/">Login</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default RegisterSuccess;