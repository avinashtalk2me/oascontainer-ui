import { Redirect, Route } from "react-router-dom";

import Delivery from "./pages/Delivery/Delivery";
import AddEditDelivery from "./pages/Delivery/AddEditDelivery";
import Location from "./pages/Delivery/Location";
import AddEditLocation from "./pages/Delivery/AddEditLocation";
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
        <AddEditDelivery isNew={true} isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/delivery-container/delivery/edit/:deliveryId">
        <AddEditDelivery isNew={false} isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/delivery-container/location/:deliveryId" >
        <Location isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/delivery-container/location/add/:deliveryId">
        <AddEditLocation isNew={true} isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/delivery-container/location/edit/:deliveryId/:locationId">
        <AddEditLocation isNew={false} isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/delivery-container/dropoffpackages/:deliveryId/:locationId">
        <DeliveryDropOff isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/delivery-container/dropoffpackages/add/:deliveryId/:locationId">
        <AddEditDeliveryDropOff isNew={true} isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/delivery-container/dropoffpackages/edit/:locationId/:packageId/:hwbNo">
        <AddEditDeliveryDropOff isNew={false} isEditAllowed={isEditAllowed} />
      </Route>
    </>
  );
};

export default ContainerDeliveryRoute;
