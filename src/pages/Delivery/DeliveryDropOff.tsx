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
} from "@ionic/react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import NoItemFound from "../../components/NoItemFound";
import { getPackageByPalletId, deletePackageById } from "../../store/actions";
import { eye as viewIcon, remove as removeIcon } from "ionicons/icons";
import { NavButton } from "../../components/NavButton";
import { Dialog } from "@capacitor/dialog";
import ToastMsg from "../../components/ToastMsg";

const DeliveryDropOff: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const componentRef = useRef<HTMLIonItemSlidingElement>(null);

  const { isloading, selectedPalletId, error, packages, isItemDeleted } =
    useSelector((state: any) => state.package);

  const handleAddPackage = () => {
    history.push(`/delivery-container/delivery/dropoffpackages/add/${selectedPalletId}`);
  };

  const handleEditPackage = (packge: any) => {
    history.push(
      `/delivery-container/delivery/dropoffpackages/edit/${selectedPalletId}/${packge.packageId}`
    );
  };

  useEffect(() => {
    dispatch(getPackageByPalletId(selectedPalletId));
  }, [dispatch, selectedPalletId]);

  useEffect(() => {
    if (isItemDeleted) {
      dispatch(getPackageByPalletId(selectedPalletId));
    }
  }, [dispatch, isItemDeleted, selectedPalletId]);

  if (!selectedPalletId) {
    // return <Redirect to="/sailing-container/sailing" />;
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
        {(packages.data || []).map((packge: any, index: number) => (
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

export default DeliveryDropOff;
