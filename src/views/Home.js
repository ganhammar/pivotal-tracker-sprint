import React, { PropTypes, Component } from 'react';
import { Link, browserHistory } from 'react-router';

class Home extends Component {
  componentWillMount() {
    if (this.context.appState.isAuthenticated) {
      if (this.context.appState.selectedProjects.length > 0) {
        browserHistory.push('/stories-overview');
      } else {
        browserHistory.push('/project-list');
      }
    }
  }

  render() {
    return (
      <div id="home">
        <h1>Pivotal Tracker Sprint Dashboard</h1>
        <p>Pivotal Tracker Sprint Dashboard is an application that gives you
        an overview of the ongoing iteration.</p>
        <p><Link to="/login">Login</Link> using your <a href="https://www.pivotaltracker.com/">
        PivotalTracker</a> credentials and try it out.</p>
      </div>
    );
  }
}

Home.contextTypes = {
    appState: PropTypes.object
};

export default Home;
