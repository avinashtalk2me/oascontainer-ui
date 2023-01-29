import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonRadio,
  IonRadioGroup,
  IonText,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonFabList,
  IonButton,
} from "@ionic/react";
import { close as closeIcon } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import PalletSummaryReport from "../../components/PalletSummaryReport";
import SailSummaryReport from "../../components/SailSummaryReport";
import { Container } from "../../model/container";
import { getContainerManifest, getPalletManifest } from "../../store/actions";


const ReportDetail: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { sailId }: any = useParams();
  const [reportName, setReportName] = useState("sailingsummary");
  const [sailDesc, setSailDesc] = useState("");
  const [sailDate, setSailDate] = useState("");

  const { isloading, containers } = useSelector((state: any) => state.sailing);

  useEffect(() => {
    if (containers && containers?.data?.length > 0) {
      const container: Container = containers.data.find(
        (item: Container) => item.sailId === +sailId
      );
      setSailDesc(container.sailDesc);
      setSailDate(container.sailDate);
    }
  }, [containers, sailId]);

  useEffect(() => {
    if (reportName === "sailingsummary") {
      dispatch(getContainerManifest(sailId));
    } else {
      dispatch(getPalletManifest(sailId));
    }
  }, [dispatch, reportName, sailId]);

  const handleRadioGroup = (event: any) => {
    setReportName(event.detail.value);
  };

  const closePage = () => {
    history.goBack();
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonText className="modalheader-menu">Report View</IonText>
          <IonButtons
            slot="end"
            onClick={() => closePage()}
            className="closeIcon"
          >
            <IonIcon icon={closeIcon} slot="icon-only" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList className="ion-no-padding">
          <IonRadioGroup
            className="ion-no-padding"
            value={reportName}
            onIonChange={handleRadioGroup}
          >
            {/* <IonListHeader className="ion-no-padding">
              <IonLabel color="medium">Select Report</IonLabel>
            </IonListHeader> */}
            <IonItem lines="full" className="ion-no-padding">
              <IonLabel>Sailing Summary</IonLabel>
              <IonRadio
                slot="start"
                color="success"
                value="sailingsummary"
              ></IonRadio>
            </IonItem>
            <IonItem lines="full" className="ion-no-padding">
              <IonLabel>Pallet Detail</IonLabel>
              <IonRadio
                slot="start"
                color="success"
                value="palletmanifest"
              ></IonRadio>
            </IonItem>
          </IonRadioGroup>
          <IonItem lines="none">
            <IonLabel color="medium" className="ion-text-center">
              <h3
                className="text-wrap"
                style={{ fontSize: "22px", fontWeight: "normal" }}
              >
                {sailDesc}
              </h3>
              <h3 style={{ fontSize: "20px" }}>{sailDate}</h3>
            </IonLabel>
          </IonItem>
        </IonList>
        
        {reportName === "sailingsummary" && !isloading && (
          <SailSummaryReport sailDesc={sailDesc} sailDate={sailDate} />
        )}
        {reportName === "palletmanifest" && !isloading && (
          <PalletSummaryReport sailDesc={sailDesc} sailDate={sailDate} />
        )}
        <IonLoading
          isOpen={isloading}
          message="Please wait"
          showBackdrop={false}
          translucent={true}
        />
      </IonContent>
    </>
  );
};

export default ReportDetail;
