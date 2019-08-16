/* 应用根组件 */

import React, { Component } from 'react'
import {BrowserRouter,Switch,Route} from "react-router-dom"

import Login from './pages/login/login.jsx';
import Admin from './pages/admin/admin.jsx';


export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Admin}></Route>
        </Switch>
      </BrowserRouter> 
    )
  }
}


