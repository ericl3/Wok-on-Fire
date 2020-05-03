import React from 'react';
import logo from './logo.svg';
import './App.css';

// Pages
import Home from '../src/pages/Home';

// Tools
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path = "/" component = { Home } />
      </Switch>
    </Router>
  );
}

export default App;
