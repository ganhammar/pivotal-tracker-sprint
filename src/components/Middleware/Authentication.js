import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

import LoginPage from './../../views/Login';

@observer
class Authenticated extends React.Component {
    render() {
        return this.context.appState.isAuthenticated
            ? this.props.children
            : <LoginPage />;
    }
}

Authenticated.propTypes = {
    children: PropTypes.element
};

Authenticated.contextTypes = {
    appState: PropTypes.object
};

export default Authenticated;
