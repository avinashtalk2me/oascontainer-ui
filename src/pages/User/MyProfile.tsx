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
  IonSelect,
  IonSelectOption,
  IonButtons,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Error from "../../components/Error";
import { NavButton } from "../../components/NavButton";
import ServerError from "../../components/ServerError";
import { registerUser } from "../../store/actions";
import UserDetail from "./UserDetail";

const MyProfile: React.FC = () => {
  const history = useHistory();
  const dispatch:any = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { isloading, saveuserDetails, error } = user;

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    userRoles: ""
  };

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
    defaultValues,
  });

  // useEffect(() => {
  //   if (saveuserDetails && saveuserDetails.status === 0) {
  //     // resetForm();
  //     dispatch({ type: "RESET_FORM" });
  //     history.push("/registersuccess");
  //   }
  // }, [saveuserDetails]);

  const resetGoToLogin = (e: any) => {
    e.preventDefault();
    dispatch({ type: "RESET_FORM" });
    history.push('/login');
  };
  // const resetForm = () => {
  //   dispatch({ type: "RESET_FORM" });
  //   setValue("firstName", "");
  //   setValue("lastName", "");
  //   setValue("email", "");
  //   setValue("password", "");
  //   setValue("companyName", "");
  //   setValue("userRoles", "");
  //   reset(
  //     {},
  //     {
  //       keepErrors: false,
  //       keepDirty: false,
  //       keepIsSubmitted: false,
  //       keepTouched: false,
  //       keepIsValid: true,
  //       keepSubmitCount: false,
  //     }
  //   );
  // };

  const onSubmit = (data: any) => {
    const formattedData = { ...data };
    formattedData.addedByUser = 0;
    dispatch(registerUser(formattedData));
  };

  return (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <NavButton />
          </IonButtons>
          <IonText className="header-menu">My Profile</IonText>
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
                  First Name
                </IonLabel>
                <IonInput
                  aria-invalid={
                    errors && errors["firstName"] ? "true" : "false"
                  }
                  aria-describedby={`${"firstName"}Error`}
                  {...register("firstName", {
                    required: "First Name is required.",
                  })}
                  onIonChange={(e: any) =>
                    setValue("firstName", e.detail.value)
                  }
                />
              </IonItem>
              <Error errors={errors} name="firstName" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Last Name
                </IonLabel>
                <IonInput
                  {...register("lastName", {
                    required: "Last Name is required.",
                  })}
                  onIonChange={(e: any) => setValue("lastName", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="lastName" />
            </div>
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
                  onIonChange={(e: any) => setValue("email", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="email" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Company
                </IonLabel>
                <IonInput
                  {...register("companyName", {
                    required: "Company is required.",
                  })}
                  onIonChange={(e: any) =>
                    setValue("companyName", e.detail.value)
                  }
                />
              </IonItem>
              <Error errors={errors} name="companyName" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  className="form-input"
                  color="medium"
                  position="stacked"
                >
                  Access Role
                </IonLabel>
                <IonSelect multiple={true}
                  interface="popover"
                  {...register("userRoles", {
                    required: "Access Role is required.",
                  })}>
                  <IonSelectOption value="delivery">Delivery</IonSelectOption>
                  <IonSelectOption value="sailing">Sailing </IonSelectOption>
                </IonSelect>
              </IonItem>
              <Error errors={errors} name="userRoles" />
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
              Save
            </IonButton>
          </IonList>
        </form>
      </IonContent>
      <IonLoading
        isOpen={isloading}
        message="Please wait"
        showBackdrop={false}
        translucent={true}
      />
    </IonPage>
  );
}

export default MyProfile;