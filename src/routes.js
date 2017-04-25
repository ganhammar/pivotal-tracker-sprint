import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AuthenticationMiddleware from './components/Middleware/Authentication';
import TrackerStoreMiddleware from './components/Middleware/TrackerStoreMiddleware';
import LabelsMiddleware from './components/Middleware/LabelsMiddleware';

import Layout from './components/Layout';

import Home from './views/Home';
import NotFound from './views/404';

import Login from './views/Login';

import ProjectList from './views/ProjectList';
import StoriesOverview from './views/StoriesOverview';
import Statistics from './views/Statistics';
import Settings from './views/Settings';

export default (
    <Route path="/" component={Layout}>
        <IndexRoute component={Home} />
        <Route path="login" component={Login} />
        <Route component={AuthenticationMiddleware}>
          <Route path="project-list" component={ProjectList} />
          <Route component={TrackerStoreMiddleware}>
            <Route path="stories-overview" component={StoriesOverview} />
            <Route path="statistics" component={Statistics} />
          </Route>
          <Route component={LabelsMiddleware}>
            <Route path="settings" component={Settings} />
          </Route>
        </Route>
        <Route path="*" component={NotFound} />
    </Route>
);
