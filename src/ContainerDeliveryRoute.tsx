import { Redirect, Route } from "react-router-dom";
 
import Delivery from "./pages/Delivery/Delivery";
import AddEditDelivery from "./pages/Delivery/AddEditDelivery";
// import ReportDetail from "./pages/Sailing/ReportDetail";
import DeliveryDropOff from "./pages/Delivery/DeliveryDropOff";
import AddEditDeliveryDropOff from "./pages/Delivery/AddEditDeliveryDropOff";

const ContainerDeliveryRoute: React.FC = () => {
  const authToken: any = JSON.parse(
    localStorage.getItem("_authResponse") || "{}"
  );
  const idToken = authToken && authToken.access_token;
  const userRoles = authToken && authToken.userRoles;
  const isEditAllowed = (userRoles.delivery_access === 2 || userRoles.sailing_access === 2) ? false : true

  if (!idToken) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Route exact path="/delivery-container/delivery">
        <Delivery isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/delivery-container/delivery/add">
        <AddEditDelivery isNew={true} />
      </Route>
      <Route exact path="/delivery-container/delivery/edit/:deliveryId">
        <AddEditDelivery isNew={false} />
      </Route>
      {/* <Route exact path="/container-sail/sailing/report/:sailId">
        <ReportDetail />
      </Route>
      <Route exact path="/container-sail/pallet/:sailId">
        <Pallet />
      </Route>
      <Route exact path="/container-sail/sail/sail/sail/pallet/add/:sailId">
        <AddEditPallet isNew={true} />
      </Route>
      <Route exact path="/container-sail/pallet/edit/:sailId/:palletId">
        <AddEditPallet isNew={false} />
      </Route> */}
      <Route exact path="/delivery-container/delivery/dropoffpackages/:deliveryId">
        <DeliveryDropOff />
      </Route>
      <Route exact path="/delivery-container/delivery/dropoffpackages/add/:palletId">
        <AddEditDeliveryDropOff isNew={true} />
      </Route>
      <Route exact path="/container-sail/delivery/dropoffpackages/edit/:palletId/:packageId">
        <AddEditDeliveryDropOff isNew={false} />
      </Route>
    </>
  );
};

export default ContainerDeliveryRoute;
