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
} from "@ionic/react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavButton } from "../../components/NavButton";
import NoItemFound from "../../components/NoItemFound";
import { getContainerSailing, deleteSailingById } from "../../store/actions";
import {
  chevronForward as forwardIcon,
  eye as viewIcon,
  document as documentIcon,
  remove as removeIcon,
} from "ionicons/icons";
import { useHistory } from "react-router";
import { Container } from "../../model/container";
import { Dialog } from "@capacitor/dialog";
import ToastMsg from "../../components/ToastMsg";

const Delivery: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const componentRef = useRef<HTMLIonItemSlidingElement>(null);

  const { isloading, containers, error, isItemDeleted } = useSelector(
    (state: any) => {
      return state.sailing;
    }
  );

  const { userDeletedSuccess } = useSelector((state: any) => state.user);

  const handleAddDelivery = () => {
    history.push(`/delivery-container/delivery/add`);
  };

  const handleEditDelivery = (container: any) => {
    history.push(`/delivery-container/delivery/edit/${container.sailId}`);
  };

  useEffect(() => {
    dispatch(getContainerSailing());
  }, [dispatch]);

  useEffect(() => {
    if (isItemDeleted) {
      dispatch(getContainerSailing());
    }
  }, [dispatch, isItemDeleted]);

  const handleNavigateDeliveryDropOffs = (deliveryId: string) => {
    // dispatch({ type: "SELECTED_SAILID", payload: sailId });
    history.push(`/delivery-container/delivery/dropoffpackages/${deliveryId}`);
  };

  // const handleViewReports = (container: Container) => {
  //   dispatch({ type: "SELECTED_SAILID", payload: container.sailId });
  //   history.push(`/sailing-container/report/${container.sailId}`);
  // };

  if (userDeletedSuccess) {
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

  const handleDeleteItem = (event: any, sailId: string) => {
    event.preventDefault();
    const showConfirm = async () => {
      const { value } = await Dialog.confirm({
        title: "Confirm",
        message: `Are you sure you'd like to delete the item?`,
      });

      if (value) {
        dispatch(deleteSailingById(sailId));
      }
      componentRef.current?.closeOpened();
    };
    showConfirm();
  };

  const data = [
    {
      "sailId": 52,
      "sailDesc": "S, pride 119",
      "sailDate": "30/09/2022",
      "palletCount": 18,
      "sailUnit": "LB"
    },
    {
      "sailId": 42,
      "sailDesc": "pride 117 ",
      "sailDate": "04/09/2022",
      "palletCount": 16,
      "sailUnit": "LB"
    },
    {
      "sailId": 39,
      "sailDesc": "seaboard Pride 112 Ref. 58647",
      "sailDate": "23/06/2022",
      "palletCount": 17,
      "sailUnit": "LB"
    },
    {
      "sailId": 36,
      "sailDesc": "pallet",
      "sailDate": "25/04/2022",
      "palletCount": 1,
      "sailUnit": "LB"
    },
    {
      "sailId": 34,
      "sailDesc": "Ref 58322",
      "sailDate": "25/04/2022",
      "palletCount": 5,
      "sailUnit": "LB"
    },
    {
      "sailId": 24,
      "sailDesc": "tieke",
      "sailDate": "03/11/2022",
      "palletCount": 1,
      "sailUnit": "LB"
    },
    {
      "sailId": 23,
      "sailDesc": "Test Data",
      "sailDate": "31/03/2022",
      "palletCount": 7,
      "sailUnit": "LB"
    }
  ]
  const DeliveryingList: JSX.Element =
    data && data?.length === 0 ? (
      <NoItemFound />
    ) : (
      <>
        {(data || []).map((container: any, index: number) => (
          <div key={index}>
            <IonItemSliding ref={componentRef}>
              <IonItem className="ion-no-padding item-box">
                <IonLabel
                  color="medium"
                  onClick={() => handleNavigateDeliveryDropOffs(container.sailId)}
                >
                  <h3
                    className="text-wrap"
                    color="secondary"
                    style={{ fontSize: "20px", fontWeight: "normal" }}
                  >
                    {container.sailDesc}
                  </h3>
                  <span style={{ fontSize: "14px" }}>
                    Delivery Date: <b>{container.sailDate}, </b>
                  </span>
                  <br />
                  <span style={{ fontSize: "14px" }}>
                    Total DropOffs: <b>{container.palletCount}</b>
                  </span>
                </IonLabel>
                <IonButtons slot="end">
                  <IonIcon
                    icon={documentIcon}
                    color="medium"
                    // onClick={() => handleViewReports(container)}
                    className=""
                  />
                  <IonIcon
                    icon={viewIcon}
                    color="medium"
                    onClick={() => handleEditDelivery(container)}
                    className="ion-padding-horizontal"
                  />
                  <IonIcon
                    icon={forwardIcon}
                    color="green"
                    onClick={() => handleNavigateDeliveryDropOffs(container.sailId)}
                  />
                </IonButtons>
              </IonItem>
              <IonItemOptions
                side="end"
                onIonSwipe={(e) => handleDeleteItem(e, container.sailId)}
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
          <IonText className="header-menu">Delivery</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" fill="outline" onClick={handleAddDelivery}>
          Add Delivery
        </IonButton>
        <IonList lines="full">
          {isloading
            ? Array.apply(null, Array(5)).map((item: any, index: number) => (
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
            ))
            : DeliveryingList}
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
