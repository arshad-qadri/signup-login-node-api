import { Route, Switch } from "react-router-dom";
import "./App.css";
import ChangePasswod from "./components/ChangePasswod";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import Signup from "./components/Signup";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/resetpassword" component={ResetPassword} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/change-password/:id/:token" component={ChangePasswod} />
      </Switch>
    </div>
  );
}

export default App;
