import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

import Me from './../../api/Me';
import LoginPage from './../../views/Login';
import Loading from './../Loading';
import TrackerStore from './../../stores/TrackerStore';

@observer
class Authenticated extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: true
    };
  }

  componentWillMount() {
    if (this.context.appState.isAuthenticated === false) {
      return this.setState({isLoading: false});
    }

    Me.get().then((result) => {
      TrackerStore.me = result;
      this.setState({isLoading: false});
    });
  }

  render() {
    if (this.state.isLoading === true) {
      return <Loading />;
    }

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
