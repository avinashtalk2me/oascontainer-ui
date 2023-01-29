import { IonButton, IonContent, IonItem } from "@ionic/react";
import { useState, useEffect } from "react";
import {
  BarcodeScanner,
  ScanResult,
} from "@capacitor-community/barcode-scanner";

export interface CameraScannerProps {
  buttonText: string;
  setScannedText: (arg: string) => void;
  setBgForCamera: (arg: string) => void;
}

const CameraScannerButton: React.FC<CameraScannerProps> = ({
  buttonText,
  setScannedText,
  setBgForCamera,
}) => {
  const [isScanOn, setIsScanOn] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (status.granted) {
          return true;
        }
        return false;
      } catch (error: any) {
        // setErr(error.message);
        console.log(error.message);
      }
    };

    checkPermission();

    return () => {};
  }, []);

  const startScan = async () => {
    BarcodeScanner.hideBackground();
    setBgForCamera("hideBg");
    setIsScanOn(true);
    const result: any = await BarcodeScanner.startScan();

    stopScan();
    setScannedText(result.content);
  };

  const stopScan = () => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    setIsScanOn(false);
    setBgForCamera("");
  };

  return (
    <>
      <IonButton
        color="medium"
        expand="block"
        className="start-scan-button"
        onClick={startScan}
      >
        {buttonText}
      </IonButton>

      <IonButton
        color="danger"
        className="stop-scan-button"
        hidden={!isScanOn}
        onClick={stopScan}
      >
        Stop Scan
      </IonButton>

      <div hidden={!isScanOn} className="scan-box" />
    </>
  );
};

export default CameraScannerButton;
