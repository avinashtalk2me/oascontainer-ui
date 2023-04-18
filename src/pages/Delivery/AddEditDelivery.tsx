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
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Error from "../../components/Error";
import { close as closeIcon, calendar as calendarIcon } from "ionicons/icons";

import {
  insertDelivery,
  getSelectedDeliveryById,
  updateDeliveryById,
} from "../../store/actions";
import ServerError from "../../components/ServerError";
import { useEffect, useState } from "react";
import ToastMsg from "../../components/ToastMsg";
import { useHistory, useParams } from "react-router";
import { format, parseISO } from "date-fns";

export interface DeliveryProps {
  isNew: boolean;
  isEditAllowed: boolean;
  // selectedSailId: string;
  // onDismiss: () => void;
  // setIsTransComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEditDelivery: React.FC<DeliveryProps> = ({
  isNew,
  isEditAllowed
  // onDismiss,
  // setIsTransComplete,
  // selectedSailId,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { deliveryId }: any = useParams();
  const todaysDate = new Date().toISOString();

  const { isloading, isItemSaved, error, delivery } = useSelector(
    (state: any) => state.delivery
  );

  useEffect(() => {
    if (!isNew) {
      dispatch(getSelectedDeliveryById(deliveryId));
    }
  }, [isNew, dispatch, deliveryId]);

  useEffect(() => {
    if (!isNew && delivery && delivery?.status === 0) {
      setValue("deliveryDesc", delivery.data.deliveryDesc);
      setValue("deliveryDate", delivery.data.deliveryDate);
      setValue(
        "displayDeliveryDate",
        formatDate(delivery.data.deliveryDate)
      );
    } else {
      if (isNew) {
        setValue("deliveryDate", getDateinTZFormat());
        setValue(
          "displayDeliveryDate",
          format(new Date(), "MM/dd/yyyy")
        );
      }
    }
  }, [delivery, isNew]);

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
  } = useForm({
    // defaultValues
  });

  const getDateinTZFormat = () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}T00:00:00.000Z`
  }

  const resetForm = () => {
    setValue("deliveryDesc", "");
    setValue("deliveryDate", "");
    setValue("displayDeliveryDate", "");
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
      deliveryDate: data.deliveryDate.split("T")[0],
    };
    if (isNew) {
      dispatch(insertDelivery(formattedData));
    } else {
      dispatch(updateDeliveryById(deliveryId, formattedData));
    }
  };

  const formatDate = (value: string) => {
    return format(parseISO(value), "MM/dd/yyyy");
  };

  const handleDateChange = (e: any) => {
    setValue("deliveryDate", e.detail.value);
    setValue("displayDeliveryDate", formatDate(e.detail.value));
  };


  return (
    <>
      <IonHeader>
        <IonToolbar>
          {isEditAllowed &&
            <IonText className="modalheader-menu">
              {isNew ? "Add Delivery" : "Edit Delivery"}
            </IonText>}
          {!isEditAllowed && <IonText className="modalheader-menu">
            View Delivery
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
                  Delivery Description
                </IonLabel>
                <IonTextarea
                  disabled={!isEditAllowed}
                  rows={3}
                  maxlength={40}
                  aria-invalid={errors && errors["deliveryDesc"] ? "true" : "false"}
                  aria-describedby={`${"deliveryDesc"}Error`}
                  {...register("deliveryDesc", {
                    required: "Description is required.",
                  })}
                  onIonChange={(e: any) => setValue("deliveryDesc", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="deliveryDesc" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Delivery Date
                </IonLabel>
                <IonInput
                  disabled={!isEditAllowed}
                  id="date-input-2"
                  readonly
                  aria-invalid={
                    errors && errors["displayDeliveryDate"] ? "true" : "false"
                  }
                  aria-describedby={`${"deliveryDate"}Error`}
                  {...register("displayDeliveryDate", {
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
                    <IonDatetime
                      min={new Date().getUTCFullYear().toString()}
                      max={todaysDate}
                      // displayFormat="DD/MM/YYYY"
                      showDefaultButtons={true}
                      presentation="date"
                      {...register("deliveryDate")}
                      onIonChange={handleDateChange}
                    />
                  </IonPopover>
                </>}
              </IonItem>
              <Error errors={errors} name="displaySailDate" />
            </div>
            {!isNew && delivery && (
              <div className="ion-padding-bottom">
                <IonItem className="ion-no-padding" lines="none">
                  <IonLabel
                    color="medium"
                    className="ion-no-margin"
                    position="stacked"
                  >
                    <IonText> Number of Packages </IonText>
                    <IonNote slot="start">
                      {delivery?.data?.dropOffCount}
                    </IonNote>
                  </IonLabel>
                </IonItem>
              </div>
            )}
            {!isNew && !isEditAllowed && delivery && (
              <div className="ion-padding-bottom">
                <IonItem className="ion-no-padding" lines="none">
                  <IonLabel
                    color="medium"
                    className="ion-no-margin"
                    position="stacked"
                  >
                    <IonText> Driver Name</IonText>
                    <IonNote slot="start">
                      {delivery?.data?.driverName}
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
            </IonButton>}
            {!isEditAllowed && <IonButton
              type="submit"
              className="ion-margin-top"
              color="primary"
              expand="block"
            >
              Return
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
              ? "Delivery added successfully"
              : "Delivery updated successfully"
          }
          type={"green"}
        />
      )}
    </>
  );
};

export default AddEditDelivery;
