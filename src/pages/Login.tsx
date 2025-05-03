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
import Error from "../components/Error";
import { useDispatch, useSelector } from "react-redux";
import { validateUser } from "../store/actions";
import { useEffect, useState } from "react";
import ServerError from "../components/ServerError";
import { useHistory } from "react-router";

const Login: React.FC = () => {
  const dispatch:any = useDispatch();
  const history = useHistory();
  const userDetails = useSelector((state: any) => state.user);
  const { isloading, user, error } = userDetails;

  // useEffect(() => {
  //   const authToken: any = JSON.parse(
  //     localStorage.getItem("_authResponse") || "{}"
  //   );
  //   const idToken = authToken && authToken.access_token;
  //   if (idToken && authToken.userRoles.sailing_access === 1 && authToken.userRoles.delivery_access === 0) {
  //     history.replace("/sailing-container/sails");
  //   }
  //   if (idToken && authToken.userRoles.sailing_access === 1 && authToken.userRoles.delivery_access === 1) {
  //     history.replace("/loadAccessModule");
  //   }
  //   if (idToken &&authToken.userRoles.sailing_access === 0 && authToken.userRoles.delivery_access === 1) {
  //     history.replace("/delivery-container/deliveries");
  //   }
  // }, [history]);

  useEffect(() => {
    if (error && error.status === -100) {
      history.push('/login');
    }

    if (error && error.status === -1) {
      setValue("password", "");
    }
  }, [error]);

  useEffect(() => {
    if (user && user.userId) {
      if (!user.createdBy) {
        dispatch({ type: "RESET_FORM" });
        if ((user.userRoles.admin_access === 1)) {
          history.replace("/loadAccessModule");
        } else {
          if ((user.userRoles.sailing_access === 1 || user.userRoles.sailing_access === 2) && user.userRoles.delivery_access === 0) {
            history.replace("/sailing-container/sails");
          }
          if (((user.userRoles.sailing_access === 1 || user.userRoles.sailing_access === 2) && (user.userRoles.delivery_access === 1 || user.userRoles.delivery_access === 2))) {
            history.replace("/loadAccessModule");
          }
          if (user.userRoles.sailing_access === 0 && (user.userRoles.delivery_access === 1 || user.userRoles.delivery_access === 2)) {
            history.replace("/delivery-container/deliveries");
          }
        }
      } else {
        history.replace("/changepassword");
      }
    }
  }, [user]);

  const defaultValues = {
    email: "",
    password: "",
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
    setValue("password", "");
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
    const subscription = watch((value, { name, type }) => {
      if (value) {
        clearErrors(name);
      } else {
        // setError(name)
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: any) => {
    dispatch(validateUser(data));
  };

  if (error && error.status === 500) {
    history.replace("/maintenance");
    return null;
  }

  return (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar>Login</IonToolbar>
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
                  Email
                </IonLabel>
                <IonInput
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address.",
                    },
                  })}
                  onIonChange={(e: any) => setValue("email", e.detail.value.trim())}
                />
              </IonItem>
              <Error errors={errors} name="email" />
            </div>
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
                  onIonChange={(e: any) => setValue("password", e.detail.value.trim())}
                />
              </IonItem>
              <Error errors={errors} name="password" />
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
              Login
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
          routerLink="/forgotpassword"
        >
          <span className="text-hyperlink">
            {" "}
            Forgot Password ?
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
  );
};

export default Login;
