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
  IonIcon,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { faker } from '@faker-js/faker';
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import Error from "../../components/Error";
import ServerError from "../../components/ServerError";
import { close as closeIcon } from "ionicons/icons";
import { addUser, getUserById, updateUser } from "../../store/actions";
import ToastMsg from "../../components/ToastMsg";

interface UserDetailProps {
  isRegister: boolean;
  isNew?: boolean;
  onSubmitData?: (formData: any) => void;
}

export type AccessRole = {
  label: string;
  value: string;
};

const UserDetail: React.FC<UserDetailProps> = ({ isRegister,
  isNew = false,
  onSubmitData,
}) => {
  const history = useHistory();
  const dispatch:any = useDispatch();
  const { userId }: any = useParams();

  const user = useSelector((state: any) => state.user);
  const { isloading, saveuserDetails, isUserSaved, error, selectedUser } = user;

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
    userRoles: [""]
  };

  useEffect(() => {
    if (isNew || isRegister) {
      resetForm()
    }
  }, [isNew, isRegister]);

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

  useEffect(() => {
    if (saveuserDetails && saveuserDetails.status === 0) {
      resetForm();
    }
  }, [saveuserDetails]);

  const getUserRoles = (userRoles: any) => {
    let roles = []
    if (Object.keys(userRoles).length !== 0) {
      for (const key in userRoles) {
        if (userRoles[key] !== 0) {
          roles.push(key.replace("_access", ''))
        }
      }
    }
    return roles
  }

  useEffect(() => {
    if (!isNew && selectedUser && selectedUser?.status === 0) {
      setValue("firstName", selectedUser.data.FirstName);
      setValue("lastName", selectedUser.data.LastName);
      setValue("email", selectedUser.data.Email);
      setValue("userRoles", getUserRoles(JSON.parse(selectedUser.data.UserRole)));
    }
  }, [selectedUser, isNew]);



  useEffect(() => {
    if (!isNew) {
      dispatch(getUserById(userId));
    }
  }, [isNew, dispatch, userId]);


  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("email", "");
    setValue("password", "");
    setValue("companyName", "");
    setValue("userRoles", []);
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

  const onSubmit = (data: any) => {
    const formData = { ...data };
    formData.sailingAccess = data.userRoles.some((item: string) => item === "sailing") ? 1 : 0;
    formData.deliveryAccess = data.userRoles.some((item: string) => item === "delivery") ? 1 : 0;
    if (!isRegister) {
      formData.adminAccess = data.userRoles.some((item: string) => item === "admin") ? 1 : 0;
    }
    delete formData.userRoles;
    if (!isRegister && isNew) {
      formData.password = faker.internet.password();
    }
    if (!isRegister && !isNew) {
      formData.isEmailChanged = selectedUser.data.Email !== data.email
    }
    if (isRegister) {
      onSubmitData && onSubmitData(formData)
    } else {
      isNew && dispatch(addUser(formData));
      !isNew && dispatch(updateUser(userId, formData))
    }
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
    if (isUserSaved) {
      let timer = setTimeout(() => {
        dispatch({ type: "RESET_FORM" });
        closePage();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isUserSaved]);

  const closePage = () => {
    history.goBack();
  };

  const UserForm = () => (
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
        {isRegister &&
          <>
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
                    setValue("companyName", e.detail.value.toUpperCase())
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
          </>
        }
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
              {!isRegister && <IonSelectOption value="admin">Admin</IonSelectOption>}
              <IonSelectOption value="delivery">Delivery</IonSelectOption>
              <IonSelectOption value="sailing">Sailing </IonSelectOption>
            </IonSelect>
          </IonItem>
          <Error errors={errors} name="userRoles" />
        </div>
        {error && error.status === -1 && (
          <ServerError errorMsg={error.message} />
        )}
        {/* {children} */}
        <IonButton
          type="submit"
          className="ion-margin-top"
          color="primary"
          expand="block"
        >
          {!isRegister ? 'Save' : 'Register'}
        </IonButton>
      </IonList>
    </form >
  )

  const UserPage = () => (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar>
          <IonText className={`modalheader-menu`}>
            {isNew ? "Add User" : "Edit User"}
          </IonText>
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
        {UserForm()}
      </IonContent>
      <IonLoading
        isOpen={isloading}
        message="Please wait"
        showBackdrop={false}
        translucent={true}
      />
      {isUserSaved && (
        <ToastMsg
          showToast={isUserSaved}
          duration={5000}
          message={
            isNew
              ? "User added successfully"
              : "User updated successfully"
          }
          type={"green"}
        />
      )}
    </IonPage>
  )

  return (
    <>
      {isRegister ? UserForm() : UserPage()}
    </>
  );
};

export default UserDetail;
