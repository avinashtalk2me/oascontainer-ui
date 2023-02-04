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
  IonNote,
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
import { close as closeIcon } from "ionicons/icons";

import {
  getNextPalletNo,
  insertPallet,
  getSelectedPalletById,
  updatePallet,
} from "../../store/actions";
import ServerError from "../../components/ServerError";
import { useEffect, useState } from "react";
import ToastMsg from "../../components/ToastMsg";
import { useHistory, useParams } from "react-router";

export interface PalletProps {
  isNew: boolean;
  isEditAllowed: boolean;
  // selectedSailId: string;
  // selectedPalletId: string;
  // onDismiss: () => void;
  // setIsTransComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEditPallet: React.FC<PalletProps> = ({
  isNew,
  isEditAllowed
  // onDismiss,
  // setIsTransComplete,
  // selectedSailId,
  // selectedPalletId,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { sailId, palletId }: any = useParams();
  const [palletType, setPalletType] = useState("");
  const [palletWeightType, setPalletWeightType] = useState("");

  const { isloading, isItemSaved, error, pallet, nextPalletNo } = useSelector(
    (state: any) => state.pallet
  );

  const [showHidePalletDesc, setShowHidePalletDesc] = useState(false);

  useEffect(() => {
    if (!isNew) {
      dispatch(getSelectedPalletById(sailId, palletId));
    }
  }, [isNew, dispatch]);

  useEffect(() => {
    if (isNew) {
      dispatch(getNextPalletNo(sailId));
    }
  }, [isNew, dispatch]);

  useEffect(() => {
    if (isNew && nextPalletNo) {
      setPalletType("Pallet");
      setPalletWeightType(nextPalletNo?.data?.sailUnit);
      setValue("palletNo", nextPalletNo?.data?.nextPallet);
      setValue("palletType", "Pallet");
      setValue("palletWeight", "");
      setValue("palletWeightUnit", nextPalletNo?.data?.sailUnit);
    }
  }, [isNew, nextPalletNo]);

  useEffect(() => {
    if (!isNew && pallet && pallet?.status === 0) {
      setPalletType(pallet.data.palletType);
      setPalletWeightType(pallet.data.palletWeightUnit.trim());
      setValue("palletNo", pallet.data.palletNo);
      setValue("palletType", pallet.data.palletType);
      setValue("palletDesc", pallet.data.palletDesc);
      setValue("palletWeight", pallet.data.palletWeight);
      setValue("palletWeightUnit", pallet.data.palletWeightUnit.trim());
    }
  }, [pallet, isNew]);

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
    setValue("palletNo", "");
    setValue("palletType", "");

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
    const palletType = watch("palletType");
    if (palletType === "Loose") {
      setShowHidePalletDesc(true);
    }
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

  const handleShowHideDesc = (e: any) => {
    setValue("palletDesc", "");
    if (e.detail.value === "Loose") {
      setShowHidePalletDesc(true);
    } else {
      setShowHidePalletDesc(false);
    }
  };
  const onSubmit = (data: any) => {
    if (!isEditAllowed) {
      closePage();
      return
    }
    if (isNew) {
      dispatch(insertPallet(sailId, data));
    } else {
      dispatch(updatePallet(palletId, data));
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          {isEditAllowed && <IonText className="modalheader-menu">
            {isNew ? "Add Pallet" : "Edit Pallet"}
          </IonText>}
          {!isEditAllowed && <IonText className="modalheader-menu">
            View Pallet
          </IonText>}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Number
                </IonLabel>
                <IonInput
                  readonly
                  disabled={!isEditAllowed}
                  aria-invalid={errors && errors["palletNo"] ? "true" : "false"}
                  aria-describedby={`${"palletNo"}Error`}
                  {...register("palletNo")}
                />
              </IonItem>
              <Error errors={errors} name="palletNo" />
            </div>
            {palletType && <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Type
                </IonLabel>
                <IonSelect
                  disabled={!isEditAllowed}
                  interface="popover"
                  {...register("palletType")}
                  onIonChange={handleShowHideDesc}
                >
                  <IonSelectOption value="Pallet">Pallet</IonSelectOption>
                  <IonSelectOption value="Loose">Loose</IonSelectOption>
                </IonSelect>
              </IonItem>
              <Error errors={errors} name="palletType" />
            </div>}
            {showHidePalletDesc && (
              <div className="ion-padding-bottom">
                <IonItem className="ion-no-padding">
                  <IonLabel
                    color="medium"
                    className="form-input"
                    position="stacked"
                  >
                    Description
                  </IonLabel>
                  <IonTextarea
                    rows={3}
                    disabled={!isEditAllowed}
                    aria-invalid={
                      errors && errors["palletDesc"] ? "true" : "false"
                    }
                    aria-describedby={`${"palletDesc"}Error`}
                    {...register("palletDesc", {
                      required: "Description is required.",
                    })}
                  />
                </IonItem>
                <Error errors={errors} name="palletDesc" />
              </div>
            )}
            <div className="ion-padding-bottom">
              <div className="weight-container">
                <IonItem className="ion-no-padding pallet-weight">
                  <IonLabel
                    color="medium"
                    className="form-input"
                    position="stacked"
                  >
                    Weight
                  </IonLabel>
                  <IonInput
                    type="number"
                    disabled={!isEditAllowed}
                    aria-invalid={
                      errors && errors["palletWeight"] ? "true" : "false"
                    }
                    aria-describedby={`${"palletWeight"}Error`}
                    onIonChange={(e: any) =>
                      setValue("palletWeight", e.detail.value)
                    }
                    {...register("palletWeight", {
                      required: "Weight is required.",
                      pattern: {
                        value: /^(?:\d*\.\d{1,2}|\d+)$/,
                        message: "Invalid weight.",
                      },
                    })}
                  />
                </IonItem>
                {palletWeightType && <IonItem className="ion-no-padding pallet-weight-unit">
                  <IonText slot="end">{palletWeightType}</IonText>
                  {/* <IonSelect
                    {...register("palletWeightUnit")}
                  >
                    <IonSelectOption value="KG">KG</IonSelectOption>
                    <IonSelectOption value="LB">LB</IonSelectOption>
                  </IonSelect> */}
                </IonItem>}
              </div>
              <Error errors={errors} name="palletWeight" />
            </div>
            {!isNew && pallet && (
              <div className="ion-padding-bottom">
                <IonItem className="ion-no-padding" lines="none">
                  <IonLabel
                    color="medium"
                    className="ion-no-margin"
                    position="stacked"
                  >
                    <IonText> Number of Packages </IonText>
                    <IonNote slot="start">{pallet?.data?.packageCount}</IonNote>
                  </IonLabel>
                </IonItem>
              </div>
            )}

            {error && error.status === -1 && (
              <ServerError errorMsg={error.message} />
            )}
            {isEditAllowed && <IonButton
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
            isNew ? "Pallet added successfully" : "Pallet updated successfully"
          }
          type={"green"}
        />
      )}
    </>
  );
};

export default AddEditPallet;
