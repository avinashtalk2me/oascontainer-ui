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
} from "@ionic/react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import NoItemFound from "../../components/NoItemFound";
import { getPackageByPalletId, deletePackageById } from "../../store/actions";
import { chevronDownCircleOutline, eye as viewIcon, remove as removeIcon } from "ionicons/icons";
import { NavButton } from "../../components/NavButton";
import { Dialog } from "@capacitor/dialog";
import ToastMsg from "../../components/ToastMsg";

export interface PackageProps {
  isEditAllowed: boolean;
}

const Package: React.FC<PackageProps> = ({
  isEditAllowed
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const componentRef = useRef<HTMLIonItemSlidingElement>(null);

  const { isloading, selectedPalletId, error, packages, isItemDeleted } =
    useSelector((state: any) => state.package);

  const handleAddPackage = () => {
    history.push(`/sailing-container/sailing/package/add/${selectedPalletId}`);
  };

  const handleEditPackage = (packageItem: any) => {
    history.push(
      `/sailing-container/sailing/package/edit/${selectedPalletId}/${packageItem.packageId}/${packageItem.hwbNo}`
    );
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      dispatch(getPackageByPalletId(selectedPalletId));
      event.detail.complete();
    }, 2000);
  }

  useEffect(() => {
    dispatch(getPackageByPalletId(selectedPalletId));
  }, [dispatch, selectedPalletId]);

  useEffect(() => {
    if (isItemDeleted) {
      dispatch(getPackageByPalletId(selectedPalletId));
    }
  }, [dispatch, isItemDeleted, selectedPalletId]);

  useEffect(() => {
    dispatch({ type: "RESET_FORM" });
  }, [dispatch])

  if (!selectedPalletId) {
    return <Redirect to="/sailing-container/sailing" />;
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
        dispatch(deletePackageById(packageId));
      }
      componentRef.current?.closeOpened();
    };
    showConfirm();
  };

  const PackageList: JSX.Element =
    packages && packages?.data?.length === 0 ? (
      <NoItemFound />
    ) : (
      <>
        {(packages.data || []).map((packageItem: any, index: number) => (
          <div key={index} className="">
            <IonItemSliding ref={componentRef}>
              <IonItem className={`ion-no-padding item-box ${index % 2 === 0 ? "even" : "odd"}`}>
                <IonLabel color="medium">
                  <h3
                    className="text-wrap"
                    color="secondary"
                    style={{ fontSize: "20px", fontWeight: "normal" }}
                  >
                    {packageItem.hwbNo}
                  </h3>
                  <span style={{ fontSize: "14px" }}>
                    Package Count: <b>{packageItem.packageCount}</b>
                  </span>
                </IonLabel>
                <IonButtons slot="end">
                  <IonIcon
                    icon={viewIcon}
                    color="medium"
                    onClick={() => handleEditPackage(packageItem)}
                    className="ion-padding-horizontal"
                  />
                </IonButtons>
              </IonItem>
              {isEditAllowed &&
                <IonItemOptions
                  side="end"
                  onIonSwipe={(e) => handleDeleteItem(e, packageItem.packageId)}
                >
                  <IonItemOption color="danger" onClick={(e) => handleDeleteItem(e, packageItem.packageId)}>
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
          <IonText className="header-menu">Package</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className={`ion-padding`}>
        {isEditAllowed && <IonButton expand="block" fill="outline" onClick={handleAddPackage}>
          Add Package
        </IonButton>}
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
          message={"Package deleted successfully"}
          type={"green"}
          duration={3000}
        />
      )}
    </IonPage>
  );
};

export default Package;
