import { useEffect, useState } from 'react';
import { App as MobileApp } from "@capacitor/app";
import { useHistory } from 'react-router';
import { IonButton, IonContent, IonImg, IonItem, IonLabel, IonNote, IonPage, IonText } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { getAppVersionAPI } from '../api/fetch';
import { Dialog } from '@capacitor/dialog';


const InitialAppLandingPage: React.FC = () => {

  const history = useHistory();
  const platForm = Capacitor.getPlatform();

  const [isLatestVersion, setIsLatestVersion] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserAccepted, setIsUserAccepted] = useState<string>('');
  const [appInfo, setAppInfo] = useState<any>({});

  useEffect(() => {
    async function getAppInfo() {
      setAppInfo(await MobileApp.getInfo());
    }
    if (platForm !== 'web')
      getAppInfo();
  }, [platForm]);


  useEffect(() => {
    async function getAppInfo() {
      if (Object.keys(appInfo).length > 0) {
        try {
          const { data: { data } } = await getAppVersionAPI();
          const appBuildNo = data[`${platForm}_build`].toString();
          const appVersionNo = data[`${platForm}_version`].toString().trim();
          if (appBuildNo === appInfo.build && appVersionNo === appInfo.version) {
            setIsLatestVersion(true);
            loadInitialScreen();
          } else {
            setIsLatestVersion(false);
            setIsLoading(false);

            if (platForm === "android") {
              const { value } = await Dialog.confirm({
                title: "Updates available",
                message: `A newer version is available. You have to download and install before you can continue to use the app.`,
                okButtonTitle: "Update",
                cancelButtonTitle: 'No, Thanks'
              });
              if (value) {
                window.open("https://play.google.com/store/apps/details?id=com.oastrade.containermanifest");
                setIsUserAccepted('yes')
              } else {
                MobileApp.exitApp()
              }
            } else {
              const { value } = await Dialog.confirm({
                title: "Updates available",
                message: `A newer version is available. You have to download and install before you can continue to use the app.`,
                okButtonTitle: "Update",
                cancelButtonTitle: "Not Now"
              });
              if (value) {
                window.open("https://apps.apple.com/us/app/oas-container-manifest/id1638157362");
                setIsUserAccepted('yes')
              } else {
                // MobileApp.exitApp()
                setIsUserAccepted('no');
              }
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
    if (platForm !== 'web')
      getAppInfo();
    else
      loadInitialScreen()
  }, [appInfo, platForm]);


  function loadInitialScreen() {
    const authToken: any = JSON.parse(
      localStorage.getItem("_authResponse") || "{}"
    );
    const idToken = authToken && authToken.access_token;

    setTimeout(() => {
      if (idToken) {
        if ((authToken.userRoles.sailing_access === 1 || authToken.userRoles.sailing_access === 2) && authToken.userRoles.delivery_access === 0) {
          return history.replace("/sailing-container/sailing");
        }
        else if ((authToken.userRoles.sailing_access === 1 || authToken.userRoles.sailing_access === 2) && (authToken.userRoles.delivery_access === 1 || authToken.userRoles.sailing_access === 2)) {
          return history.replace("/loadAccessModule");
        }
        else if (authToken.userRoles.sailing_access === 0 && (authToken.userRoles.delivery_access === 1 ||
          authToken.userRoles.delivery_access === 2)) {
          return history.replace("/delivery-container/delivery");
        }
      }
      else {
        return history.replace("/login");
      }
      setIsLoading(false);

    }, 2000)
  }

  return (
    <IonPage className="page">
      <IonContent className="ion-padding">
        <div className='logo-landing'>
          <IonImg src={'/assets/images/icon.png'} style={{ height: '80px' }} />
          <IonText>OAS Container Manifest</IonText>
        </div>
        {isLoading && <>
          <div className='header-landing'>
            <IonText> Loading</IonText>
            <div>
              <div className="dot-pulse"></div>
            </div>
          </div>
        </>}
        {!isLoading && !isLatestVersion && isUserAccepted === "yes" && <>
          <div className="header-update-landing">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '1.25rem'
            }}>
              <IonText>Update in progress.</IonText>
              <div style={{ alignSelf: 'center' }}>
                <div className="dot-pulse"></div>
              </div>
            </div>
          </div>
        </>}
        {!isLoading && !isLatestVersion && isUserAccepted === 'no' && platForm === 'ios' && <>
          <div className="header-update-landing">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '1.25rem'
            }}>
              <IonText>There is a new version of OAS Container Manifest. <br />You must update before accessing.</IonText>
              <IonText>Click below button to apply update to continue.</IonText>
              <IonItem className="ion-no-padding" lines='none'>
                <IonButton onClick={() => window.open("https://apps.apple.com/us/app/oas-container-manifest/id1638157362")} style={{ width: '50%', margin: 'auto' }}>GO TO APP STORE</IonButton>
              </IonItem>
              {/* <IonText><a onClick={() => window.open("https://apps.apple.com/us/app/oas-container-manifest/id1638157362")}>Click here </a>to go to App Store and apply update to continue.</IonText> */}
            </div>
          </div>
        </>}
        <div className='version-landing'>
          <IonNote>Version: {appInfo?.version}</IonNote>
        </div>
      </IonContent>

    </IonPage >
  );
}

export default InitialAppLandingPage