import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AuthenticationMiddleware from './components/Middleware/Authentication';

import Layout from './components/Layout';

import Home from './views/Home';
import NotFound from './views/404';

import Login from './views/Login';
import ProjectList from './views/ProjectList';
import SprintBacklog from './views/SprintBacklog';

export default (
    <Route path="/" component={Layout}>
        <IndexRoute component={Home} />
        <Route path="login" component={Login} />
        <Route component={AuthenticationMiddleware}>
          <Route path="project-list" component={ProjectList} />
          <Route path="sprint-backlog" component={SprintBacklog} />
        </Route>
        <Route path="*" component={NotFound} />
    </Route>
);
