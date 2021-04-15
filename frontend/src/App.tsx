import React from "react";
import { Button } from "@material-ui/core";
import { Route, Switch, useHistory } from "react-router-dom";
import Example from "src/pages/example";
import Profile from "./pages/Profile";
import NavbarComponent from "./pages/NavbarComponent";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.css";

const App = () => {
  const history = useHistory();

  return (
    <div>
      <NavbarComponent/>
      <Switch>
        <Route path="/home" exact component={Home}/>
        <Route path="/profile/:userId" exact component={Profile}/>
        <Route exact path='/example'>
          <Example />
        </Route>
        <Route path='/'>
          hello world
          <br />
          <Button
            variant='outlined'
            onClick={() => {
              history.push("/example");
            }}
          >
            Jump to example page
          </Button>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
