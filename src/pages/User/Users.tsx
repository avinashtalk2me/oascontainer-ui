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
} from "@ionic/react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavButton } from "../../components/NavButton";
import NoItemFound from "../../components/NoItemFound";
import { getUsers, deleteUserById } from "../../store/actions";
import {
  eye as viewIcon,
  remove as removeIcon,
  chevronDownCircleOutline,
} from "ionicons/icons";
import { useHistory } from "react-router";
import { Dialog } from "@capacitor/dialog";
import ToastMsg from "../../components/ToastMsg";


const Users: React.FC = () => {
  const history = useHistory();
  const dispatch:any = useDispatch();
  const componentRef = useRef<HTMLIonItemSlidingElement>(null);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      dispatch(getUsers());
      event.detail.complete();
    }, 2000);
  }

  const { isloading, users, error, isUserDeleted } = useSelector(
    (state: any) => {
      return state.user;
    }
  );


  const handleAddUser = () => {
    history.push(`/configuration/users/add`);
  };

  const handleEditUser = (user: any) => {
    history.push(`/configuration/users/edit/${user.UserID}`);
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: "RESET_FORM" });
  }, [dispatch])

  useEffect(() => {
    if (isUserDeleted) {
      dispatch(getUsers());
    }
  }, [dispatch, isUserDeleted]);


  if (error && error.status === -100) {
    history.replace("/sessionexpired");
    return null;
  }

  if (error && error.status === 500) {
    history.replace("/maintenance");
    return null;
  }

  const getRoles = (userRoles: any) => {
    let roles = Object.keys(userRoles).length === 0 ? "NA" : "";
    if (Object.keys(userRoles).length !== 0) {
      for (const key in userRoles) {
        if (userRoles[key] !== 0) {
          roles += key.replace("_access", '') + ", "
        }
      }
      roles = roles.slice(0, roles.length - 2)
    }
    return roles
  }

  const handleDeleteItem = (event: any, userId: string) => {
    event.preventDefault();
    const showConfirm = async () => {
      const { value } = await Dialog.confirm({
        title: "Confirm",
        message: `Are you sure you'd like to delete the item?`,
      });

      if (value) {
        dispatch(deleteUserById(userId));
      }
      componentRef.current?.closeOpened();
    };
    showConfirm();
  };

  const UserList: JSX.Element =
    users && users?.data?.length === 0 ? (
      <NoItemFound />
    ) : (
      <>
        {(users?.data || []).map((user: any, index: number) => (
          <div key={user.UserID}>
            <IonItemSliding ref={componentRef}>
              <IonItem className={`ion-no-padding item-box ${index % 2 === 0 ? "even" : "odd"}`}>
                <IonLabel
                  color="medium"
                  onClick={() => handleEditUser(user)}
                >
                  <h3
                    className="text-wrap"
                    color="secondary"
                    style={{ fontSize: "20px", fontWeight: "normal", textTransform : "capitalize" }}
                  >
                    {user.FirstName + ' ' + user.LastName}
                  </h3>
                  <span style={{ fontSize: "14px" }}>
                    Email :  <span style={{ fontSize: "14px" }}><b>{user.Email}</b></span>
                  </span>
                  <br />
                  <span style={{ fontSize: "14px" }}>
                    Company :  <span style={{ fontSize: "14px" }}><b>{user.CompanyName}</b></span>
                  </span>
                  <br />
                  <span style={{ fontSize: "14px" }}>
                    Access Role: <span style={{ fontSize: "14px", textTransform:'capitalize' }}><b>{getRoles(JSON.parse(user.UserRole))}</b></span>
                  </span>
                </IonLabel>
                <IonButtons slot="end">
                  <IonIcon
                    icon={viewIcon}
                    color="medium"
                    onClick={() => handleEditUser(user)}
                    className="ion-padding-horizontal"
                  />
                </IonButtons>
              </IonItem>
              <IonItemOptions
                side="end"
                onIonSwipe={(e) => handleDeleteItem(e, user.UserID)}
              >
                <IonItemOption color="danger" onClick={(e) => handleDeleteItem(e, user.UserID)}>
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
          <IonText className="header-menu">Users</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" fill="outline" onClick={handleAddUser}>
          Add User
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
            : UserList}
        </IonList>
      </IonContent>
      {isUserDeleted && (
        <ToastMsg
          showToast={isUserDeleted}
          message={"User deleted successfully"}
          type={"green"}
          duration={3000}
        />
      )}
    </IonPage>
  );
};

export default Users;
