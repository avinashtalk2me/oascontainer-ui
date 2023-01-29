import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonNote,
  IonPage,
  IonText,
  IonToolbar,
} from "@ionic/react";
import {
  close as closeIcon,
  removeCircle as removeItem,
  addCircle as addItem,
  camera,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Error from "../../components/Error";
import {
  insertPackage,
  getSelectedPackageById,
  updatePackage,
} from "../../store/actions";
import ServerError from "../../components/ServerError";
import ToastMsg from "../../components/ToastMsg";
import CameraScannerButton from "../../components/CameraScannerButton";
import { useHistory, useParams } from "react-router";
import SessionExpired from "../../components/SessionExpired";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import "../../camera-scanner.css";


interface AddEditPackageProps {
  isNew: boolean;
}

const AddEditDeliveryDropOff: React.FC<AddEditPackageProps> = ({ isNew }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { palletId, packageId }: any = useParams();
  const [hideBg, setHideBg] = useState("");

  const { isloading, isItemSaved, error, packageData } = useSelector(
    (state: any) => state.package
  );

  useEffect(() => {
    if (!isNew) {
      setValue("hwbNo", "");
      setValue("packageCount", "0");
      dispatch(getSelectedPackageById(palletId, packageId));
    }
  }, [isNew, dispatch]);

  useEffect(() => {
    if (!isNew && packageData && packageData?.status === 0) {
      setValue("hwbNo", packageData.data.hwbNo);
      setValue("packageCount", packageData.data.packageCount);
    }
  }, [packageData, isNew]);

  // useEffect(() => {
  //   alert(scannedText);
  // }, [setScannedText]);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({});

  const watchPackageCount = watch("packageCount");

  const resetForm = () => {
    setValue("hwbNo", "");
    reset(
      {},
      {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: true,
        keepSubmitCount: false,
      }
    );
  };

  useEffect(() => {
    if (isItemSaved) {
      let timer = setTimeout(() => {
        dispatch({ type: "RESET_FORM" });
        closePage();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isItemSaved]);

  const onSubmit = (data: any) => {
    if (isNew) {
      dispatch(insertPackage(palletId, data));
    } else {
      dispatch(updatePackage(packageId, data));
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value) {
        clearErrors(name);
      } else {
        // setError(name)
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleDecrementCount = () => {
    setValue(
      "packageCount",
      watchPackageCount >= 1 ? watchPackageCount - 1 : 0
    );
  };

  const handleIncrementCount = () => {
    setValue("packageCount", watchPackageCount + 1);
  };

  const closePage = () => {
    history.goBack();
  };

  const startScan = async () => {
    BarcodeScanner.hideBackground(); // make background of WebView transparent
    setHideBg("hideBg");
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    stopScan();
    if (result.hasContent) {
      setValue("hwbNo", result.content);
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const status = await BarcodeScanner.checkPermission({ force: true });

        if (status.granted) {
          return true;
        }

        return false;
      } catch (error) {
        // setErr(error.message)
        // console.log(error.message)
      }
    };

    checkPermission();

    return () => {};
  }, []);

  // if (error && error.status === -100) {
  //   // return (
  //   //   <SessionExpired headerText={isNew ? "Add Package" : "Edit Package"} />
  //   // );
  // }

  const stopScan = () => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    setHideBg("");
  };

  return (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar>
          <IonText className="modalheader-menu">
            {isNew ? "Add Package" : "Edit Package"}
          </IonText>
          <IonButtons
            hidden={!!hideBg}
            slot="end"
            onClick={() => closePage()}
            className="closeIcon"
          >
            <IonIcon icon={closeIcon} slot="icon-only" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className={`ion-padding ${hideBg}`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList hidden={!!hideBg}>
            <div className="ion-padding-bottom" hidden={!!hideBg}>
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  HWB No
                </IonLabel>
                <IonInput
                  maxlength={15}
                  aria-invalid={errors && errors["hwbNo"] ? "true" : "false"}
                  aria-describedby={`${"hwbNo"}Error`}
                  {...register("hwbNo", {
                    required: "HWB No is required.",
                  })}
                  onIonChange={(event) => setValue("hwbNo", event.detail.value)}
                />
                <IonIcon onClick={startScan} className="ion-no-padding" style={{display:'flex', alignSelf:'end'}} icon={camera} slot="end"  />
              </IonItem>
              <Error errors={errors} name="hwbNo" />
            </div>
            {/* <div
              className="ion-padding-bottom ion-text-center"
              hidden={!!hideBg}
            >
              <IonText color="medium" className="ion-no-padding">
                OR
              </IonText>
            </div>
            <div className="ion-padding-bottom ion-text-center">
              <IonButton
                color="medium"
                className="start-scan-button"
                hidden={!!hideBg}
                onClick={startScan}
              >
                Scan HWB #
              </IonButton>
              
            </div> */}

            {!isNew && (
              <div className="ion-padding-bottom" hidden={!!hideBg}>
                <IonItem className="ion-no-padding" lines="none">
                  <IonLabel
                    color="medium"
                    className="form-input"
                    position="stacked"
                  >
                    <IonText> Number of Packages </IonText>
                    <IonNote slot="start" {...register("packageCount")}>
                      {watchPackageCount}
                    </IonNote>
                  </IonLabel>
                  <IonButtons
                    slot="end"
                    color="primary"
                    className="ion-no-padding ion-no-margin"
                    style={{ marginTop: "20px" }}
                  >
                    <IonIcon
                      icon={removeItem}
                      onClick={handleDecrementCount}
                      color="primary"
                      slot="icon-only"
                    />
                    <span> &nbsp; &nbsp; </span>
                    <IonIcon
                      icon={addItem}
                      onClick={handleIncrementCount}
                      color="primary"
                      slot="icon-only"
                    />
                  </IonButtons>
                </IonItem>
                <Error errors={errors} name="packageCount" />
              </div>
            )}

            {error && error.status === -1 && (
              <ServerError errorMsg={error.message} />
            )}
            <IonButton
              hidden={!!hideBg}
              type="submit"
              className="ion-margin-top"
              color="primary"
              expand="block"
            >
              {isNew ? "Save" : "Update"}
            </IonButton>
          </IonList>
        </form>
        <IonButton
          color="danger"
          className="stop-scan-button"
          hidden={!hideBg}
          onClick={stopScan}
        >
          {/* <IonIcon icon={stopCircleOutline} slot="start" /> */}
          Stop Scan
        </IonButton>
        <div hidden={!hideBg} className="scan-box" />
      </IonContent>
      <IonLoading
        isOpen={isloading}
        message="Please wait"
        showBackdrop={false}
        translucent={true}
      />
      {isItemSaved && (
        <ToastMsg
          showToast={isItemSaved}
          duration={5000}
          message={
            isNew
              ? "Package added successfully"
              : "Package updated successfully"
          }
          type={"green"}
        />
      )}
    </IonPage>
  );
};

export default AddEditDeliveryDropOff;
