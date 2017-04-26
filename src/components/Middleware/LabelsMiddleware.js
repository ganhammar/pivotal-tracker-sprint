import React, { PropTypes, Component } from 'react';

import LabelApi from './../../api/LabelApi';
import Loading from './../Loading';

class LabelsMiddleware extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      labels: []
    };
  }

  getChildContext() {
    return { labels: this.state.labels };
  }

  componentWillMount() {
    let projectsFetched = 0;
    let labels = [];

    this.context.appState.selectedProjects.forEach((projectId) => {
      LabelApi.get(projectId)
        .then((result) => {
          labels = labels.concat(result);
          projectsFetched++;

          if (projectsFetched === this.context.appState.selectedProjects.length) {
            this.setState({isLoading: false, labels: labels});
          }
        });
    });
  }

  render() {
    return this.state.isLoading === true
      ? <Loading />
      : this.props.children;
  }
}

LabelsMiddleware.childContextTypes = {
    labels: PropTypes.array
};

LabelsMiddleware.propTypes = {
    children: PropTypes.element
};

LabelsMiddleware.contextTypes = {
    appState: PropTypes.object
};

export default LabelsMiddleware;
