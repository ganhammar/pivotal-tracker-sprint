import { browserHistory } from 'react-router';

import React, { PropTypes } from 'react';

class Home extends React.Component {
  componentWillMount() {
    if (this.context.appState.isAuthenticated) {
      if (this.context.appState.selectedProjects.length > 0) {
        browserHistory.push('/sprint-backlog');
      } else {
        browserHistory.push('/project-list');
      }
    }
  }

  render() {
    return <div>Hejpa!</div>;
  }
}

Home.contextTypes = {
    appState: PropTypes.object
};

export default Home;
