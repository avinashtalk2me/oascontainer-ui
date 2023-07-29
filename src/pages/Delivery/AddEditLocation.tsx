import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonNote,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonTabButton,
  IonText,
  IonTextarea,
  IonToolbar,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Error from "../../components/Error";
import { close as closeIcon, timer, camera, } from "ionicons/icons";

import {
  insertLocation,
  getSelectedLocationById,
  updateLocation,
} from "../../store/actions";
import ServerError from "../../components/ServerError";
import { useEffect, useState } from "react";
import ToastMsg from "../../components/ToastMsg";
import { useHistory, useParams } from "react-router";
import { format, zonedTimeToUtc } from "date-fns-tz";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { Dialog } from "@capacitor/dialog";


export interface LocationProps {
  isNew: boolean;
  isEditAllowed: boolean;
}

const AddEditLocation: React.FC<LocationProps> = ({
  isNew,
  isEditAllowed
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { deliveryId, locationId }: any = useParams();
  const { isloading, isItemSaved, error, location } = useSelector(
    (state: any) => state.location
  );
  const [hideBg, setHideBg] = useState("");

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dateTime = (isNew: boolean, locationDate: string) => {

    let date;
    // Create a date object from a UTC date string
    if (isNew)
      date = new Date().toISOString();
    else
      date = new Date(locationDate).toISOString();
    // Use date-fns-tz to convert from UTC to a zoned time
    const zonedTime = zonedTimeToUtc(date, userTimeZone);

    // Create a formatted string from the zoned time
    return format(zonedTime, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: userTimeZone });
  }
  useEffect(() => {
    if (!isNew) {
      dispatch(getSelectedLocationById(deliveryId, locationId));
    }
  }, [isNew, dispatch]);

  useEffect(() => {
    if (isNew) {
      setValue("locationDesc", "");
      setValue("locationTime", dateTime(isNew, ""));
      setValue("displayLocationTime", (new Date(
        dateTime(isNew, "")).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })).toUpperCase());
      setValue("destinationCountry", "")
    }
  }, [isNew]);

  useEffect(() => {
    if (!isNew && location && location?.status === 0) {
      setValue("locationDesc", location.data.locationDesc);
      setValue("locationTime", dateTime(isNew, location.data.locationTime)
      );
      const value = new Date(location.data.locationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
      setValue("displayLocationTime", value);
      setValue("destinationCountry", location.data.destinationCountry)
    }
  }, [location, isNew]);

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

  const resetForm = () => {
    setValue("locationDesc", "");
    setValue("locationTime", "");
    setValue("displayLocationTime", "");
    setValue("destinationCountry", "");
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
    return () => { };
  }, []);

  useEffect(() => {
    if (isItemSaved) {
      let timer = setTimeout(() => {
        dispatch({ type: "RESET_FORM" });
        closePage();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isItemSaved]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (value) {
        clearErrors(name);
      } else {
        // setError(name)
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const closePage = () => {
    history.goBack();
  };

  const onSubmit = (data: any) => {
    if (!isEditAllowed) {
      closePage();
      return
    }
    if (isNew) {
      dispatch(insertLocation(deliveryId, data));
    } else {
      dispatch(updateLocation(locationId, data));
    }
  };

  const handleTimeChange = (e: any) => {
    if (!e.detail.value)
      return
    const time = new Date(e.detail.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
    setValue("locationTime", e.detail.value);
    setValue("displayLocationTime", time);
  };

  const getDropStatus = (dropStatus: number) => {
    return dropStatus === 0 ? "Open" : dropStatus === 1 ? "Package Scanned" : "Notification Sent"
  }

  const stopScan = () => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    setHideBg("");
  };

  const startScan = async () => {
    BarcodeScanner.hideBackground(); // make background of WebView transparent
    setHideBg("hideBg");
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    if (result.hasContent) {
      const arrResult: string[] = result.content?.split('_') || [];
      if (arrResult.length === 2) {
        setValue("locationDesc", arrResult[0]);
        setValue("destinationCountry", arrResult[1]);
        stopScan();
      } else {
        Dialog.alert({
          title: "Invalid Location",
          message: `This is not a valid location. Please try another one.`,
        });
        if (navigator.vibrate) {
          // vibration API supported
          navigator.vibrate(1000);
          // stopScan();
          startScan();
        }
      }
    }

  }
  return (
    <>
      <IonHeader translucent>
        <IonToolbar>
          {isEditAllowed && <IonText className={`modalheader-menu  ${!!hideBg && 'text-indent'}`}>
            {isNew ? "Add Location" : "Edit Location"}
          </IonText>}
          {!isEditAllowed && <IonText className={`modalheader-menu  ${!!hideBg && 'text-indent'}`}>
            View Location
          </IonText>}
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
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Location
                </IonLabel>
                <IonTextarea
                  disabled={!isEditAllowed}
                  rows={3}
                  maxlength={40}
                  aria-invalid={errors && errors["locationDesc"] ? "true" : "false"}
                  aria-describedby={`${"locationDesc"}Error`}
                  {...register("locationDesc")}
                  onIonChange={(e: any) => setValue("locationDesc", e.detail.value)}
                />
                <IonIcon onClick={startScan} className="ion-no-padding" style={{ display: 'flex', alignSelf: 'end' }} icon={camera} slot="end" />
              </IonItem>
              <Error errors={errors} name="locationDesc" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Time
                </IonLabel>
                <IonInput
                  disabled={!isEditAllowed}
                  readonly
                  aria-invalid={
                    errors && errors["displayLocationTime"] ? "true" : "false"
                  }
                  aria-describedby={`${"displayLocationTime"}Error`}
                  {...register("displayLocationTime", {
                    required: "Time is required.",
                  })}
                />
                {isEditAllowed && <>
                  <IonButton
                    slot="end"
                    fill="clear"
                    className="calendar-btn"
                    id="open-date-input-2"
                  >
                    <IonIcon icon={timer} />
                  </IonButton>
                  <IonPopover trigger="open-date-input-2" showBackdrop={false}>
                    <IonDatetime
                      presentation="time"
                      hourCycle="h12"
                      showDefaultButtons={true}
                      {...register("locationTime")}
                      onIonChange={handleTimeChange}
                    />
                  </IonPopover>
                  {/* <IonDatetimeButton datetime="datetime"></IonDatetimeButton> */}
                  {/*  */}
                  <IonModal keepContentsMounted={true}>
                    <IonDatetime id="datetime"></IonDatetime>
                  </IonModal>
                </>}
              </IonItem>
              <Error errors={errors} name="displayLocationTime" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Destination Country
                </IonLabel>
                <IonInput
                  disabled={!isEditAllowed}
                  aria-invalid={
                    errors && errors["destinationCountry"] ? "true" : "false"
                  }
                  aria-describedby={`${"destinationCountry"}Error`}
                  {...register("destinationCountry", {
                    required: "Destination Country is required.",
                  })}
                  onIonChange={(e: any) => setValue("destinationCountry", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="destinationCountry" />
            </div>
            {!isNew && location && (
              <>
                <div className="ion-padding-bottom">
                  <IonItem className="ion-no-padding" lines="none">
                    <IonLabel
                      color="medium"
                      className="ion-no-margin"
                      position="stacked"
                    >
                      <IonText> Drop Status: </IonText>
                      <IonNote slot="start">{getDropStatus(location?.data?.dropStatus)}</IonNote>
                    </IonLabel>
                  </IonItem>
                  <IonItem className="ion-no-padding" lines="none">
                    <IonLabel
                      color="medium"
                      className="ion-no-margin"
                      position="stacked"
                    >
                      <IonText>Total Package Scanned: </IonText>
                      <IonNote slot="start">{location?.data?.packageCount}</IonNote>
                    </IonLabel>
                  </IonItem>
                </div>
              </>
            )}

            {error && error.status === -1 && (
              <ServerError errorMsg={error.message} />
            )}
            {isEditAllowed && <IonButton
              hidden={!!hideBg}
              type="submit"
              className="ion-margin-top"
              color="primary"
              expand="block"
            >
              {isNew ? "Save" : "Update"}
            </IonButton>
            }
            {!isEditAllowed && <IonButton
              type="submit"
              className="ion-margin-top"
              color="primary"
              expand="block"
            >
              RETURN
            </IonButton>}
          </IonList>
        </form>
        <IonButton
          color="danger"
          className="stop-scan-button location"
          hidden={!hideBg}
          onClick={stopScan}
        >
          {/* <IonIcon icon={stopCircleOutline} slot="start" /> */}
          Stop Scan
        </IonButton>
        <div hidden={!hideBg} className="scan-box location" />
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
            isNew ? "Location added successfully" : "Location updated successfully"
          }
          type={"green"}
        />
      )}
    </>
  );
};

export default AddEditLocation;
