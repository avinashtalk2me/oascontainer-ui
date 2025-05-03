import {
  IonCol,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonList,
  IonRow,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PDFGenerator } from "@awesome-cordova-plugins/pdf-generator";
import {
  shareSocial as shareIcon,
} from "ionicons/icons";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { Package } from "../model/package";
import { HWBReportPDF } from "../utils/HWBReportPDF";

interface HWBSummaryReportProps {
  sailDesc: string;
  sailDate: string;
}

const HWBSummaryReport: React.FC<HWBSummaryReportProps> = ({
  sailDate,
  sailDesc,
}) => {
  const [uniqueHwbNos, setUniqueHwbNos] = useState([]);
  const { hwbManifest } = useSelector((state: any) => state.sailing);

  useEffect(() => {
    if (hwbManifest && hwbManifest?.data?.length > 0) {
      setUniqueHwbNos(
        Array.from(
          new Set(hwbManifest.data.map((item: Package) => item.hwbNo))
        )
      );
    }
  }, [hwbManifest]);


  const shareFile = async () => {
    let options = {
      documentSize: "LETTER",
      type: "base64",
      fileName: "HWBDetails.pdf",
    };

    const base64Content = await PDFGenerator.fromData(
      HWBReportPDF(sailDesc, sailDate, uniqueHwbNos, hwbManifest),
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
      title: 'HWB Details Report',
      text: `HWB Details (${sailDesc}) (${sailDate})`,
      url: pdfUri,
      dialogTitle: 'Share PDF',
    });

  };

  const getPiecesCount = (palletsByHwbNo: any) => {
    return palletsByHwbNo.reduce(
      (sum: number, item: any) => (sum += item.packageCount),
      0
    )
  }

  const getTotalPkgCount = (hwbNo: string) => {
    return hwbManifest.data.find((pkg: Package) => pkg.hwbNo === hwbNo).totalPackages
  }

  const getHWBPalletDetails = (hwbNo: string) => {
    const palletsByHwbNo = hwbManifest.data.filter(
      (pkg: Package) => pkg.hwbNo === hwbNo
    );
    const count = getPiecesCount(palletsByHwbNo);
    const totalPkgCount = getTotalPkgCount(hwbNo)
    return palletsByHwbNo.length >= 1 ? (
      <IonGrid>
        <IonRow>
          <IonCol size="12" className="ion-no-padding">
            <IonText className="ion-padding-bottom ">
              <h3>HWB #: {`${hwbNo}`}</h3>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className="pallet-section-header">
          <IonCol className="ion-no-padding">Pallet#</IonCol>
          <IonCol className="ion-no-padding">Pieces</IonCol>
        </IonRow>
        {palletsByHwbNo.map((pallet: any, index: number) => (
          <IonRow className="report-body borderDiv" key={index}>
            <IonCol>
              {pallet.palletType === 'Loose' ? <IonText color="medium">Loose</IonText> :
                <IonText color="medium">Pallet {pallet.palletNo}</IonText>}
            </IonCol>
            <IonCol>
              <IonText color="medium">{pallet.packageCount}</IonText>
            </IonCol>
          </IonRow>
        ))}
        <IonRow className="pallet-section-footer">
          <IonCol size="12" className="ion-no-padding footer-total">
            <IonText className="ion-padding-bottom ">
              <b>Total:</b>  <IonText>
                <>{count} of {totalPkgCount} {+totalPkgCount === 1 ? 'piece' : 'pieces'} </>
              </IonText>
            </IonText>
          </IonCol>
        </IonRow>
      </IonGrid>
    ) : (
      <IonText color="medium">No details available</IonText>
    );
  };

  return uniqueHwbNos && uniqueHwbNos.length === 0 ? (
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
        <IonFabButton color="medium">
          <IonIcon icon={shareIcon} onClick={() => shareFile()}></IonIcon>
        </IonFabButton>
      </IonFab>
      <div className="report-section">
        <IonList className="ion-no-padding">
          {(uniqueHwbNos || []).map(hwbNo => (
            <div key={hwbNo}>
              {getHWBPalletDetails(hwbNo)}
            </div>
          ))}
        </IonList>
      </div>
    </div>
  );
};

export default HWBSummaryReport;
