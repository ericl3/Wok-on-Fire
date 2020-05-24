import React from 'react';
import logo from './logo.svg';
import './App.css';

// Pages
import Home from '../src/pages/Home';
import Order from '../src/pages/Order'
import OrderConfirmation from '../src/pages/OrderConfirmation'

// Tools
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path = "/" component = { Home } />
          <Route exact path = "/order" component = { Order } />
          <Route exact path = "/order-confirmation" component = {OrderConfirmation}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
