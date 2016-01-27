import React, { PropTypes, Component } from 'react';
import { Router, Route, Link } from 'react-router'

import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';
import ProjectsPage from './components/ProjectsPage';
import ComponentsPage from './components/ComponentsPage';
import PagePage from './components/PagePage';
import PagesPage from './components/PagesPage';
import PagePreviewPage from './components/PagePreviewPage';
import ComponentPreviewPage from './components/ComponentPreviewPage';
import ComponentDevelopPage from './components/ComponentDevelopPage';
import HomePage from './components/HomePage';

import normalizeStyles from '../node_modules/normalize.css/normalize.css';
import withStyles from './decorators/withStyles';
@withStyles(normalizeStyles)
class Routes extends Component {
  render() {

    return (
      <Router>

        <Route path="/" component={HomePage}></Route>

        <Route path="/projects" component={ProjectsPage}></Route>

        <Route path="/components" component={ComponentsPage}></Route>

        <Route path="/pages" component={PagesPage}></Route>
        <Route path="/pages/:id" component={PagePage}/>

        <Route path="/preview/:id" component={PagePreviewPage}/>

        <Route path="/develop/:project/:path" component={ComponentDevelopPage}/>
        <Route path="/componentPreview/:project/:path" component={ComponentPreviewPage}/>

        <Route path="*" component={NotFoundPage}/>

      </Router>
    );
  }

}

export default Routes;
