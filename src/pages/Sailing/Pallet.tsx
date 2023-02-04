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
import { useHistory, Redirect } from "react-router";
import { NavButton } from "../../components/NavButton";
import NoItemFound from "../../components/NoItemFound";
import {
  chevronDownCircleOutline,
  chevronForward as forwardIcon,
  eye as viewIcon,
  remove as removeIcon,
} from "ionicons/icons";
import { getPalletsBySailId, deletePalletById } from "../../store/actions";
import { Dialog } from "@capacitor/dialog";
import ToastMsg from "../../components/ToastMsg";
import { IPallet } from "../../model/pallet";

export interface PalletProps {
  isEditAllowed: boolean;
}

const Pallet: React.FC<PalletProps> = ({
  isEditAllowed
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const componentRef = useRef<HTMLIonItemSlidingElement>(null);

  const { isloading, selectedSailId, error, pallets, isItemDeleted } =
    useSelector((state: any) => state.pallet);

  const handleAddPallet = () => {
    history.push(`/sailing-container/sailing/pallet/add/${selectedSailId}`);
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      dispatch(getPalletsBySailId(selectedSailId));
      event.detail.complete();
    }, 2000);
  }

  const handleEditPallet = (pallet: any) => {
    history.push(`/sailing-container/sailing/pallet/edit/${selectedSailId}/${pallet.palletId}`);
  };

  useEffect(() => {
    dispatch({ type: "RESET_FORM" });
  }, [dispatch])

  useEffect(() => {
    dispatch(getPalletsBySailId(selectedSailId));
  }, [dispatch, selectedSailId]);

  useEffect(() => {
    if (isItemDeleted) {
      dispatch(getPalletsBySailId(selectedSailId));
    }
  }, [dispatch, isItemDeleted, selectedSailId]);

  if (!selectedSailId) {
    return <Redirect to="/sailing-container/sailing" />;
  }

  const handleNavigatePackage = (pallet: IPallet) => {
    if (pallet.palletType !== 'Loose') {
      dispatch({ type: "SELECTED_PALLETID", payload: pallet.palletId });
      history.push(`/sailing-container/sailing/package/${pallet.palletId}`);
    } else {
      noPackageAlertForPallet();
    }
  };


  const noPackageAlertForPallet = () => {
    Dialog.alert({
      title: "Not Allowed",
      message: `Packages are not available for Loose Type Pallet`,
    });
  }

  if (error && error.status === -100) {
    history.replace("/sessionexpired");
    return null;
  }

  if (error && error.status === 500) {
    history.replace("/maintenance");
    return null;
  }

  const handleDeleteItem = (event: any, palletId: string) => {
    event.preventDefault();
    const showConfirm = async () => {
      const { value } = await Dialog.confirm({
        title: "Confirm",
        message: `Are you sure you'd like to delete the item?`,
      });

      if (value) {
        dispatch(deletePalletById(palletId));
      }
      componentRef.current?.closeOpened();
    };
    showConfirm();
  };

  const PalletList: JSX.Element =
    pallets && pallets?.data?.length === 0 ? (
      <NoItemFound />
    ) : (
      <>
        {(pallets.data || []).map((pallet: any, index: number) => (
          <div key={index} className="">
            <IonItemSliding ref={componentRef}>
              <IonItem className="ion-no-padding item-box">
                <IonLabel
                  color="medium"
                  onClick={() => handleNavigatePackage(pallet)}
                >
                  <h3
                    className="text-wrap"
                    color="secondary"
                    style={{ fontSize: "20px", fontWeight: "normal" }}
                  >
                    Pallet# {pallet.palletNo}
                  </h3>
                  <span style={{ fontSize: "14px" }}>
                    Type: <b>{pallet.palletType}</b>
                  </span>
                  {pallet.palletType !== "Loose" && <span style={{ fontSize: "14px" }}>
                    , Packages: <b>{pallet.packageCount}</b>
                  </span>}
                  <span
                    style={{
                      display: "block",
                      fontSize: "14px",
                      paddingTop: ".3em",
                    }}
                  >
                    Weights:{" "}
                    <b>
                      {pallet.palletWeight} {pallet.palletWeightUnit}
                    </b>
                  </span>
                </IonLabel>
                <IonButtons>
                  <IonIcon
                    icon={viewIcon}
                    color="medium"
                    onClick={() => handleEditPallet(pallet)}
                    className="ion-padding-horizontal"
                  />
                  <IonIcon
                    icon={forwardIcon}
                    color="green"
                    onClick={() => handleNavigatePackage(pallet)}
                  />
                </IonButtons>
              </IonItem>
              {isEditAllowed &&
                <IonItemOptions
                  side="end"
                  onIonSwipe={(e) => handleDeleteItem(e, pallet.palletId)}
                >
                  <IonItemOption color="danger">
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
          <IonText className="header-menu">Pallet</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {isEditAllowed &&
          <IonButton expand="block" fill="outline" onClick={handleAddPallet}>
            Add Pallet
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
            : PalletList}
        </IonList>
      </IonContent>
      {isItemDeleted && (
        <ToastMsg
          showToast={isItemDeleted}
          message={"Pallet deleted successfully"}
          type={"green"}
          duration={3000}
        />
      )}
    </IonPage>
  );
};

export default Pallet;
