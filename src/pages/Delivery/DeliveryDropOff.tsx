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
  RefresherEventDetail,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router";
import NoItemFound from "../../components/NoItemFound";
import { getDropOffsByLocation, deleteDropOffById } from "../../store/actions";
import { eye as viewIcon, remove as removeIcon, chevronDownCircleOutline } from "ionicons/icons";
import { NavButton } from "../../components/NavButton";
import { Dialog } from "@capacitor/dialog";
import ToastMsg from "../../components/ToastMsg";

export interface DropOffProps {
  isEditAllowed: boolean;
}

const DeliveryDropOff: React.FC<DropOffProps> = ({
  isEditAllowed
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const componentRef = useRef<HTMLIonItemSlidingElement>(null);
  const { deliveryId, locationId }: any = useParams();
  
  const { isloading, selectedLocationId, error, dropOffs, isItemDeleted } =
    useSelector((state: any) => state.dropOff);

  const handleAddPackage = () => {
    history.push(`/delivery-container/dropoffpackages/add/${deliveryId}/${locationId}`);
  };

  const handleEditPackage = (packge: any) => {
    history.push(
      `/delivery-container/dropoffpackages/edit/${locationId}/${packge.packageId}/${packge.hwbNo}`
    );
  };

  useEffect(() => {
    dispatch(getDropOffsByLocation(selectedLocationId));
  }, [dispatch, selectedLocationId]);

  useEffect(() => {
    if (isItemDeleted) {
      dispatch(getDropOffsByLocation(selectedLocationId));
    }
  }, [dispatch, isItemDeleted, selectedLocationId]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      dispatch(getDropOffsByLocation(selectedLocationId));
      event.detail.complete();
    }, 2000);
  }


  if (!deliveryId && !locationId) {
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

  const handleDeleteItem = (event: any, packageId: string) => {
    event.preventDefault();
    const showConfirm = async () => {
      const { value } = await Dialog.confirm({
        title: "Confirm",
        message: `Are you sure you'd like to delete the item?`,
      });

      if (value) {
        dispatch(deleteDropOffById(packageId));
      }
      componentRef.current?.closeOpened();
    };
    showConfirm();
  };

  const PackageList: JSX.Element =
    dropOffs && dropOffs?.data?.length === 0 ? (
      <NoItemFound />
    ) : (
      <>
        {(dropOffs.data || []).map((packge: any, index: number) => (
          <div key={index} className="">
            <IonItemSliding ref={componentRef}>
              <IonItem className="ion-no-padding item-box">
                <IonLabel color="medium">
                  <h3
                    className="text-wrap"
                    color="secondary"
                    style={{ fontSize: "20px", fontWeight: "normal" }}
                  >
                    {packge.hwbNo}
                  </h3>
                  <span style={{ fontSize: "14px" }}>
                    Package Count: <b>{packge.packageCount}</b>
                  </span>
                </IonLabel>
                <IonButtons slot="end">
                  <IonIcon
                    icon={viewIcon}
                    color="medium"
                    onClick={() => handleEditPackage(packge)}
                    className="ion-padding-horizontal"
                  />
                </IonButtons>
              </IonItem>
              <IonItemOptions
                side="end"
                onIonSwipe={(e) => handleDeleteItem(e, packge.packageId)}
              >
                <IonItemOption color="danger">
                  <IonIcon slot="icon-only" icon={removeIcon} />
                </IonItemOption>
              </IonItemOptions>
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
          <IonText className="header-menu">Delivery DropOff Package</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className={`ion-padding`}>
        <IonButton expand="block" fill="outline" onClick={handleAddPackage}>
          Add DropOff
        </IonButton>
        <IonRefresher slot="fixed" pullFactor={0.5} pullMin={100} pullMax={200} onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            refreshingSpinner="circles"
            refreshingText="Refreshing...">
          </IonRefresherContent>
        </IonRefresher>
        <IonList lines="full">
          {isloading
            ? Array.apply(null, Array(5)).map((item: any, index: number) => (
              <IonItem className="ion-no-padding" key={index}>
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
            : PackageList}
        </IonList>
      </IonContent>
      {isItemDeleted && (
        <ToastMsg
          showToast={isItemDeleted}
          message={"Dropoff Package deleted successfully"}
          type={"green"}
          duration={3000}
        />
      )}
    </IonPage>
  );
};

export default DeliveryDropOff;
