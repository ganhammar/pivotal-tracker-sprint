import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

import Loading from './components/Loading';

@observer
class App extends React.Component {
  getChildContext() {
    return { appState: this.props.appState };
  }

  render() {
    return this.props.appState.isLoading === true
      ? <Loading />
      : this.props.children;
  }
}

App.propTypes = {
    children: PropTypes.object,
    appState: PropTypes.object
};

App.childContextTypes = {
    appState: PropTypes.object
};

export default App;
