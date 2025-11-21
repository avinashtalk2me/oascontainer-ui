import {
  IonCol,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonList,
  IonListHeader,
  IonRow,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Pallet } from "../model/pallet";
import { PDFGenerator } from "@awesome-cordova-plugins/pdf-generator";
import { PalletReportPDF } from "../utils/PalletReportPDF";
import {
  shareSocial as shareIcon,
} from "ionicons/icons";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

interface PalletSummaryReportProps {
  sailDesc: string;
  sailDate: string;
}

const PalletSummaryReport: React.FC<PalletSummaryReportProps> = ({
  sailDate,
  sailDesc,
}) => {
  const [uniquePallets, setUniquePallets] = useState([]);
  const { isloading, palletManifest } = useSelector((state: any) => state.sailing);

  useEffect(() => {
    if (isloading) return;
    if (palletManifest && palletManifest?.data?.length > 0) {
      setUniquePallets(
        Array.from(
          new Set(palletManifest.data.map((item: Pallet) => item.palletNo))
        )
      );
    }
  }, [palletManifest, isloading]);


  const shareFile = async () => {
    let options = {
      documentSize: "LETTER",
      type: "base64",
      fileName: "PalletDetails.pdf",
    };

    const base64Content = await PDFGenerator.fromData(
      PalletReportPDF(sailDesc, sailDate, uniquePallets, palletManifest),
      options
    );

    // const fileOutput = await Filesystem.writeFile({
    //   path: options.fileName,
    //   data: base64Content,
    //   directory: Directory.Data,
    // });

    const savePdf = async () => {
      const result = await Filesystem.writeFile({
        path: `${options.fileName}`,
        data: base64Content,
        directory: Directory.Cache
        // encoding: Encoding.UTF8,
      });

      return result.uri;

    }

    const pdfUri = await savePdf();
    await Share.share({
      title: 'Pallet Details Report',
      text: `Pallet Details (${sailDesc}) (${sailDate})`,
      url: pdfUri,
      dialogTitle: 'Share PDF',
    });
  };

  const getIsPalletOrLoose = (palletNo: number): string => {
    return palletManifest.data.find((item: Pallet) => item.palletNo === palletNo).palletType
  }

  const getPalletDetails = (palletNo: number) => {
    const palletsByPalletNo = palletManifest.data.filter(
      (pallet: Pallet) => pallet.palletNo === palletNo
    );
    return palletsByPalletNo.length > 1 ? (
      <IonGrid>
        <IonRow className="pallet-section-header">
          <IonCol className="ion-no-padding">HWB#</IonCol>
          <IonCol className="ion-no-padding">Pieces</IonCol>
        </IonRow>
        {palletsByPalletNo.map((pallet: any, index: number) => (
          <IonRow className="report-body borderDiv" key={palletNo + index}>
            <IonCol>
              <IonText color="medium">{pallet.hwbNo}</IonText>
            </IonCol>
            <IonCol>
              <IonText color="medium">{pallet.packageCount} (of {pallet.totalPackages} pieces)</IonText>
            </IonCol>
          </IonRow>
        ))}
        <IonRow className="pallet-section-footer">
          <IonCol size="12" className="ion-no-padding footer-total">
            <IonText className="ion-padding-bottom ">
              <b>Total:</b>
            </IonText>
          </IonCol>
          <IonCol className="ion-no-padding">
            <IonText className="ion-no-padding ">
              <b>{palletsByPalletNo.length} </b>
            </IonText>
          </IonCol>
          <IonCol className="ion-no-padding">
            <IonText>
              <b>
                {" "}
                {palletsByPalletNo.reduce(
                  (sum: number, item: any) => (sum += item.packageCount),
                  0
                )}{" "}
              </b>
            </IonText>
          </IonCol>
        </IonRow>
      </IonGrid>
    ) : (palletsByPalletNo.length === 1 && palletsByPalletNo[0].hwbNo !== "" ? (
      <IonGrid>
        <IonRow className="pallet-section-header">
          <IonCol className="ion-no-padding">HWB#</IonCol>
          <IonCol>Pieces</IonCol>
        </IonRow>
        <IonRow className="report-body borderDiv">
          <IonCol>
            <IonText color="medium">{palletsByPalletNo[0].hwbNo}</IonText>
          </IonCol>
          <IonCol>
            <IonText color="medium">
              {palletsByPalletNo[0].packageCount} (of {palletsByPalletNo[0].totalPackages} pieces)
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className="pallet-section-footer">
          <IonCol size="12" className="ion-no-padding footer-total">
            <IonText>
              <b>Total:</b>
            </IonText>
          </IonCol>
          <IonCol className="ion-no-padding">
            <IonText className="ion-no-padding ">
              <b>{1} </b>
            </IonText>
          </IonCol>
          <IonCol className="ion-no-padding">
            <IonText>
              <b>{palletsByPalletNo[0].packageCount}</b>
            </IonText>
          </IonCol>
        </IonRow>
      </IonGrid>
    ) : (
      <IonText color="medium">No details available</IonText>
    ));
  };

  return !isloading && uniquePallets && uniquePallets.length === 0 ? (
    <div className="text-wrapper noitem">
      <IonText className="ion-no-padding">No details available.</IonText>
    </div>
  ) : (
    <div style={{ position: "relative" }}>
      <IonFab
        className="ion-no-padding"
        horizontal="start"
        vertical="top"
        slot="end"
        edge={true}
      >
        <IonFabButton style={{ color: '#007bff' }}>
          <IonIcon icon={shareIcon} style={{ color: '#fff' }} onClick={() => shareFile()}></IonIcon>
        </IonFabButton>
      </IonFab>
      <div className="report-section">
        <IonList className="ion-no-padding">
          {!isloading && (uniquePallets || []).map((palletNo: number) => (
            <div key={palletNo}>
              <IonListHeader className="ion-no-padding" key={palletNo}>
                {getIsPalletOrLoose(palletNo) === "Pallet" ? <h3 color="medium">Pallet# {palletNo}</h3> :
                  <h3 color="medium">Loose</h3>}
              </IonListHeader>
              {getPalletDetails(palletNo)}
            </div>
          ))}
        </IonList>
      </div>
    </div>
  );
};

export default PalletSummaryReport;
