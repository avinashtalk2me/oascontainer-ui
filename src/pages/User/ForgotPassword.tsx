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
} from "@ionic/react";
import { useForm } from "react-hook-form";
import Error from "../../components/Error";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail, updatePassword } from "../../store/actions";
import { useEffect, useState } from "react";
import ServerError from "../../components/ServerError";
import { useHistory } from "react-router";


const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userDetails = useSelector((state: any) => state.user);
  const { isloading, isEmailValidate, error, isPasswordUpdated } = userDetails;

  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: ""
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
    setValue("email", "");
    if (isEmailValidate) {
      setValue("password", "");
      setValue("confirmPassword", "");
    }
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
      history.push("/passwordsuccess");
    }
  }, [isPasswordUpdated]);


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
        <IonToolbar>{!isEmailValidate ? `Forgot Password` : 'Change Password'}</IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className={`form-input ${isEmailValidate && 'disabledLabel'}`}
                  position="stacked"
                >
                  Email
                </IonLabel>
                <IonInput
                  disabled={isEmailValidate}
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address.",
                    },
                  })}
                  onIonChange={(e: any) => setValue("email", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="email" />
            </div>

            {isEmailValidate &&
              <>
                <div className="ion-padding-bottom">
                  <IonItem className="ion-no-padding">
                    <IonLabel
                      className="form-input"
                      color="medium"
                      position="stacked"
                    >
                      Password
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
                      Confirm Password
                    </IonLabel>
                    <IonInput
                      type="password"
                      {...register("confirmPassword", {
                        required: "Confirm Password is required.",
                        validate: (value:string) => {
                          if(watch('password') !== value) {
                            return "Password and Confirm Password doesn't match"
                          }
                        }
                      })}
                      onIonChange={(e: any) => setValue("confirmPassword", e.detail.value)}
                    />
                  </IonItem>
                  <Error errors={errors} name="confirmPassword" />
                </div>
              </>
            }

            {error && error.status === -1 && (
              <ServerError errorMsg={error.message} />
            )}
            <IonButton
              type="submit"
              className="ion-margin-top"
              color="primary"
              expand="block"
            >
              {!isEmailValidate ? 'Verify' : 'Submit'}
            </IonButton>
          </IonList>
        </form>
        <IonButton
          type="submit"
          expand="full"
          fill="clear"
          onClick={resetForm}
          routerLink="/register"
        >
          <span className="text-hyperlink">
            {" "}
            Don't have an account ? Register
          </span>
        </IonButton>

        <IonButton
          type="submit"
          expand="full"
          fill="clear"
          onClick={resetForm}
          routerLink="/login"
        >
          <span className="text-hyperlink">
            {" "}
            Back to Login
          </span>
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


export default ForgotPassword;