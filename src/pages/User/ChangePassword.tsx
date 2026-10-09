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
import { changePasswordForNewLogin } from "../../store/actions";
import { useEffect } from "react";
import ServerError from "../../components/ServerError";
import { useHistory } from "react-router";
import { LOGOUT } from "../../store/types";


const ChangePaswword: React.FC = () => {
  const dispatch: any = useDispatch();
  const history = useHistory();
  const userDetails = useSelector((state: any) => state.user);
  const { isloading, error, isPasswordUpdated } = userDetails;

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
    dispatch({ type: 'RESET_FORM' })
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
    dispatch(changePasswordForNewLogin(data));
  };


  return (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar>
          CHANGE PASSWORD
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-no-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          {!isCreatedBy &&
            <div className="text-wrapper noitem changePwdinfotext">
              <IonText className="ion-no-padding">
                You must change your password before logging on the first time.
              </IonText>
            </div>
          }
          <div className="listContainer">

            {/* <IonNote className="changePwdinfotext" color={"tertiary"}></IonNote>} */}
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
                    validate: (value: string) => {
                      if (watch('password') === value) {
                        return "New Password can't be same as current password."
                      }
                    }
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
          </div>
          <div className="add-button-container">
            <IonButton
              type="submit" expand="block" color={'secondary'} shape="round"
            >
              {'Submit'}
            </IonButton>
          </div>
        </form>
        <div className="add-button-container">
          <IonButton
            onClick={handleLogout}
            type="button"
            expand="block" color={'medium'} shape="round"
          >
            {'Cancel'}
          </IonButton>
        </div>
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