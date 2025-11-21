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
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonSearchbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavButton } from "../../components/NavButton";
import NoItemFound from "../../components/NoItemFound";
import { getContainerSailing, deleteSailingById } from "../../store/actions";
import {
  chevronForward as forwardIcon,
  eye as viewIcon,
  document as documentIcon,
  remove as removeIcon,
  chevronDownCircleOutline,
} from "ionicons/icons";
import { useHistory } from "react-router";
import { Container } from "../../model/container";
import { Dialog } from "@capacitor/dialog";
import ToastMsg from "../../components/ToastMsg";

export interface SailingProps {
  isEditAllowed: boolean;
  sailDesc?: string;
  date?: string;
  pallets?: number;

}

const Sailing: React.FC<SailingProps> = ({
  isEditAllowed
}) => {
  const history = useHistory();
  const dispatch: any = useDispatch();
  const componentRef = useRef<HTMLIonItemSlidingElement>(null);
  const [records, setRecords] = useState<SailingProps[] | undefined>(undefined);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      dispatch(getContainerSailing());
      event.detail.complete();
    }, 2000);
  }

  const { isloading, containers, error, isItemDeleted } = useSelector(
    (state: any) => {
      return state.sailing;
    }
  );

  useEffect(() => {
    !isloading && setRecords(containers.data);
  }, [isloading, containers]);

  const { isUserDeleted } = useSelector((state: any) => state.user);

  const handleAddSailing = () => {
    history.push(`/sailing-container/sailing/add`);
  };

  const handleEditSailing = (container: any) => {
    history.push(`/sailing-container/sailing/edit/${container.sailId}`);
  };

  useEffect(() => {
    dispatch(getContainerSailing());
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: "RESET_FORM" });
  }, [dispatch])

  useEffect(() => {
    if (isItemDeleted) {
      dispatch(getContainerSailing());
    }
  }, [dispatch, isItemDeleted]);

  const handleNavigatePallet = (sailId: string) => {
    dispatch({ type: "SELECTED_SAILID", payload: sailId });
    history.push(`/sailing-container/pallet/${sailId}`);
  };

  const handleViewReports = (container: Container) => {
    dispatch({ type: "SELECTED_SAILID", payload: container.sailId });
    history.push(`/sailing-container/report/${container.sailId}`);
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

  const SailingList: JSX.Element =
    containers && containers?.data?.length === 0 ? (
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
                containers.data?.filter((item: any) =>
                  item?.sailDesc?.toLowerCase().includes(query)
                )
              );
            }}
            onIonClear={() => setRecords(containers.data)}
          ></IonSearchbar>
        </div>

        {(records || []).map((container: any, index: number) => (
          <div key={container.sailId}>
            <IonItemSliding ref={componentRef}>
              <IonItem className={`${index % 2 === 0 ? "even" : "odd"}`}>
                <IonLabel
                  color="medium"
                  onClick={() => handleNavigatePallet(container.sailId)}
                >
                  <h3
                    className="text-wrap"
                    color="secondary"
                    style={{ fontSize: "20px", fontWeight: "normal" }}
                  >
                    {container.sailDesc}
                  </h3>
                  <span style={{ fontSize: "14px" }}>
                    Sail Date: <b>{container.sailDate}, </b>
                  </span>

                  <span style={{ fontSize: "14px" }}>
                    Pallets: <b>{container.palletCount}</b>
                  </span>
                </IonLabel>
                <IonButtons slot="end">
                  <IonIcon
                    icon={documentIcon}
                    style={{ color: '#f40f02' }}
                    onClick={() => handleViewReports(container)}
                  />
                  <IonIcon
                    icon={viewIcon}
                    style={{ color: '#007bff' }}
                    onClick={() => handleEditSailing(container)}
                    className="ion-padding-horizontal"
                  />
                  <IonIcon
                    icon={forwardIcon}
                    style={{ color: '#28a745' }}
                    onClick={() => handleNavigatePallet(container.sailId)}
                  />
                </IonButtons>
              </IonItem>
              {isEditAllowed && <IonItemOptions
                side="end"
                onIonSwipe={(e) => handleDeleteItem(e, container.sailId)}
              >
                <IonItemOption color="danger" onClick={(e) => handleDeleteItem(e, container.sailId)}>
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
          <IonText className="header-menu">Sailing</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-no-padding">

        {isEditAllowed &&
          <div className="add-button-container">
            <IonButton expand="block" color={'secondary'} shape="round" onClick={handleAddSailing}>
              Add Sailing
            </IonButton>
          </div>}
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
                  <IonLabel color="medium" className=" item-box">
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
            : <div className="ion-list-item" style={{ marginBottom: '50px' }}>{SailingList}</div>}
        </IonList>
      </IonContent>
      {isItemDeleted && (
        <ToastMsg
          showToast={isItemDeleted}
          message={"Sailing deleted successfully"}
          type={"green"}
          duration={3000}
        />
      )}
    </IonPage>
  );
};

export default Sailing;
