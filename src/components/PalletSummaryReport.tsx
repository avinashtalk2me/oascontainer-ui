import {
  IonButton,
  IonCol,
  IonFab,
  IonFabButton,
  IonFabList,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
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
  logoWhatsapp as whatsappIcon,
  mail as mailIcon,
} from "ionicons/icons";
import { Filesystem, Directory, FilesystemPlugin } from "@capacitor/filesystem";
import { SocialSharing } from "@awesome-cordova-plugins/social-sharing";
import { Share } from "@capacitor/share";
import { Dialog } from "@capacitor/dialog";

interface PalletSummaryReportProps {
  sailDesc: string;
  sailDate: string;
}

const PalletSummaryReport: React.FC<PalletSummaryReportProps> = ({
  sailDate,
  sailDesc,
}) => {
  const [uniquePallets, setUniquePallets] = useState([]);
  const [results, setResults] = useState("");
  const [shareType, setShareType] = useState("");
  const { palletManifest } = useSelector((state: any) => state.sailing);

  useEffect(() => {
    if (palletManifest && palletManifest?.data?.length > 0) {
      setUniquePallets(
        Array.from(
          new Set(palletManifest.data.map((item: Pallet) => item.palletNo))
        )
      );
    }
  }, [palletManifest]);

  // const downloadFile = async () => {
  //   let options = {
  //     documentSize: "LETTER",
  //     type: "base64",
  //     fileName: "PalletDetails.pdf",
  //   };

  //   const base64Content = await PDFGenerator.fromData(
  //     PalletReportPDF(sailDesc, sailDate, uniquePallets, palletManifest),
  //     options
  //   );

  //   const fileOutput = await Filesystem.writeFile({
  //     path: options.fileName,
  //     data: base64Content,
  //     directory: Directory.Documents,
  //   });
  //   setResults(fileOutput.uri);
  // };

  const shareFile = async (shareType: string) => {
    setShareType(shareType);
    // downloadFile();
    let options = {
      documentSize: "LETTER",
      type: "base64",
      fileName: "PalletDetails.pdf",
    };

    const base64Content = await PDFGenerator.fromData(
      PalletReportPDF(sailDesc, sailDate, uniquePallets, palletManifest),
      options
    );

    const fileOutput = await Filesystem.writeFile({
      path: options.fileName,
      data: base64Content,
      directory: Directory.Documents,      
    });
    setResults(fileOutput.uri);
    if (shareType === "whatsapp") {
      await SocialSharing.shareViaWhatsApp(
        `Pallet Details report (${sailDesc}) (${sailDate})`,
        // results
        fileOutput.uri
      );
    } else {
      SocialSharing.canShareViaEmail().then(async () => {
        await SocialSharing.shareViaEmail(
          `Pallet Details (${sailDesc}) (${sailDate})`,
          `Pallet Details Report`,
          [],
          undefined,
          undefined,
          // results
          fileOutput.uri
        );
      }).catch(() => {
        Dialog.alert({
          title: "Alert",
          message: `Email is not configured. Please configure email.`,
        });
      });
    } 
  };

  // useEffect(() => {
  //   async function shareFile() {
  //     if (shareType === "whatsapp") {
  //       await SocialSharing.shareViaWhatsApp(
  //         `Pallet Details report (${sailDesc}) (${sailDate})`,
  //         results
  //       );
  //     } else {
  //       await SocialSharing.shareViaEmail(
  //         `Pallet Details (${sailDesc}) (${sailDate})`,
  //         `Pallet Details Report`,
  //         [],
  //         undefined,
  //         undefined,
  //         results
  //       );
  //     }
  //   }
  //   shareFile();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [results]);

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
              <IonText color="medium">{pallet.packageCount}</IonText>
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
    ) : palletsByPalletNo.length === 1 && palletsByPalletNo[0].hwbNo !== "" ? (
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
              {palletsByPalletNo[0].packageCount}
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
    );
  };

  return uniquePallets && uniquePallets.length === 0 ? (
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
          <IonIcon icon={shareIcon}></IonIcon>
        </IonFabButton>
        <IonFabList side="bottom">
          <IonFabButton color="green" onClick={() => shareFile("whatsapp")}>
            <IonIcon icon={whatsappIcon}></IonIcon>
          </IonFabButton>
          <IonFabButton color="tertiary" onClick={() => shareFile("email")}>
            <IonIcon icon={mailIcon}></IonIcon>
          </IonFabButton>
        </IonFabList>
      </IonFab>
      <div className="report-section">
        <IonList className="ion-no-padding">
          {(uniquePallets || []).map((palletNo: number) => (
            <div key={palletNo}>
              <IonListHeader className="ion-no-padding" key={palletNo}>
                <h3 color="medium">Pallet# {palletNo}</h3>
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
