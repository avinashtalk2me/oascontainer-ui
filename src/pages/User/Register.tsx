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
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Error from "../../components/Error";
import ServerError from "../../components/ServerError";
import { registerUser } from "../../store/actions";
import AddEditUser from "./AddEditUser";

const Register: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { isloading, saveuserDetails } = user;

  useEffect(() => {
    localStorage.removeItem("_authResponse");
  }, []);

  useEffect(() => {
    if (saveuserDetails && saveuserDetails.status === 0) {
      // resetForm();
      dispatch({ type: "RESET_ERROR" });
      history.push("/registersuccess");
    }
  }, [saveuserDetails]);

  const resetGoToLogin = (e: any) => {
    e.preventDefault();
    dispatch({ type: "RESET_ERROR" });
    history.push('/login');
  };
  // const resetForm = () => {
  //   dispatch({ type: "RESET_ERROR" });
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
        <IonToolbar>Register</IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <AddEditUser isRegister={true} onSubmitData={onSubmit}>
        </AddEditUser>
        <IonButton
          type="submit"
          expand="full"
          fill="clear"
          onClick={resetGoToLogin}
        >
          <span className="text-hyperlink"> Already have account ?</span>
        </IonButton>
      </IonContent>
      <IonLoading
        isOpen={isloading}
        message="Please wait"
        showBackdrop={false}
        translucent={true}
      />
    </IonPage>
  );
};

export default Register;
