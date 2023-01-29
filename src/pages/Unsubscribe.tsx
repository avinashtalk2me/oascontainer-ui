import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonImg,
    IonPage,
    IonRow,
    IonText,
    IonToolbar
} from "@ionic/react";
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { DELETE_LOGOUT } from "../store/types";


const Unsubscribe: React.FC = () => {
    const dispatch = useDispatch();
    const { userDeletedSuccess } = useSelector((state: any) => state.user);

    useEffect(() => {
        if (userDeletedSuccess) {
            localStorage &&
                localStorage.getItem("_authResponse") &&
                localStorage.removeItem("_authResponse");
            dispatch({ type: DELETE_LOGOUT });
        }
    }, [userDeletedSuccess])
    return (
        <IonPage className="page">
            <IonHeader>
                <IonToolbar>Confirmation</IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        {userDeletedSuccess &&
                            <>
                                <IonCol size="12">
                                    <IonImg src={'/assets/images/complete.png'} style={{ height: '180px' }} />
                                </IonCol>
                                <IonCol size="12" className="ion-text-center ion-margin-top">
                                    <IonText className="ion-font-bold">{userDeletedSuccess}</IonText>
                                </IonCol>

                                <IonCol size="12" className="ion-text-center ion-margin-top">
                                    <IonText className="ion-font-bold">Click 'REGISTER' to create new account</IonText>
                                </IonCol>
                                <IonCol>
                                    <IonButton expand="full" routerLink="/register">REGISTER</IonButton>
                                </IonCol>
                            </>
                        }
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default Unsubscribe;