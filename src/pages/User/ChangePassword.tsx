import {
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonList,
  IonPage,
  IonItem,
  IonToolbar,
  IonText,
  IonButton,
  IonLoading,
  IonButtons,
  IonNote,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import Error from "../../components/Error";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail, updatePassword } from "../../store/actions";
import { useEffect, useState } from "react";
import ServerError from "../../components/ServerError";
import { useHistory } from "react-router";
import { LOGOUT } from "../../store/types";
import { NavButton } from "../../components/NavButton";


const ChangePaswword: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userDetails = useSelector((state: any) => state.user);
  const { isloading, isEmailValidate, error, isPasswordUpdated } = userDetails;

  const authToken: any = JSON.parse(
    localStorage.getItem("_authResponse") || "{}"
  );
  const isCreatedBy = authToken && authToken.isCreatedBy;


  const defaultValues = {
    password: "",
    newPassword: "",
    confirmNewPassword: ""
  };

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const resetForm = () => {
    setValue("password", "");
    setValue("newPassword", "");
    setValue("confirmNewPassword", "");
    dispatch({ type: 'RESET_ERROR' })
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
    const subscription = watch((value, { name, type }) => {
      if (value) {
        clearErrors(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);


  useEffect(() => {
    if (isPasswordUpdated) {
      resetForm();
      dispatch({ type: LOGOUT });
      localStorage &&
        localStorage.getItem("_authResponse") &&
        localStorage.removeItem("_authResponse");
      history.push("/passwordsuccess");
    }
  }, [isPasswordUpdated]);

  const handleLogout = () => {
    dispatch({ type: LOGOUT });
    resetForm();
    localStorage &&
      localStorage.getItem("_authResponse") &&
      localStorage.removeItem("_authResponse");
    history.push("/login");
  }


  const onSubmit = (data: any) => {
    if (!isEmailValidate) {
      dispatch(validateEmail(data));
    }
    else {
      dispatch(updatePassword(data));
    }
  };


  return (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar>
          Change Password
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList>
            {!isCreatedBy && <IonNote className="changePwdinfotext" color={"tertiary"}> You must change your password before logging on the first time.</IonNote>}
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  className="form-input"
                  color="medium"
                  position="stacked"
                >
                  Current Password
                </IonLabel>
                <IonInput
                  type="password"
                  {...register("password", {
                    required: "Password is required.",
                  })}
                  onIonChange={(e: any) => setValue("password", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="password" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  className="form-input"
                  color="medium"
                  position="stacked"
                >
                  New Password
                </IonLabel>
                <IonInput
                  type="password"
                  {...register("newPassword", {
                    required: "New Password is required.",
                  })}
                  onIonChange={(e: any) => setValue("newPassword", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="newPassword" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  className="form-input"
                  color="medium"
                  position="stacked"
                >
                  Confirm New Password
                </IonLabel>
                <IonInput
                  type="password"
                  {...register("confirmNewPassword", {
                    required: "Confirm New Password is required.",
                    validate: (value: string) => {
                      if (watch('newPassword') !== value) {
                        return "New Password and Confirm New Password doesn't match."
                      }
                    }
                  })}
                  onIonChange={(e: any) => setValue("confirmNewPassword", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="confirmNewPassword" />
            </div>
            {error && error.status === -1 && (
              <ServerError errorMsg={error.message} />
            )}
            <IonButton
              type="submit"
              className="ion-margin-top"
              color="primary"
              expand="block"
            >
              {'Submit'}
            </IonButton>

          </IonList>
        </form>
        <IonButton
          onClick={handleLogout}
          type="button"
          className="ion-margin-top"
          color="primary"
          expand="block"
        >
          {'Cancel'}
        </IonButton>
        <IonLoading
          isOpen={isloading}
          message="Please wait"
          showBackdrop={false}
          translucent={true}
        />
      </IonContent>
    </IonPage>
  )
}


export default ChangePaswword;