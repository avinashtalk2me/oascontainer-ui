import {
  IonButton, IonButtons, IonContent, IonHeader,
  IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage,
  IonText, IonTextarea, IonToolbar
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { NavButton } from "../../components/NavButton";
import ServerError from "../../components/ServerError";
import Error from "../../components/Error";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCompanyDetails, updateCompanyDetails } from "../../store/actions";
import ToastMsg from "../../components/ToastMsg";


const Settings: React.FC = () => {
  const history = useHistory();
  const dispatch:any = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { isloading, error, companyDetails, isCompanyDetailsUpdated } = user;

  const defaultValues = {
    emailReceipent: "",
    emailHost: "",
    emailType: "",
    emailUser: "",
    emailSecurity: "",
    emailPort: 0,
    emailFromAddress: "",
    emailFromSignature: ""
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

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value) {
        clearErrors(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    dispatch(getCompanyDetails())
  }, [dispatch])

  useEffect(() => {
    if (companyDetails && Object.keys(companyDetails).length > 0) {
      setValue("emailReceipent", companyDetails.data.EmailReceipent);
      setValue("emailHost", companyDetails.data.EmailHost);
      setValue("emailType", companyDetails.data.EmailType);
      setValue("emailUser", companyDetails.data.EmailUser);
      setValue("emailSecurity", companyDetails.data.EmailSecurity);
      setValue("emailPort", companyDetails.data.EmailPort);
      setValue("emailFromAddress", companyDetails.data.EmailFromAddress);
      setValue("emailFromSignature", companyDetails.data.EmailFromSignature);
    }
  }, [companyDetails])

  if (error && error.status === -100) {
    history.replace("/sessionexpired");
    return null;
  }

  if (error && error.status === 500) {
    history.replace("/maintenance");
    return null;
  }

  const onSubmit = (data: any) => {
    dispatch(updateCompanyDetails(data));
  };

  return (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <NavButton />
          </IonButtons>
          <IonText className="header-menu">Settings</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <IonList>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Email Receipent
                </IonLabel>
                <IonTextarea
                  rows={2}
                  maxlength={50}
                  {...register("emailReceipent", {
                    required: "Email Receipent is required.",
                    validate: (value: string) => {
                      const emailIds = value.split(',');
                      const invalidIds = emailIds.filter(emails => !emails.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i))
                      if (invalidIds.length > 0) {
                        return "Invalid email id(s)."
                      }
                    }
                  })}
                  onIonChange={(e: any) => setValue("emailReceipent", e.detail.value)}
                />
              </IonItem>
              <IonText className="infotext">Mulitple email(s) will be displayed separated by commas.
              </IonText><br />
              <Error errors={errors} name="emailReceipent" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Email Host
                </IonLabel>
                <IonInput
                  maxlength={40}
                  {...register("emailHost", {
                    required: "Email Host is required.",
                  })}
                  onIonChange={(e: any) => setValue("emailHost", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="emailHost" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Email Type
                </IonLabel>
                <IonInput
                  maxlength={10}
                  {...register("emailType", {
                    required: "Email Type is required."
                  })}
                  onIonChange={(e: any) => setValue("emailType", e.detail.value)}
                />
              </IonItem>
              <Error errors={errors} name="emailType" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Email User
                </IonLabel>
                <IonInput
                  maxlength={40}
                  {...register("emailUser", {
                    required: "Email User is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address.",
                    },
                  })}
                  onIonChange={(e: any) =>
                    setValue("emailUser", e.detail.value)
                  }
                />
              </IonItem>
              <Error errors={errors} name="emailUser" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Email Security
                </IonLabel>
                <IonInput
                  maxlength={5}
                  {...register("emailSecurity", {
                    required: "Email Security is required.",
                  })}
                  onIonChange={(e: any) =>
                    setValue("emailSecurity", e.detail.value)
                  }
                />
              </IonItem>
              <Error errors={errors} name="emailSecurity" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Email Port
                </IonLabel>
                <IonInput
                  type="number"
                  {...register("emailPort", {
                    required: "Email Port is required.",
                  })}
                  onIonChange={(e: any) =>
                    setValue("emailPort", e.detail.value)
                  }
                />
              </IonItem>
              <Error errors={errors} name="emailPort" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Email From Address
                </IonLabel>
                <IonInput
                  maxlength={40}
                  {...register("emailFromAddress", {
                    required: "Email From Address is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address.",
                    },
                  })}
                  onIonChange={(e: any) =>
                    setValue("emailFromAddress", e.detail.value)
                  }
                />
              </IonItem>
              <Error errors={errors} name="emailFromAddress" />
            </div>
            <div className="ion-padding-bottom">
              <IonItem className="ion-no-padding">
                <IonLabel
                  color="medium"
                  className="form-input"
                  position="stacked"
                >
                  Email From Signature
                </IonLabel>
                <IonInput
                  maxlength={50}
                  {...register("emailFromSignature", {
                    required: "Email From Signature is required.",
                  })}
                  onIonChange={(e: any) =>
                    setValue("emailFromSignature", e.detail.value)
                  }
                />
              </IonItem>
              <Error errors={errors} name="emailFromSignature" />
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
        {isCompanyDetailsUpdated && (
        <ToastMsg
          showToast={isCompanyDetailsUpdated}
          duration={5000}
          message={
            "Details Saved successfully"
          }
          type={"green"}
        />
      )}
    </IonPage>
  )
}

export default Settings;