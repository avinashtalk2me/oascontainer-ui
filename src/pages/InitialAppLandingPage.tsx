import { useEffect, useState } from 'react';
import { App as MobileApp } from "@capacitor/app";
import { useHistory } from 'react-router';
import { IonContent, IonImg, IonNote, IonPage, IonText } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { getAppVersionAPI } from '../api/fetch';
import { Dialog } from '@capacitor/dialog';


const InitialAppLandingPage: React.FC = () => {
  const history = useHistory();

  const platForm = Capacitor.getPlatform();

  const [isLatestVersion, setIsLatestVersion] = useState(false);

  const [appInfo, setAppInfo] = useState<any>({});

  useEffect(() => {
    async function getAppInfo() {
      setAppInfo(await MobileApp.getInfo());
    }
    getAppInfo();
  }, []);


  useEffect(() => {
    async function getAppInfo() {
      if (Object.keys(appInfo).length > 0) {

        try {
          const { data: { data } } = await getAppVersionAPI();
          debugger;
          const appBuildNo = data[`${platForm}_build`].toString();
          const appVersionNo = data[`${platForm}_version`].toString().trim();

          if (appBuildNo === appInfo.build && appVersionNo === appInfo.version) {
            setIsLatestVersion(true);
            loadInitialScreen();
          } else {
            setIsLatestVersion(false);
            const { value } = await Dialog.confirm({
              title: "New version",
              message: `A newer version is available. You have to download and install before you can continue to use the app.`,
              okButtonTitle: "Update",
            });

            if (value) {
              if (platForm === "android") {
                window.open("https://play.google.com/store/apps/details?id=com.oastrade.containermanifest");
              }
              MobileApp.exitApp();
            } else {
              MobileApp.exitApp()
            }
          }
        } catch (ex) {
            await Dialog.alert({
            title: "Application unavailable",
            message: `Application is currently not available. Please try after sometime.`,
          });
        }
      }
    }
    getAppInfo();
  }, [appInfo, platForm]);


  function loadInitialScreen() {
    const authToken: any = JSON.parse(
      localStorage.getItem("_authResponse") || "{}"
    );
    const idToken = authToken && authToken.access_token;

    setTimeout(() => {
      if (idToken) {
        if (authToken.userRoles.sailing_access === 1 && authToken.userRoles.delivery_access === 0) {
          return history.replace("/sailing-container/sailing");
        }
        else if (authToken.userRoles.sailing_access === 1 && authToken.userRoles.delivery_access === 1) {
          return history.replace("/loadAccessModule");
        }
        else if (authToken.userRoles.sailing_access === 0 && authToken.userRoles.delivery_access === 1) {
          return history.replace("/delivery-container/delivery");
        }
      }
      else {
        return history.replace("/login");
      }
    }, 2000)
  }

  return (
    <IonPage className="page">
      <IonContent className="ion-padding">
        <div className='logo-landing'>
          <IonImg src={'/assets/images/icon.png'} style={{ height: '80px' }} />
          <IonText>OAS Container Manifest</IonText>
        </div>
        <div className='header-landing'>
          <IonText> Loading</IonText>
          <div>
            <div className="dot-pulse"></div>
          </div>
        </div>
        <div className='version-landing'>
          <IonNote>Version: {appInfo?.version}</IonNote>
        </div>
      </IonContent>

    </IonPage>
  );
}

export default InitialAppLandingPage