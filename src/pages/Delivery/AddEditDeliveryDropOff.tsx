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
  IonTextarea,
  IonToggle,
  IonToolbar,
  IonModal,
  createAnimation,
  IonTitle,
  IonAccordion,
  IonAccordionGroup,
  IonCheckbox
} from "@ionic/react";
import {
  close as closeIcon,
  removeCircle as removeItem,
  addCircle as addItem,
  camera,
} from "ionicons/icons";
import { useCallback, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Error from "../../components/Error";
import {
  insertDropOff,
  updateDropOff,
  getSelectedHWBInfoForDropoff,
  getSelectedScanedHWBInfoForDropoff
} from "../../store/actions";
import ServerError from "../../components/ServerError";
import ToastMsg from "../../components/ToastMsg";
import CameraScannerButton from "../../components/CameraScannerButton";
import { useHistory, useParams } from "react-router";
import SessionExpired from "../../components/SessionExpired";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import "../../camera-scanner.css";
import { Dialog } from "@capacitor/dialog";
import debounce from "lodash.debounce";
import NoItemFound from "../../components/NoItemFound";

interface AddEditDropOffProps {
  isNew: boolean;
  isEditAllowed: boolean;
}

const AddEditDeliveryDropOff: React.FC<AddEditDropOffProps> = ({ isNew, isEditAllowed }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { locationId, deliveryId, packageId, hwbNo }: any = useParams();
  const [hideBg, setHideBg] = useState("");
  const [scanResult, setScanResult] = useState<string[]>([]);
  const [isHWBScanned, setIsHWBScanned] = useState<boolean>();
  const [isScanSuccess, setIsScanSuccess] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isCheckSelected, setIsCheckSelected] = useState<boolean>(false);


  const { isloading, isItemSaved, error,    //packageData, 
    isValidPackagePkgNo, selectedHwbInfoForDropoff } = useSelector(
      (state: any) => state.dropOff
    );

  const modal = useRef<HTMLIonModalElement>(null);

  const enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = createAnimation()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimation = (baseEl: HTMLElement) => {
    return enterAnimation(baseEl).direction('reverse');
  };


  useEffect(() => {
    if (!isNew) {
      setValue("hwbNo", hwbNo);
    }

    if (isNew) {
      setIsHWBScanned(true)
    }
  }, [isNew]);


  useEffect(() => {
    if (selectedHwbInfoForDropoff) {
      if (selectedHwbInfoForDropoff?.isValidHwb === true) {
        setValue("totalPkgs", selectedHwbInfoForDropoff.hwbInfo.totalPackages);
        if (!isNew)
          setValue("pkgNo", selectedHwbInfoForDropoff.hwbInfo.currentDropPkgOffNos?.split(",")
            .sort((item: string, nextItem: string) => +item - +nextItem).join(","));
        setValue("shipperName", selectedHwbInfoForDropoff.hwbInfo.shipperName);
        setValue("shipperEmail", selectedHwbInfoForDropoff.hwbInfo.shipperEmail);
        if (isHWBScanned) {
          setIsScanSuccess(true)
        }
      } else {
        // setValue("hwbNo", "");
        if (isHWBScanned) {
          setIsScanSuccess(true)
          setValue("pkgNo", "");
        }
        Dialog.alert({
          title: "Invalid HWB!!",
          message: `The HWB# ${watchHwbNo} is not available in our system. Please try another one.`,
        });
        setValue("totalPkgs", "");
        setValue("pkgNo", "");
        setValue("hwbNo", "");
        setValue("shipperName", "");
        setValue("shipperEmail", "");
      }
    }

  }, [isNew, selectedHwbInfoForDropoff, isHWBScanned])

  useEffect(() => {
    if (isHWBScanned && scanResult.length > 0 && isValidPackagePkgNo) {
      if (isValidPackagePkgNo.isValidPackage === 'SUCCESS') {
        setValue("hwbNo", scanResult[0]);
        setValue("pkgNo", scanResult[2]);
        dispatch(getSelectedHWBInfoForDropoff(locationId, scanResult[0]))
      } else if (isValidPackagePkgNo.isValidPackage === "DUPLICATE") {
        Dialog.alert({
          title: "Duplicate Package",
          message: `The Pkg# ${scanResult[2]} of HWB# ${scanResult[0]} has already been scanned. Please scan a new package.`,
        });
      } else if (isValidPackagePkgNo.isValidPackage === "INVALID") {
        Dialog.alert({
          title: "Invalid HWB!!",
          message: `The HWB# ${scanResult[0]} is not available in our system. Please try another one.`,
        });
      }

      stopScan();

    }
  }, [isValidPackagePkgNo, isHWBScanned, scanResult])

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

  // const watchPackageCount = watch("packageCount");
  const watchHwbNo = watch("hwbNo");
  // const watchNewPackageNo = watch("newPackageNo");
  const watchPkgNo = watch("pkgNo")

  const resetForm = () => {
    setValue("hwbNo", "");
    setValue("totalPkgs", "");
    setValue("pkgNo", "");
    setValue("shipperName", "");
    setValue("shipperEmail", "");
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

  useEffect(() => {
    dispatch({ type: "RESET_PKG_SCAN" })
  }, [dispatch])

  const onSubmit = (data: any) => {
    data['hwbNo'] = data['hwbNo'].toUpperCase()
    let newDataObj = data; 
    if (!isEditAllowed) {
      closePage();
      return;
    }
    if (isNew) {
      dispatch(insertDropOff(locationId, deliveryId, newDataObj));
    } else {
      dispatch(updateDropOff(packageId, newDataObj));
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


  const closePage = () => {
    dispatch({ type: "RESET_FORM" });
    history.goBack();
  };

  const startScan = async () => {
    dispatch({ type: "RESET_PKG_SCAN" })
    BarcodeScanner.hideBackground(); // make background of WebView transparent
    setHideBg("hideBg");
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    if (result.hasContent) {
      const arrResult: string[] = result.content?.split('_') || [];
      setScanResult(arrResult);
      if (arrResult?.filter(item => item !== "").length <= 7) {
        const data = {
          "hwbNo": arrResult[0],
          "pkgNo": arrResult[2]
        };
        dispatch(getSelectedScanedHWBInfoForDropoff(locationId, data))
      } else {
        Dialog.alert({
          title: "Invalid Package",
          message: `This is not a valid HWB. Please try another one.`,
        });
        stopScan();
      }
    };
  }

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

  const stopScan = () => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    setHideBg("");
  };

  const handleToggleChange = (event: any) => {
    resetForm();
    setIsScanSuccess(false)
    dispatch({ type: "RESET_PKG_SCAN" })
    setIsHWBScanned(!isHWBScanned);
  }


  const handleHwbOnChange = (event: any) => {
    // if (watchHwbNo !== selectedHwbInfo?.hwbInfo?.hwbNo && !isHWBScanned) {
    if (event.target.value.trim().length > 2 && !isHWBScanned) {
      dispatch({ type: "RESET_PKG_SCAN" })
      dispatch(getSelectedHWBInfoForDropoff(locationId, event.target.value.toUpperCase()))
    }
    // }
  }

  const debouncedChangeHandler = useCallback(
    debounce(handleHwbOnChange, 1000)
    , []);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    }
  }, []);

  const dismiss = () => {
    modal.current?.dismiss();
  }

  const handleModalDismiss = () => {
    return new Promise<boolean>((resolve, reject) => {
      resolve(true);
      setIsModal(false)
    });
  }

  const handleOpenAddPackageNoModal = () => {
    if (watchHwbNo && isEditAllowed) {
      setIsModal(true);
      setValue("newPackageNo", "")
    }
  }

  const handleAddRemoveItem = (selectedItem: string) => {
    const pkgList = watchPkgNo;
    let pkgArr: string[] = [];

    if (isCheckSelected) {
      setIsCheckSelected(false)
    }
    if (pkgList) {
      pkgArr = pkgList.split(",")
      const itemExists = pkgArr.some(item => item === selectedItem.trim());
      if (itemExists) {
        pkgArr = pkgArr.filter(item => item !== selectedItem.trim());
      } else {
        pkgArr.push(selectedItem.trim())
      }

    } else {
      pkgArr.push(selectedItem.trim())
    }
    setValue("pkgNo", pkgArr.sort((item: string, nextItem: string) => +item - +nextItem).join(","));
  }

  const isPreSelected = (itemToCheck: string) => {
    const pkgList = watchPkgNo;
    if (pkgList) {
      return pkgList.split(",").some((item: string) => item === itemToCheck.trim());
    }
    return null
  }

  const itemIterator = () => {
    let filterDropOffs = selectedHwbInfoForDropoff.hwbInfo.dropoffPkgs ? selectedHwbInfoForDropoff.hwbInfo.availablePkgs.split(",").filter((item: string) => { return selectedHwbInfoForDropoff.hwbInfo.dropoffPkgs.split(",").indexOf(item.trim()) === -1 }) : selectedHwbInfoForDropoff.hwbInfo.availablePkgs.split(",");

    if (selectedHwbInfoForDropoff.hwbInfo.currentDropPkgOffNos && !isNew) {
      filterDropOffs = selectedHwbInfoForDropoff.hwbInfo.dropoffPkgs.split(",").filter((item: string) => { return selectedHwbInfoForDropoff.hwbInfo.currentDropPkgOffNos.split(",").indexOf(item) === -1 })

      filterDropOffs = selectedHwbInfoForDropoff.hwbInfo.availablePkgs.split(",").filter((item: string) => { return filterDropOffs.indexOf(item.trim()) === -1 })
    }
    return filterDropOffs;
  }

  const handlePackageSelected = (e: any) => {
    let pkgArr: string[] = [];

    if (e.target.checked) {
      const pkgList = itemIterator();
      pkgList.forEach((element: string) => {
        pkgArr.push(element)
      });
    } else {
      pkgArr = [];
    }
    setIsCheckSelected(e.target.checked)
    setValue("pkgNo", pkgArr.sort((item: string, nextItem: string) => +item - +nextItem).join(","));
  }

  const availablePackageList = (
    <>
      {/* <IonItem class="ion-no-padding"> */}
      <IonText class="packagelist-header">List of available Package No.(s)
      </IonText>
      <IonItem lines="none" className="ion-no-padding">
        <IonCheckbox slot="start" checked={isCheckSelected} onClick={handlePackageSelected}></IonCheckbox>
        <IonLabel>Select All Packages?</IonLabel>
      </IonItem>
      <IonList lines="none" class="ion-no-padding packageitem-list" >
        {selectedHwbInfoForDropoff && selectedHwbInfoForDropoff.hwbInfo ?
          itemIterator()
            .sort((item: string, nextItem: string) => +item - +nextItem)
            .map((item: string, index: number) => (
              <IonItem key={index} className={`ion-no-padding package-item ${isPreSelected(item) && "isSelectedForDropOff"}`}
                button={true} detail={false} onClick={() => handleAddRemoveItem(item)}>
                <div>
                  <IonNote>{item.trim()}</IonNote>
                </div>
              </IonItem>
            )) : <NoItemFound />}

      </IonList>
    </>
  )


  const shipperInfo = (
    <>
      <div className="ion-padding-bottom">
        <IonItem className="ion-no-padding">
          <IonLabel
            color="medium"
            className="form-input"
            position="stacked"
          >
            Shipper Name
          </IonLabel>
          <IonInput
            maxlength={15}
            disabled={!isEditAllowed}
            readonly={true}
            aria-invalid={errors && errors["shipperName"] ? "true" : "false"}
            aria-describedby={`${"shipperName"}Error`}
            {...register("shipperName")}
            onIonChange={(event) => setValue("shipperName", event.detail.value)}
          />
        </IonItem>
        <Error errors={errors} name="shipperName" />
      </div>
      <div className="ion-padding-bottom">
        <IonItem className="ion-no-padding">
          <IonLabel
            color="medium"
            className="form-input"
            position="stacked"
          >
            Shipper Email
          </IonLabel>
          <IonInput
            maxlength={50}
            disabled={!isEditAllowed}
            readonly={true}
            aria-invalid={errors && errors["shipperEmail"] ? "true" : "false"}
            aria-describedby={`${"shipperEmail"}Error`}
            {...register("shipperEmail", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address.",
              },
            })}
            onIonChange={(event) => setValue("shipperEmail", event.detail.value?.trim())}
          />
        </IonItem>
        <Error errors={errors} name="shipperEmail" />
      </div>
    </>
  )

  const hwbAccordion = (
    <IonAccordionGroup>
      <IonAccordion value="first">
        <IonItem slot="header" className="ion-no-padding accordion" lines="none">
          <IonLabel color='primary' className="hyperlink">Additional Details</IonLabel>
        </IonItem>
        <div className="ion-no-padding" slot="content">
          {shipperInfo}
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {isEditAllowed && <IonText className={`modalheader-menu  ${!!hideBg && 'text-indent'}`}>
            {isNew ? "Add Dropoff Package" : "Edit Dropoff Package"}
          </IonText>}
          {!isEditAllowed && <IonText className={`modalheader-menu  ${!!hideBg && 'text-indent'}`}>
            View Dropoff Package
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
            {isNew && <div className="ion-padding-bottom">
              <IonItem lines="none" className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked">
                  Scan HWB Number
                </IonLabel>
                <IonToggle color="primary" checked={isHWBScanned}
                  onIonChange={(event) => handleToggleChange(event)} slot="end" />
              </IonItem>
            </div>}
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  HWB Number
                </IonLabel>
                <IonInput
                  maxlength={50}
                  className="toUpperCase"
                  disabled={!isEditAllowed}
                  readonly={(isHWBScanned || !isNew) ? true : false}
                  aria-invalid={errors && errors["hwbNo"] ? "true" : "false"}
                  aria-describedby={`${"hwbNo"}Error`}
                  {...register("hwbNo", {
                    required: "HWB No is required.",
                    minLength: {
                      value: 3,
                      message: "Minimun 3 characters is required."
                    }
                  })}
                  onIonInput={(e: any) => setValue("hwbNo", e.target.value)}
                  onIonChange={debouncedChangeHandler}
                />
                {isEditAllowed && <>
                  {isHWBScanned && isNew && <IonIcon onClick={startScan} className="ion-no-padding" style={{ display: 'flex', alignSelf: 'end' }} icon={camera} slot="end" />}
                </>
                }
              </IonItem>
              <Error errors={errors} name="hwbNo" />
            </div>
            {((isHWBScanned && isScanSuccess) || (!isHWBScanned)) && <>
              <div className="ion-padding-bottom">
                <IonItem className="ion-no-padding">
                  <IonLabel
                    color="medium"
                    className="form-input"
                    position="stacked"
                  >
                    Package No(s)
                  </IonLabel>
                  {!isHWBScanned &&
                    <IonTextarea
                      rows={2}
                      id="open-custom-dialog"
                      // maxlength={15}
                      readonly={true}
                      disabled={!isEditAllowed}
                      aria-invalid={errors && errors["pkgNo"] ? "true" : "false"}
                      aria-describedby={`${"pkgNo"}Error`}
                      {...register("pkgNo", {
                        required: "Package No(s) is required.",
                      })}
                      onClick={handleOpenAddPackageNoModal}
                      onIonChange={(event) => setValue("pkgNo", event.detail.value)}
                    />}
                  {isNew && isHWBScanned &&
                    <IonInput
                      type="number"
                      maxlength={15}
                      disabled={!isEditAllowed}
                      readonly={(isHWBScanned || selectedHwbInfoForDropoff?.isValidHwb) && true}
                      aria-invalid={errors && errors["pkgNo"] ? "true" : "false"}
                      aria-describedby={`${"pkgNo"}Error`}
                      {...register("pkgNo", {
                        required: "Package No(s) is required.",
                      })}
                      onIonChange={(event) => setValue("pkgNo", event.detail.value)}
                    />}
                </IonItem>
                {!isHWBScanned
                  &&
                  <>
                    <IonText className="infotext">Mulitple Package No(s) will be displayed separated by commas.
                    </IonText>
                    <br />
                  </>
                }
                <Error errors={errors} name="pkgNo" />
              </div>
              <div className="ion-padding-bottom">
                <IonItem className="ion-no-padding">
                  <IonLabel
                    color="medium"
                    className="form-input"
                    position="stacked"
                  >
                    Total HWB Packages
                  </IonLabel>
                  <IonInput
                    type="number"
                    maxlength={15}
                    disabled={!isEditAllowed}
                    readonly={true}
                    aria-invalid={errors && errors["totalPkgs"] ? "true" : "false"}
                    aria-describedby={`${"totalPkgs"}Error`}
                    {...register("totalPkgs", {
                      required: "Total HWB Packages is required.",
                    })}
                    onIonChange={(event) => setValue("totalPkgs", event.detail.value)}
                  />
                </IonItem>
                <Error errors={errors} name="totalPkgs" />
              </div>
              {/* {isHWBScanned ? : { shipperInfo }} */}
              {hwbAccordion}
            </>}

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
      {
        isItemSaved && (
          <ToastMsg
            showToast={isItemSaved}
            duration={5000}
            message={
              isNew
                ? "Dropoff Package added successfully"
                : "Dropoff Package updated successfully"
            }
            type={"green"}
          />
        )
      }
      <IonModal id="itemlist-modal" isOpen={isModal}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation} canDismiss={handleModalDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonText className="modalheader-menu">
              Package for Dropoff
            </IonText>
            <IonButtons
              slot="end"
              onClick={() => setIsModal(false)}
              className="closeIcon"
            >
              <IonIcon icon={closeIcon} slot="icon-only" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className={`ion-padding`}>
          <div className="ion-padding-bottom">
            {availablePackageList}
          </div>
        </IonContent>
      </IonModal>
    </IonPage >
  );
};

export default AddEditDeliveryDropOff;
