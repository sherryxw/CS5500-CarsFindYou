import React from "react";
import { Route, Switch } from "react-router-dom";
import Example from "src/pages/example";
import Profile from "./pages/Profile";
import NavbarComponent from "./pages/NavbarComponent";
import Home from "./pages/home";
import "bootstrap/dist/css/bootstrap.css";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import BuyerManagement from "./pages/BuyerManagement";
import CarManagement from "./pages/cars";
import OfferManagement from "./pages/offers";
import Employees from "./pages/Demand/Employees.js";

const App = () => {
  return (
    <div>
      <NavbarComponent />
      <Switch>
        <ProtectedRoute exact path='/profile/:userId' component={Profile} />
        <Route path={"/management"} exact component={BuyerManagement} />
        <Route
          path={["/management/:postId/offers"]}
          exact
          component={BuyerManagement}
        />
        <Route path={"/cars"} exact component={CarManagement} />
        <Route path={"/offers"} exact component={OfferManagement} />
        <Route exact path='/example'>
          <Example />
        </Route>
        <Route exact path='/demand'>
          <Employees />
        </Route>
        <Route path='/' exact component={Home} />
      </Switch>
    </div>
  );
};

export default App;
