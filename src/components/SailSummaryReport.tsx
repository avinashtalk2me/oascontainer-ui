import {
  IonButton,
  IonCol,
  IonGrid,
  IonItem,
  IonRow,
  IonText,
  IonIcon,
  IonFab,
  IonFabButton,
  IonFabList,
  IonContent,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IPallet } from "../model/pallet";
import { Share } from "@capacitor/share";
import { PDFGenerator } from "@awesome-cordova-plugins/pdf-generator";
import { SailingReportPDF } from "../utils/SailingReportPDF";
import {
  shareSocial as shareIcon,
  logoWhatsapp as whatsappIcon,
  mail as mailIcon,
  informationCircleOutline as infoIcon,
} from "ionicons/icons";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { SocialSharing } from "@awesome-cordova-plugins/social-sharing";
import { Dialog } from "@capacitor/dialog";


interface SailSummaryReportProps {
  sailDesc: string;
  sailDate: string;
}

const SailSummaryReport: React.FC<SailSummaryReportProps> = ({
  sailDate,
  sailDesc,
}) => {
  const [summary, setSummary] = useState<any>({});
  const { containerManifest } = useSelector((state: any) => state.sailing);

  useEffect(() => {
    if (containerManifest && containerManifest?.data?.length > 0) {
      const data = {
        unitType: containerManifest?.data[0].palletWeights.slice(-2),

        palletTotal: containerManifest?.data?.filter(
          (item: IPallet) => item.palletType === "Pallet"
        ).length,
        looseTotal: containerManifest.data.filter(
          (item: IPallet) => item.palletType === "Loose"
        ).length,
        palletPieces: containerManifest.data
          .filter((item: IPallet) => item.palletType === "Pallet")
          .reduce(
            (sum: number, item: IPallet) => (sum += +item.packageCount),
            0
          ),
        loosePieces: containerManifest.data
          .filter((item: IPallet) => item.palletType === "Loose")
          .reduce(
            (sum: number, item: IPallet) => (sum += +item.packageCount),
            0
          ),
        palletPiecesWeight: containerManifest.data
          .filter((item: IPallet) => item.palletType === "Pallet")
          .reduce(
            (sum: number, item: IPallet) => (sum += +parseInt(item.palletWeights)),
            0
          ),
        loosePiecesWeight: containerManifest.data
          .filter((item: IPallet) => item.palletType === "Loose")
          .reduce(
            (sum: number, item: IPallet) => (sum += +parseInt(item.palletWeights)),
            0
          ),
      };
      setSummary(data);
    }
  }, [containerManifest]);


  const shareFile = async (shareType: string) => {
    let options = {
      documentSize: "LETTER",
      type: "base64",
      fileName: "SailingSummary.pdf",
    };

    const base64Content = await PDFGenerator.fromData(
      SailingReportPDF(sailDesc, sailDate, containerManifest, summary),
      options
    );


    // await Filesystem.mkdir({ directory: Directory.Data, path: 'oasdocs' });

    const fileOutput = await Filesystem.writeFile({
      path: `${options.fileName}`,
      data: base64Content,
      directory: Directory.Data,
    });

    if (shareType === "whatsapp") {
      await SocialSharing.shareViaWhatsApp(
        `Sailing Summary report (${sailDesc}) (${sailDate})`,
        fileOutput.uri
      );
      // await Filesystem.rmdir({ directory: Directory.Data, path: 'oasdocs' });
    } else {
      SocialSharing.canShareViaEmail().then(async () => {
        await SocialSharing.shareViaEmail(`Sailing Summary (${sailDesc}) (${sailDate})`,
          `Sailing Summary Report`, [], undefined, undefined, // results
          fileOutput.uri
        );
        // await Filesystem.rmdir({ directory: Directory.Data, path: 'oasdocs' });
      }).catch(() => {
        Dialog.alert({
          title: "Alert",
          message: `Email is not configured. Please configure email.`,
        });
      });
    }
  };

  const SailingReport: JSX.Element = (
    <IonGrid className="ion-no-padding">
      <IonRow>
        <IonCol sizeMd="3">
          <h4>Pallet</h4>
        </IonCol>
        <IonCol sizeMd="3">
          <h4>Type</h4>
        </IonCol>
        <IonCol sizeMd="2">
          <h4>Pieces</h4>
        </IonCol>
        <IonCol sizeMd="4">
          <h4>Weights</h4>
        </IonCol>
      </IonRow>
      {(containerManifest.data || []).map((pallet: IPallet, index: number) => (
        <IonRow key={index} className="sailreport report-body">
          <div
            style={{ display: "flex", flexDirection: "row" }}
            className={`${pallet.palletType === "Pallet" ? "borderDiv" : ""}`}
          >
            <IonCol sizeMd="3">
              <IonText color="medium">
                {pallet.palletType !== 'Loose' ? pallet.palletNo : 'Loose'}
              </IonText>
            </IonCol>
            <IonCol sizeMd="3">
              <IonText color="medium">{pallet.palletType}</IonText>
            </IonCol>
            <IonCol sizeMd="2">
              <IonText color="medium">{pallet.packageCount}</IonText>
            </IonCol>
            <IonCol sizeMd="4">
              <IonText color="medium">{pallet.palletWeights}</IonText>
            </IonCol>
          </div>
          {pallet.palletType === "Loose" && (
            <div
              className={`${pallet.palletType === "Loose" ? "borderDiv" : ""}`}
            >
              <IonCol sizeMd="12">
                <span style={{ marginRight: "0.25em" }}>Description: </span>
                <IonText color="medium">{pallet.palletDesc}</IonText>
              </IonCol>
            </div>
          )}
        </IonRow>
      ))}
      <IonRow>
        <IonCol className="ion-no-padding">
          <IonItem lines="none" className="ion-no-padding">
            <b>Total:</b>
          </IonItem>
          <IonItem className="ion-no-padding">
            <IonGrid className="ion-no-padding">
              {summary.palletTotal > 0 && (
                <IonRow>
                  <IonItem className="ion-no-padding" style={{ width: "100%" }}>
                    <IonCol sizeXs="3" sizeMd="3" className="ion-no-padding">
                      <IonText>
                        <b>{summary.palletTotal}</b>
                      </IonText>
                    </IonCol>
                    <IonCol sizeXs="3" sizeMd="3">
                      <IonText>
                        <b>{"Pallet"}</b>
                      </IonText>
                    </IonCol>
                    <IonCol sizeMd="3">
                      <IonText>
                        <b>{summary.palletPieces}</b>
                      </IonText>
                    </IonCol>
                    <IonCol sizeMd="3">
                      <IonText>
                        <b>{summary.palletPiecesWeight + ' ' + summary.unitType}</b>
                      </IonText>
                    </IonCol>
                  </IonItem>
                </IonRow>
              )}
              {summary.looseTotal > 0 && (
                <IonRow>
                  <IonItem
                    lines="none"
                    className="ion-no-padding"
                    style={{ width: "100%" }}
                  >
                    <IonCol sizeXs="3" sizeMd="3">
                      <IonText>
                        <b>{summary.looseTotal}</b>
                      </IonText>
                    </IonCol>
                    <IonCol sizeXs="3" sizeMd="3">
                      <IonText>
                        <b>{"Loose"}</b>
                      </IonText>
                    </IonCol>
                    <IonCol sizeMd="3">
                      <IonText>
                        <b>{summary.loosePieces}</b>
                      </IonText>
                    </IonCol>
                    <IonCol sizeMd="3">
                      <IonText>
                        <b>{summary.loosePiecesWeight + ' ' + summary.unitType}</b>
                      </IonText>
                    </IonCol>
                  </IonItem>
                </IonRow>
              )}
            </IonGrid>
          </IonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );

  return containerManifest && containerManifest?.data?.length === 0 ? (
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
      <div className="report-section">{SailingReport}</div>
    </div>
  );
};

export default SailSummaryReport;
