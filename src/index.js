import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router, browserHistory } from 'react-router';

import './styles/light.scss';
import './styles/loader.scss';
import './styles/layout.scss';

import App from './App';
import stateStore from './stores/StateStore';
import stores from './stores';
import routes from './routes';

ReactDOM.render(
    <Provider {...stores}>
        <App appState={stateStore}>
            <Router routes={routes} history={browserHistory} />
        </App>
    </Provider>, document.getElementById('app')
);
