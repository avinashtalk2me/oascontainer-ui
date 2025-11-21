import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonToolbar,
  IonText,
  IonIcon,
  IonSkeletonText,
  IonList,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  RefresherEventDetail,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavButton } from "../../components/NavButton";
import NoItemFound from "../../components/NoItemFound";
import { getDeliveries, deleteDeliveryById } from "../../store/actions";
import {
  chevronForward as forwardIcon,
  eye as viewIcon,
  remove as removeIcon,
  chevronDownCircleOutline,
} from "ionicons/icons";
import { useHistory } from "react-router";
import { Dialog } from "@capacitor/dialog";
import ToastMsg from "../../components/ToastMsg";

export interface DeliveryProps {
  isEditAllowed: boolean;
}

const Delivery: React.FC<DeliveryProps> = ({
  isEditAllowed
}) => {
  const history = useHistory();
  const dispatch: any = useDispatch();
  const componentRef = useRef<HTMLIonItemSlidingElement>(null);
  const [records, setRecords] = useState<DeliveryProps[] | undefined>(undefined);

  const { isloading, deliveries, error, isItemDeleted } = useSelector(
    (state: any) => {
      return state.delivery;
    }
  );

  const { isUserDeleted } = useSelector((state: any) => state.user);

  useEffect(() => {
    !isloading && setRecords(deliveries.data);
  }, [isloading, deliveries]);


  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      dispatch(getDeliveries());
      event.detail.complete();
    }, 2000);
  }

  const handleAddDelivery = () => {
    history.push(`/delivery-container/delivery/add`);
  };

  const handleEditDelivery = (delivery: any) => {
    history.push(`/delivery-container/delivery/edit/${delivery.deliveryId}`);
  };

  useEffect(() => {
    dispatch(getDeliveries());
  }, [dispatch]);

  useEffect(() => {
    if (isItemDeleted) {
      dispatch(getDeliveries());
    }
  }, [dispatch, isItemDeleted]);

  const handleNavigateToLocation = (deliveryId: string) => {
    dispatch({ type: "SELECTED_DELIVERYID", payload: deliveryId });
    history.push(`/delivery-container/location/${deliveryId}`);
  };


  if (isUserDeleted) {
    history.replace('/')
    return null;
  }

  if (error && error.status === -100) {
    history.replace("/sessionexpired");
    return null;
  }

  if (error && error.status === 500) {
    history.replace("/maintenance");
    return null;
  }

  const handleDeleteItem = (event: any, deliveryId: string) => {
    event.preventDefault();
    const showConfirm = async () => {
      const { value } = await Dialog.confirm({
        title: "Confirm",
        message: `Are you sure you'd like to delete the item?`,
      });

      if (value) {
        dispatch(deleteDeliveryById(deliveryId));
      }
      componentRef.current?.closeOpened();
    };
    showConfirm();
  };

  const DeliveryList: JSX.Element =
    deliveries && deliveries?.data?.length === 0 ? (
      <NoItemFound />
    ) : (
      <>
        <div className="rounded-search-container">
          <IonSearchbar
            placeholder="Search..."
            class="rounded-search"
            animated
            debounce={300}
            onIonInput={(e) => {
              const query = e.detail?.value?.toLowerCase() || '';
              setRecords(
                deliveries.data?.filter((item: any) =>
                  item?.deliveryDesc?.toLowerCase().includes(query)
                )
              );
            }}
            onIonClear={() => setRecords(deliveries.data)}
          ></IonSearchbar>
        </div>
        {(records || []).map((delivery: any, index: number) => (
          <div key={delivery.deliveryId}>
            <IonItemSliding ref={componentRef}>
              <IonItem className={`${index % 2 === 0 ? "even" : "odd"}`}>
                <IonLabel
                  color="medium"
                  onClick={() => handleNavigateToLocation(delivery.deliveryId)}
                >
                  <h3
                    className="text-wrap"
                    color="secondary"
                    style={{ fontSize: "20px", fontWeight: "normal" }}
                  >
                    {delivery.deliveryDesc}
                  </h3>
                  <span style={{ fontSize: "14px" }}>
                    Delivery Date: <b>{delivery.deliveryDate} </b>
                  </span>
                  <br />
                  {delivery.driverName && <>
                    <span style={{ fontSize: "14px" }}>
                      Driver: <b>{delivery.driverName}</b>
                    </span>
                    <br />
                  </>}
                  <span style={{ fontSize: "14px" }}>
                    Total Packages: <b>{delivery.dropOffCount}</b>
                  </span>
                </IonLabel>
                <IonButtons slot="end">
                  <IonIcon
                    icon={viewIcon}
                    style={{ color: '#007bff' }}
                    onClick={() => handleEditDelivery(delivery)}
                    className="ion-padding-horizontal"
                  />
                  <IonIcon
                    icon={forwardIcon}
                    style={{ color: '#28a745' }}
                    onClick={() => handleNavigateToLocation(delivery.deliveryId)}
                  />
                </IonButtons>
              </IonItem>
              {isEditAllowed && <IonItemOptions
                side="end"
                onIonSwipe={(e) => handleDeleteItem(e, delivery.deliveryId)}
              >
                <IonItemOption color="danger" onClick={(e) => handleDeleteItem(e, delivery.deliveryId)}>
                  <IonIcon slot="icon-only" icon={removeIcon} />
                </IonItemOption>
              </IonItemOptions>}
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
          <IonText className="header-menu">Delivery</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-no-padding">
        {isEditAllowed &&
          <div className="add-button-container">
            <IonButton expand="block" color={'secondary'} shape="round" onClick={handleAddDelivery}>
              Add Delivery
            </IonButton>
          </div>
        }
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
              <div className="ion-list-item">
                <IonItem className="ion-no-padding" key={index}>
                  <IonLabel color="medium" className="ion-no-margin item-box">
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
              </div>
            ))
            : <div className="ion-list-item" style={{ marginBottom: '50px' }}>{DeliveryList}</div>}
        </IonList>
      </IonContent>
      {isItemDeleted && (
        <ToastMsg
          showToast={isItemDeleted}
          message={"Delivery deleted successfully"}
          type={"green"}
          duration={3000}
        />
      )}
    </IonPage>
  );
};

export default Delivery;
