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
  IonAccordionGroup
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
  insertPackage,
  // getSelectedPackageById,
  updatePackage,
  getSelectedPackagePkgNo,
  getSelectedHWBInfo
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

interface AddEditPackageProps {
  isNew: boolean;
  isEditAllowed: boolean;
}

const AddEditPackage: React.FC<AddEditPackageProps> = ({ isNew, isEditAllowed }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { palletId, packageId, hwbNo }: any = useParams();
  const [hideBg, setHideBg] = useState("");
  const [scanResult, setScanResult] = useState<string[]>([]);
  const [isHWBScanned, setIsHWBScanned] = useState<boolean>();
  const [isScanSuccess, setIsScanSuccess] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [packageToastMsg, setPackageToastMsg] = useState<string>('');


  const { isloading, isItemSaved, error,    //packageData, 
    isValidPackagePkgNo, selectedHwbInfo } = useSelector(
      (state: any) => state.package
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
      // setValue("packageCount", "0");
      // dispatch(getSelectedPackageById(palletId, packageId));
    }

    if (isNew) {
      setIsHWBScanned(true)
    }
  }, [isNew]);

  // useEffect(() => {
  //   if (!isNew && packageData && packageData?.status === 0) {
  //     setValue("hwbNo", packageData.data.hwbNo);
  //     setValue("packageCount", packageData.data.packageCount);
  //   }
  // }, [packageData, isNew]);


  useEffect(() => {
    if (!isHWBScanned) {
      if (selectedHwbInfo?.isExistingHwb === true) {
        if (isNew)
          Dialog.alert({
            title: "Found HWB!!",
            message: `The HWB# ${watchHwbNo} is already found in our system. Other details will be loaded in the form.`,
          });
        setValue("totalPkgs", selectedHwbInfo.hwbInfo.totalPackages);
        setValue("pkgNo", selectedHwbInfo.hwbInfo.pkgNos?.split(",")
          .sort((item: string, nextItem: string) => +item - +nextItem).join(","));
        setValue("shipperName", selectedHwbInfo.hwbInfo.shipperName);
        setValue("shipperContactName", selectedHwbInfo.hwbInfo.shipperContactName);
        setValue("shipperEmail", selectedHwbInfo.hwbInfo.shipperEmail);
        setValue("shipperPhone", selectedHwbInfo.hwbInfo.shipperPhone);
      } else {
        // setValue("hwbNo", "");
        setValue("totalPkgs", "");
        setValue("pkgNo", "");
        setValue("shipperName", "");
        setValue("shipperContactName", "");
        setValue("shipperEmail", "");
        setValue("shipperPhone", "");
      }
    }

  }, [selectedHwbInfo])

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
  const watchNewPackageNo = watch("newPackageNo");
  const watchPkgNo = watch("pkgNo")

  const resetForm = () => {
    setValue("hwbNo", "");
    setValue("totalPkgs", "");
    setValue("pkgNo", "");
    setValue("shipperName", "");
    setValue("shipperContactName", "");
    setValue("shipperEmail", "");
    setValue("shipperPhone", "");
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
    let newDataObj = data;
    // if (!isHWBScanned && selectedHwbInfo.isExistingHwb) {

    // }
    if(!isEditAllowed) {
      closePage();
      return;
    }
    if (isNew) {
      dispatch(insertPackage(palletId, newDataObj));
    } else {
      dispatch(updatePackage(packageId, newDataObj));
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

  useEffect(() => {
    if (isValidPackagePkgNo === true && isHWBScanned) {
      setValue("hwbNo", scanResult[0]);
      setValue("totalPkgs", scanResult[1]);
      setValue("pkgNo", scanResult[2]);
      setValue("shipperName", scanResult[3]);
      setValue("shipperContactName", scanResult[4]);
      setValue("shipperEmail", scanResult[5]);
      setValue("shipperPhone", scanResult[6]);
      setValue("isQR", true);
      setIsScanSuccess(true);
      stopScan();
    } else if (isValidPackagePkgNo === false && isHWBScanned) {
      Dialog.alert({
        title: "Duplicate Package",
        message: `The Pkg# ${scanResult[2]} of HWB# ${scanResult[0]} has already been scanned. Please scan a new package.`,
      });

      if (navigator.vibrate) {
        // vibration API supported
        navigator.vibrate(1000);
        stopScan();
        // startScan();
      }
    }
  }, [setValue, isValidPackagePkgNo, scanResult, isHWBScanned])

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
      if (arrResult?.length === 7) {
        const data = {
          "hwbNo": arrResult[0],
          "pkgNo": arrResult[2]
        };
        dispatch(getSelectedPackagePkgNo(palletId, data))
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
      dispatch(getSelectedHWBInfo(event.target.value, palletId))
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


  const handleAddNewPackageNo = () => {
    const pkgList = watchPkgNo;
    if (pkgList) {
      let pkgArr: string[] = pkgList.split(",");
      const isUnique = pkgArr.some(item => item === watchNewPackageNo);
      if (!isUnique) {
        pkgArr.unshift(watchNewPackageNo);
        setValue("pkgNo", pkgArr.sort((item: string, nextItem: string) => +item - +nextItem).join(","));
        setValue("newPackageNo", "");
      } else {
        setPackageToastMsg(`${watchNewPackageNo} is already available in the list. Please add new one.`)
      }
    } else {
      setValue("pkgNo", watchNewPackageNo);
      setValue("newPackageNo", "");
    }
  }

  const handleAddPackageNoChange = (event: any) => {
    setValue("newPackageNo", event.detail.value);
    setPackageToastMsg("")
  }

  const handleRemovePackageNo = (itemToRemove: string) => {
    const pkgList = watchPkgNo;
    let pkgArr: string[] = pkgList.split(",");
    if (pkgArr.length === 1) {
      setValue("pkgNo", "");
    } else {
      pkgArr = pkgArr.filter(item => item !== itemToRemove);
      setValue("pkgNo", pkgArr.join(","));
    }
  }

  const packageList = (
    <>
      {/* <IonItem class="ion-no-padding"> */}
        <IonText class="packagelist-header">List of added Package No.(s)</IonText>
      {/* </IonItem> */}
      <IonList lines="none" class="ion-no-padding packageitem-list" >
        {!isHWBScanned && watchPkgNo ? (watchPkgNo &&
          watchPkgNo?.split(",")
            .sort((item: string, nextItem: string) => +item - +nextItem)
            .map((item: string, index: number) => (
              <IonItem key={index} className="ion-no-padding package-item"
                button={true} detail={false} onClick={() => handleRemovePackageNo(item)}>
                <div>
                  <IonNote>{item.trim()}</IonNote>
                </div>
              </IonItem>
            ))) : <NoItemFound />}

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
            readonly={(!watchHwbNo || isHWBScanned || (selectedHwbInfo?.isExistingHwb && isNew)) && true}
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
            Shipper Contact Name
          </IonLabel>
          <IonInput
            maxlength={50}
            disabled={!isEditAllowed}
            readonly={(!watchHwbNo || isHWBScanned || (selectedHwbInfo?.isExistingHwb && isNew)) && true}
            aria-invalid={errors && errors["shipperContactName"] ? "true" : "false"}
            aria-describedby={`${"shipperContactName"}Error`}
            {...register("shipperContactName")}
            onIonChange={(event) => setValue("shipperContactName", event.detail.value)}
          />
        </IonItem>
        <Error errors={errors} name="shipperContactName" />
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
            readonly={(!watchHwbNo || isHWBScanned || (selectedHwbInfo?.isExistingHwb && isNew)) && true}
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
      <div className="ion-padding-bottom">
        <IonItem className="ion-no-padding">
          <IonLabel
            color="medium"
            className="form-input"
            position="stacked"
          >
            Shipper Phone
          </IonLabel>
          <IonInput
            type="tel"
            maxlength={50}
            disabled={!isEditAllowed}
            readonly={(!watchHwbNo || isHWBScanned || (selectedHwbInfo?.isExistingHwb && isNew)) && true}
            aria-invalid={errors && errors["shipperPhone"] ? "true" : "false"}
            aria-describedby={`${"shipperPhone"}Error`}
            {...register("shipperPhone")}
            onIonChange={(event) => setValue("shipperPhone", event.detail.value)}
          />
        </IonItem>
        <Error errors={errors} name="shipperPhone" />
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
            {isNew ? "Add Package" : "Edit Package"}
          </IonText>}
          {!isEditAllowed && <IonText className={`modalheader-menu  ${!!hideBg && 'text-indent'}`}>
            View Package
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
                  onIonInput={(e: any) => setValue("hwbNo", e.target.value.toUpperCase())}
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
                      readonly={(isHWBScanned || selectedHwbInfo?.isExistingHwb) && true}
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
                    readonly={(isHWBScanned || (selectedHwbInfo?.isExistingHwb && isNew)) && true}
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

            {/* {!isNew && (
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
            )} */}

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
                ? "Package added successfully"
                : "Package updated successfully"
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
              Add Package No
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
            <IonItem className="ion-no-padding" lines="none">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Enter Package No.
                </IonLabel>
                <IonInput
                  type="number"
                  maxlength={4}
                  aria-invalid={errors && errors["newPackageNo"] ? "true" : "false"}
                  aria-describedby={`${"newPackageNo"}Error`}
                  {...register("newPackageNo")}
                  onIonChange={handleAddPackageNoChange}
                />
              </IonItem>
              <IonButton
                slot="end"
                type="submit"
                className="ion-margin-top modal-addBtn"
                color="primary"
                // expand="block"
                disabled={!watchNewPackageNo}
                onClick={handleAddNewPackageNo}
              >
                Add
              </IonButton>
            </IonItem>
            <IonText color="danger" className="ion-no-padding">
              <small>
                <span role="alert">
                  {packageToastMsg}
                </span>
              </small>
            </IonText>
            {!isHWBScanned && packageList}
          </div>
        </IonContent>
      </IonModal>
    </IonPage >
  );
};

export default AddEditPackage;
