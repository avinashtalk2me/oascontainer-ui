import React, { useEffect, useLayoutEffect, useRef } from 'react';
import {
  createAnimation,
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonImg,
  IonSkeletonText,
  IonIcon,
} from '@ionic/react';
import '../../src/LoadAccessModule.css'
import { useHistory } from 'react-router';
import { powerOutline as logout } from "ionicons/icons";
import { LOGOUT } from '../store/types';
import { useDispatch } from 'react-redux';


function LoadAccessModule() {
  const modal = useRef<HTMLIonModalElement>(null);
  const history = useHistory();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    modal.current?.present();
  }, []);


  function dismiss(option: string) {
    if (option === 'sailing') {
      history.replace("/sailing-container/sails");
    }
    if (option === 'delivery') {
      history.replace("/delivery-container/deliveries");
    }
    modal.current?.dismiss();
  }

  const enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = createAnimation()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimation = (baseEl: HTMLElement) => {
    return enterAnimation(baseEl).direction('reverse');
  };

  const handleLogout = () => {
    modal.current?.dismiss();

    dispatch({ type: LOGOUT });
    localStorage &&
      localStorage.getItem("_authResponse") &&
      localStorage.removeItem("_authResponse");
    history.replace('/login');
  }

  return (
    <IonPage className="page">
      <IonContent className="ion-padding blurBox">
        {Array.apply(null, Array(20)).map((item: any, index: number) => (
          <IonItem className="ion-no-padding item-box" key={index}>
            <IonLabel color="medium" className="ion-no-margin">
              <h3>
                <IonSkeletonText
                  animated
                  style={{ width: "100%", height: "45px" }}
                />
              </h3>
              <span>
                <IonSkeletonText animated style={{ width: "50%" }} />
              </span>
              <span>
                <IonSkeletonText animated style={{ width: "50%" }} />
              </span>
            </IonLabel>
          </IonItem>
        ))}
        <IonModal id="example-modal" ref={modal} trigger="open-custom-dialog" backdropDismiss={false}>
          <div className="wrapper">
            <h3>Select an access</h3>

            <IonList lines="none">
              <IonItem button={true} detail={false} onClick={() => dismiss('sailing')}>
                {/* <IonIcon icon={personCircle}></IonIcon> */}
                <div className='circleDiv'></div>
                <IonLabel>Sailing Access</IonLabel>
              </IonItem>
              <IonItem button={true} detail={false} onClick={() => dismiss('delivery')}>
                {/* <IonIcon icon={personCircle}></IonIcon> */}
                <div className='circleDiv'></div>
                <IonLabel>Delivery Access</IonLabel>
              </IonItem>
            </IonList>
            <div className='logout'>
              <IonButton
                fill='clear'
                slot="end"
                onClick={() => handleLogout()}
                className="closeIcon"
              >
                <IonIcon icon={logout} slot="icon-only" />
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}

export default LoadAccessModule;