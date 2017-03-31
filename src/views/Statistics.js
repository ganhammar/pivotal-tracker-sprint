import React, { PropTypes, Component } from 'react';

import ColumnPieChart from './../components/Statistics/ColumnPieChart';
import TypePieChart from './../components/Statistics/TypePieChart';
import StoryPointBurndownChart from './../components/Statistics/StoryPointBurndownChart';

class Statistics extends Component {
  render() {
    let burndowns = [];

    this.context.appState.selectedProjects.forEach((projectId) => {
      burndowns.push(<StoryPointBurndownChart key={projectId} projectId={projectId} />);
    });

    return (
      <div id="statistics">
        <ColumnPieChart />
        <TypePieChart />
        <StoryPointBurndownChart />
        {burndowns}
      </div>
    );
  }
}

Statistics.contextTypes = {
    appState: PropTypes.object
};

export default Statistics;
