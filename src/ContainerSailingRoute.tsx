import { Redirect, Route } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";

import Sailing from "./pages/Sailing/Sailing";
import Pallet from "./pages/Sailing/Pallet";
import Package from "./pages/Sailing/Package";
import AddEditPackage from "./pages/Sailing/AddEditPackage";
import AddEditSailing from "./pages/Sailing/AddEditSailing";
import AddEditPallet from "./pages/Sailing/AddEditPallet";
import ReportDetail from "./pages/Sailing/ReportDetail";

const ContainerSailingRoute: React.FC = () => {
  const authToken: any = JSON.parse(
    localStorage.getItem("_authResponse") || "{}"
  );
  const idToken = authToken && authToken.access_token;
  const userRoles = authToken && authToken.userRoles;
  const isEditAllowed = userRoles && (userRoles.delivery_access === 2 || userRoles.sailing_access === 2) ? false : true

  if (!idToken) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Route exact path="/sailing-container/sails">
        <Sailing isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/sailing-container/sailing/add">
        <AddEditSailing isNew={true}  isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/sailing-container/sailing/edit/:sailId">
        <AddEditSailing isNew={false} isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/sailing-container/report/:sailId">
        <ReportDetail />
      </Route>
      <Route exact path="/sailing-container/pallet/:sailId">
        <Pallet isEditAllowed={isEditAllowed}  />
      </Route>
      <Route exact path="/sailing-container/pallet/add/:sailId">
        <AddEditPallet isNew={true}  isEditAllowed={isEditAllowed}/>
      </Route>
      <Route exact path="/sailing-container/pallet/edit/:sailId/:palletId">
        <AddEditPallet isNew={false} isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/sailing-container/package/:palletId">
        <Package isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/sailing-container/package/add/:palletId">
        <AddEditPackage isNew={true} isEditAllowed={isEditAllowed} />
      </Route>
      <Route exact path="/sailing-container/package/edit/:palletId/:packageId/:hwbNo">
        <AddEditPackage isNew={false}  isEditAllowed={isEditAllowed} />
      </Route>
    </>
  );
};

export default ContainerSailingRoute;
