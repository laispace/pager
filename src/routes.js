import React, { PropTypes, Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';
import UserPage from './components/UserPage';
import UsersPage from './components/UsersPage';
import ProjectsPage from './components/ProjectsPage';
import ComponentsPage from './components/ComponentsPage';
import PagePage from './components/PagePage';
import PagesPage from './components/PagesPage';
import PagePreviewPage from './components/PagePreviewPage';
import ComponentPreviewPage from './components/ComponentPreviewPage';
import ComponentDevelopPage from './components/ComponentDevelopPage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';

import normalizeStyles from '../node_modules/normalize.css/normalize.css';
import withStyles from './decorators/withStyles';
@withStyles(normalizeStyles)
class Routes extends Component {
  constructor () {
    super();
    this.state = {
      users: [],
      user: null,
      isAuthenticated: false
    }
    this.getUsers();
    this.checkLogin();
  }
  checkLogin = async () => {
    try {
      const res = await fetch('/api/auth/check/login', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });
      const json = await res.json();
      console.log('checkLogin', json);
      if (json.retcode === 0) {
        this.setState({
          isAuthenticated: json.isAuthenticated,
          user: json.user
        });
        // todo
        window.isAuthenticated =  json.isAuthenticated;
        window.user=  json.user;

        if (!json.isAuthenticated) {
          console.log('not logined');
          window.location.href = "/#/login";
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  logout = async () => {
    window.location.href = '/api/auth/logout';
  };

  getUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();
      console.log('getUsers', json);
      if (json.retcode === 0) {
        this.setState({
          users: json.users
        });
        // todo
        window.users = json.users
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <Router>
        <Route path="/" component={HomePage}></Route>
        <Route path="/login" component={LoginPage}></Route>
        <Route path="/users" onEnter={this.checkLogin} component={UsersPage}></Route>
        <Route path="/users/:id" onEnter={this.checkLogin} component={UserPage}/>

        <Route path="/projects" onEnter={this.checkLogin} component={ProjectsPage}></Route>

        <Route path="/components" onEnter={this.checkLogin} component={ComponentsPage}></Route>

        <Route path="/pages" onEnter={this.checkLogin} component={PagesPage}></Route>
        <Route path="/pages/:id" onEnter={this.checkLogin} component={PagePage}/>

        <Route path="/preview/:id" onEnter={this.checkLogin} component={PagePreviewPage}/>

        <Route path="/develop/:project/:path" onEnter={this.checkLogin} component={ComponentDevelopPage}/>
        <Route path="/componentPreview/:project/:path" onEnter={this.checkLogin} component={ComponentPreviewPage}/>

        <Route path="*" component={NotFoundPage}/>

      </Router>
    );
  }

}

export default Routes;
