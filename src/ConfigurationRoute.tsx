import { Redirect, Route } from "react-router-dom";
import Users from "./pages/User/Users";
import AddEditUser from "./pages/User/UserDetail";
import MyProfile from "./pages/User/MyProfile";
import ChangePaswword from "./pages/User/ChangePassword";

const ConfigurationRoute: React.FC = () => {
  const authToken: any = JSON.parse(
    localStorage.getItem("_authResponse") || "{}"
  );
  const idToken = authToken && authToken.access_token; 

  if (!idToken) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Route exact path="/configuration/my-profile">
        <MyProfile />
      </Route>
      <Route exact path="/configuration/user/change-password">
        <ChangePaswword />
      </Route>
      <Route exact path="/configuration/users">
        <Users />
      </Route>
      <Route exact path="/configuration/users/add">
        <AddEditUser isRegister={false} isNew={true} />
      </Route>
      <Route exact path="/configuration/users/edit/:userId">
        <AddEditUser isRegister={false} isNew={false} />
      </Route>
    </>
  );
};

export default ConfigurationRoute;
