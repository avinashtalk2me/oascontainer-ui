import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSkeletonText,
  IonText,
  IonToolbar,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonLoading,
  useIonAlert
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router";
import { NavButton } from "../../components/NavButton";
import NoItemFound from "../../components/NoItemFound";
import {
  chevronDownCircleOutline,
  chevronForward as forwardIcon,
  eye as viewIcon,
  remove as removeIcon,
  mail as mailIcon,
  alertCircle as alertIcon
} from "ionicons/icons";
import { getLocationsByDeliveryId, deleteLocationById, sendEmailForLocationWithPackages } from "../../store/actions";
import { Dialog } from "@capacitor/dialog";
import ToastMsg from "../../components/ToastMsg";
import { is } from "date-fns/locale";

export interface LocationProps {
  isEditAllowed: boolean;
}

const Location: React.FC<LocationProps> = ({
  isEditAllowed
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const componentRef = useRef<HTMLIonItemSlidingElement>(null);
  const [isEmailClicked, setIsEmailClicked] = useState<boolean>(false);
  const [presentAlert] = useIonAlert();

  const { isloading, selectedDeliveryId, error, locations, isItemDeleted, isEmailSentSuccess } =
    useSelector((state: any) => state.location);

  const handleAddLocation = () => {
    history.push(`/delivery-container/location/add/${selectedDeliveryId}`);
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      dispatch(getLocationsByDeliveryId(selectedDeliveryId));
      event.detail.complete();
    }, 2000);
  }

  const handleEditLocation = (locationId: any) => {
    history.push(`/delivery-container/location/edit/${selectedDeliveryId}/${locationId}`);
  };

  useEffect(() => {
    dispatch({ type: "RESET_FORM" });
  }, [dispatch])

  useEffect(() => {
    dispatch(getLocationsByDeliveryId(selectedDeliveryId));
  }, [dispatch, selectedDeliveryId]);

  useEffect(() => {
    if (isItemDeleted) {
      dispatch(getLocationsByDeliveryId(selectedDeliveryId));
    }
  }, [dispatch, isItemDeleted, selectedDeliveryId]);


  useEffect(() => {
    if (isEmailSentSuccess && Object.keys(isEmailSentSuccess).length > 0) {
      setIsEmailClicked(false);
    }
  }, [isEmailSentSuccess])

  const handleNavigatePackage = (locationId: string) => {
    dispatch({ type: "SELECTED_LOCATIONID", payload: locationId });
    history.push(`/delivery-container/dropoffpackages/${selectedDeliveryId}/${locationId}`);
  };

  if (!selectedDeliveryId) {
    return <Redirect to="/delivery-container/delivery" />;
  }

  if (error && error.status === -100) {
    history.replace("/sessionexpired");
    return null;
  }

  if (error && error.status === 500) {
    history.replace("/maintenance");
    return null;
  }

  const handleDeleteItem = (event: any, locationId: string) => {
    event.preventDefault();
    const showConfirm = async () => {
      const { value } = await Dialog.confirm({
        title: "Confirm",
        message: `Are you sure you'd like to delete the item?`,
      });

      if (value) {
        dispatch(deleteLocationById(locationId));
      }
      componentRef.current?.closeOpened();
    };
    showConfirm();
  };

  const openExceptionModal = (message: string) => {
    presentAlert({
      header: 'Email Exception',
      message: message,
      buttons: ['OK'],
    })
  }

  const handleSendEmail = (event: any, locationId: string) => {
    event.preventDefault();
    setIsEmailClicked(true);
    dispatch(sendEmailForLocationWithPackages(selectedDeliveryId, locationId));
    // const showConfirm = async () => {
    //   const { value } = await Dialog.confirm({
    //     title: "Confirm",
    //     message: `Are you sure you'd like to delete the item?`,
    //   });

    //   if (value) {
    //     dispatch(sendEmailForLocationWithPackages(selectedDeliveryId, locationId));
    //   }
    //   componentRef.current?.closeOpened();
    // };
    // showConfirm();
  };


  const LocationList: JSX.Element =
    locations && locations?.data?.length === 0 ? (
      <NoItemFound />
    ) : (
      <>
        {(locations.data || []).map((location: any, index: number) => (
          <div key={index} className="">
            <IonItemSliding ref={componentRef}>
              <IonItem className={`ion-no-padding item-box ${index % 2 === 0 ? "even" : "odd"}`}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className={`roundDiv ${location.dropStatus === 0 ? "red" :
                    location.dropStatus === 1 ? "yellow" : "green"}`}>
                  </div>
                  {location.dropDeliveryFailureReason && <IonIcon
                    icon={alertIcon}
                    color="danger"
                    onClick={() => openExceptionModal(location.dropDeliveryFailureReason)}
                    className="ion-alert"
                  />}
                </div>
                <IonLabel
                  color="medium"
                  onClick={() => handleNavigatePackage(location.locationId)}
                >
                  <h3
                    className="text-wrap"
                    color="secondary"
                    style={{ fontSize: "20px", fontWeight: "normal" }}
                  >
                    {location.locationTime}
                  </h3>
                  <span style={{ fontSize: "14px" }}>
                    {location.locationDesc}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "14px",
                      paddingTop: ".3em",
                    }}
                  >
                    Total Package Scanned:
                    <b>
                      {location.packageCount}
                    </b>
                  </span>
                </IonLabel>
                <IonButtons>
                  {(location.dropStatus === 1 || location.dropStatus === 2) && <IonIcon
                    icon={mailIcon}
                    color="medium"
                    onClick={(e) => handleSendEmail(e, location.locationId)}
                    className="ion-padding-horizontal"
                  />}
                  <IonIcon
                    icon={viewIcon}
                    color="medium"
                    onClick={() => handleEditLocation(location.locationId)}
                    className="ion-padding-horizontal"
                  />
                  <IonIcon
                    icon={forwardIcon}
                    color="green"
                    onClick={() => handleNavigatePackage(location.locationId)}
                  />
                </IonButtons>
              </IonItem>
              {isEditAllowed &&
                <IonItemOptions
                  side="end"
                  onIonSwipe={(e) => handleDeleteItem(e, location.locationId)}
                >
                  <IonItemOption color="danger" onClick={(e) => handleDeleteItem(e, location.locationId)}>
                    <IonIcon slot="icon-only" icon={removeIcon} />
                  </IonItemOption>
                </IonItemOptions>
              }
            </IonItemSliding>
          </div>
        ))}
      </>
    );

  return (
    <IonPage className="page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <NavButton />
          </IonButtons>
          <IonText className="header-menu">Location</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {isEditAllowed &&
          <IonButton expand="block" fill="outline" onClick={handleAddLocation}>
            Add Location
          </IonButton>}
        <IonRefresher slot="fixed" pullFactor={0.5} pullMin={100} pullMax={200} onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            refreshingSpinner="circles"
            refreshingText="Refreshing...">
          </IonRefresherContent>
        </IonRefresher>
        <IonList lines="full">
          {isloading && !isEmailClicked
            ? Array.apply(null, Array(5)).map((item: any, index: number) => (
              <IonItem className="ion-no-padding item-box" key={index}>
                <IonLabel color="medium" className="ion-no-margin">
                  <h3>
                    <IonSkeletonText
                      animated
                      style={{ width: "100%", height: "45px" }}
                    />
                  </h3>
                  <span>
                    <IonSkeletonText animated style={{ width: "50%" }} />
                  </span>
                  <span>
                    <IonSkeletonText animated style={{ width: "50%" }} />
                  </span>
                </IonLabel>
              </IonItem>
            ))
            : LocationList}
        </IonList>
      </IonContent>
      <IonLoading
        isOpen={isloading && isEmailClicked}
        message="Please wait"
        showBackdrop={false}
      />
      {isItemDeleted && (
        <ToastMsg
          showToast={isItemDeleted}
          message={"Location deleted successfully"}
          type={"green"}
          duration={3000}
        />
      )}
      {isEmailSentSuccess && (Object.keys(isEmailSentSuccess).length > 0) && (
        <ToastMsg
          showToast={true}
          message={isEmailSentSuccess.message}
          type={isEmailSentSuccess.status === -1 ? "danger" : "green"}
          duration={3000}
        />
      )}
    </IonPage>
  );
};

export default Location;
