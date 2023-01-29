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

  if (!idToken) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Route exact path="/sailing-container/sailing">
        <Sailing />
      </Route>
      <Route exact path="/sailing-container/sailing/add">
        <AddEditSailing isNew={true} />
      </Route>
      <Route exact path="/sailing-container/sailing/edit/:sailId">
        <AddEditSailing isNew={false} />
      </Route>
      <Route exact path="/sailing-container/sailing/report/:sailId">
        <ReportDetail />
      </Route>
      <Route exact path="/sailing-container/sailing/pallet/:sailId">
        <Pallet />
      </Route>
      <Route exact path="/sailing-container/sailing/pallet/add/:sailId">
        <AddEditPallet isNew={true} />
      </Route>
      <Route exact path="/sailing-container/sailing/pallet/edit/:sailId/:palletId">
        <AddEditPallet isNew={false} />
      </Route>
      <Route exact path="/sailing-container/sailing/package/:palletId">
        <Package />
      </Route>
      <Route exact path="/sailing-container/sailing/package/add/:palletId">
        <AddEditPackage isNew={true} />
      </Route>
      <Route exact path="/sailing-container/sailing/package/edit/:palletId/:packageId/:hwbNo">
        <AddEditPackage isNew={false} />
      </Route>
    </>
  );
};

export default ContainerSailingRoute;
