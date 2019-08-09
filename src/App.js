/* 应用根组件 */

import React, { Component } from 'react'
import {HashRouter,Switch,Route} from "react-router-dom"


import Login from './pages/login/login';
import Admin from './pages/admin/admin';


export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/admin" component={Admin}></Route>
        </Switch>
      </HashRouter> 
    )
  }
}


