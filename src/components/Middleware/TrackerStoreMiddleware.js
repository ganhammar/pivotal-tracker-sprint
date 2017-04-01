import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';

import Loading from './../Loading';
import TrackerStore from './../../stores/TrackerStore';
import { populateTrackerStore } from './../../utils/PopulateTrackerStore';

class TrackerStoreMiddleware extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true
    };
  }

  componentWillMount() {
    if (this.context.appState.selectedProjects.length === 0) {
      return browserHistory.push('/project-list');
    }

    if (TrackerStore.members.length === 0 && TrackerStore.iterations.length === 0 &&
        TrackerStore.stories.length === 0) {
      populateTrackerStore(this.context.appState.selectedProjects)
        .then(() => {
          this.setState({ isLoading: false });
        });
    } else {
      this.setState({ isLoading: false });
    }
  }

  render() {
    return this.state.isLoading === true
      ? <Loading />
      : this.props.children;
  }
}

TrackerStoreMiddleware.propTypes = {
    children: PropTypes.element
};

TrackerStoreMiddleware.contextTypes = {
    appState: PropTypes.object
};

export default TrackerStoreMiddleware;
