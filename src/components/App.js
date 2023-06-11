import React from "react";
import Signup from "./Signup";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import '../styles/common.css'; // Create this file for custom styles
import Dashboard from "./Dashboard";
import Login from "./Login/Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import SideMenu from "./SideMenu/SideMenu";
import UsersPage from "../Pages/UsersPage";

function App() {
  const location = useLocation(); //removed brackets
  return (
    <div>
      <Router>
        {(location.pathname != "/login" && location.pathname != "/signup" && location.pathname != "/forgot-password")  && <SideMenu />}
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100">
            <AuthProvider>
              <Switch>
                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute
                  path="/update-profile"
                  component={UpdateProfile}
                />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/users" component={UsersPage} />
              </Switch>
            </AuthProvider>
          </div>
        </Container>
      </Router>
    </div>
  );
}

export default App;
