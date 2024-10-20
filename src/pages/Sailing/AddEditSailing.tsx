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
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonTabButton,
  IonText,
  IonTextarea,
  IonToolbar,
} from "@ionic/react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Error from "../../components/Error";
import { close as closeIcon, calendar as calendarIcon } from "ionicons/icons";

import {
  insertSailing,
  getSelectedSailingById,
  updateSailingById,
} from "../../store/actions";
import ServerError from "../../components/ServerError";
import { useEffect, useState } from "react";
import ToastMsg from "../../components/ToastMsg";
import { useHistory, useParams } from "react-router";
import { format, parseISO } from "date-fns";

export interface SailingProps {
  isNew: boolean;
  isEditAllowed: boolean;
  // selectedSailId: string;
  // onDismiss: () => void;
  // setIsTransComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEditSailing: React.FC<SailingProps> = ({
  isNew,
  isEditAllowed
  // onDismiss,
  // setIsTransComplete,
  // selectedSailId,
}) => {
  const dispatch: any = useDispatch();
  const history = useHistory();
  const { sailId }: any = useParams();
  const [initialUnitType, setInitialUnitType] = useState("");
  const [unitType, setUnitType] = useState("");


  const { isloading, isItemSaved, error, container } = useSelector(
    (state: any) => state.sailing
  );

  useEffect(() => {
    if (!isNew) {
      dispatch(getSelectedSailingById(sailId));
    }
  }, [isNew, dispatch, sailId]);

  useEffect(() => {
    if (isNew) {
      setUnitType("LB")
      setValue("sailUnit", "LB");
    }
  }, [isNew]);

  useEffect(() => {
    if (!isNew && container && container?.status === 0) {
      setValue("sailDesc", container.data.sailDesc);
      setValue("sailDate", container.data.sailDate);
      setValue("sailUnit", container.data.sailUnit);
      setUnitType(container.data.sailUnit)
      setInitialUnitType(container.data.sailUnit)
      setValue(
        "displaySailDate",
        formatDate(container.data.sailDate)
        //.split("T")[0].split("-").reverse().join("/")
      );
    }
  }, [container, isNew]);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    // defaultValues
  });


  const resetForm = () => {
    setValue("sailDesc", "");
    setValue("sailDate", "");
    setValue("sailUnit", "");
    setValue("displaySailDate", "");
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

  const closePage = () => {
    history.goBack();
  };

  const onSubmit = (data: any) => {
    if (!isEditAllowed) {
      closePage();
      return
    }
    const formattedData: any = {
      ...data,
      sailDate: data.sailDate.split("T")[0],
    };
    if (isNew) {
      dispatch(insertSailing(formattedData));
    } else {
      dispatch(updateSailingById(sailId, formattedData));
    }
  };

  const formatDate = (value: string) => {
    return format(parseISO(value), "MM/dd/yyyy");
  };

  const handleDateChange = (e: any) => {
    setValue("sailDate", e.detail.value.toString());
    setValue("displaySailDate", formatDate(e.detail.value));
  };


  return (
    <>
      <IonHeader>
        <IonToolbar>
          {isEditAllowed && <IonText className="modalheader-menu">
            {isNew ? "Add Sailing" : "Edit Sailing"}
          </IonText>}
          {!isEditAllowed && <IonText className="modalheader-menu">
            View Sailing
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
                  Sail Description
                </IonLabel>
                <IonTextarea
                  rows={3}
                  maxlength={50}
                  disabled={!isEditAllowed}
                  aria-invalid={errors && errors["sailDesc"] ? "true" : "false"}
                  aria-describedby={`${"sailDesc"}Error`}
                  {...register("sailDesc", {
                    required: "Description is required.",
                  })}
                  onIonChange={(e: any) => setValue("sailDesc", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="sailDesc" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Sail Date
                </IonLabel>
                <IonInput
                  id="date-input-2"
                  readonly
                  disabled={!isEditAllowed}
                  aria-invalid={
                    errors && errors["displaySailDate"] ? "true" : "false"
                  }
                  aria-describedby={`${"sailDate"}Error`}
                  {...register("displaySailDate", {
                    required: "Date is required.",
                  })}
                />
                {isEditAllowed && <>
                  <IonButton
                    slot="end"
                    fill="clear"
                    className="calendar-btn"
                    id="open-date-input-2"
                  >
                    <IonIcon icon={calendarIcon} />
                  </IonButton>
                  <IonPopover trigger="open-date-input-2" showBackdrop={false}>
                    <Controller
                      name="sailDate"
                      control={control}
                      render={({ field }) => (
                        <IonDatetime {...field}
                          min={new Date().getUTCFullYear().toString()}
                          max="3500"
                          onIonChange={handleDateChange}
                          showDefaultButtons={true}
                          presentation="date" 
                        />
                      )}
                    />

                    {/* <IonDatetime
                      min={(new Date().getUTCFullYear().toString() && undefined) || ''}
                      max="3500"
                      // displayFormat="DD/MM/YYYY"

                      showDefaultButtons={true}
                      presentation="date"
                      {...register("sailDate")}
                      onIonChange={handleDateChange}
                    /> */}
                  </IonPopover>
                </>}

                {/* <IonDatetime
                  // displayFormat="DD/MM/YYYY"
                  min={new Date().getUTCFullYear().toString()}
                  max={"3500"}
                  pres
                  aria-invalid={errors && errors["sailDate"] ? "true" : "false"}
                  aria-describedby={`${"sailDate"}Error`}
                  {...register("sailDate", {
                    required: "Date is required.",
                  })}
                  onIonChange={(e: any) =>
                    setValue("sailDate", new Date(e.detail.value).toISOString())
                  }
                /> */}
              </IonItem>
              <Error errors={errors} name="displaySailDate" />
            </div>
            {unitType && <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Sail Weight Unit
                </IonLabel>
                <IonSelect
                  disabled={!isEditAllowed}
                  interface="popover"
                  {...register("sailUnit")}
                  onIonChange={(e: any) => setUnitType(e.target.value)}
                >
                  <IonSelectOption value="KG">KG</IonSelectOption>
                  <IonSelectOption value="LB">LB</IonSelectOption>
                </IonSelect>
              </IonItem>
              {/* <Error errors={errors} name="sailUnit" /> */}
              {!isNew
                && container?.data?.palletCount > 0
                && initialUnitType !== unitType &&
                <IonText color="danger" className="infotext">Changing this field will change weight units for all pallets.
                  Weight fields will not be converted.
                </IonText>
              }
            </div>}

            {!isNew && container && (
              <div className="ion-padding-bottom">
                <IonItem className="ion-no-padding" lines="none">
                  <IonLabel
                    color="medium"
                    className="ion-no-margin"
                    position="stacked"
                  >
                    <IonText> Number of Pallets </IonText>
                    <IonNote slot="start">
                      {container?.data?.palletCount}
                    </IonNote>
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
      />
      {isItemSaved && (
        <ToastMsg
          showToast={isItemSaved}
          duration={5000}
          message={
            isNew
              ? "Sailing added successfully"
              : "Sailing updated successfully"
          }
          type={"green"}
        />
      )}
    </>
  );
};

export default AddEditSailing;
