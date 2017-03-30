import React, { PropTypes, Component } from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

import ColumnPieChart from './../components/Statistics/ColumnPieChart';
import TypePieChart from './../components/Statistics/TypePieChart';
import BurndowChart from './../components/Statistics/BurndownChart';

class Statistics extends Component {
  render() {
    let burndowns = [];

    this.context.appState.selectedProjects.forEach((projectId) => {
      burndowns.push(<BurndowChart key={projectId} projectId={projectId} />);
    })

    return (
      <div id="statistics">
        <ColumnPieChart />
        <TypePieChart />
        <BurndowChart />
        {burndowns}
      </div>
    );
  }
}

Statistics.contextTypes = {
    appState: PropTypes.object
};

export default Statistics;
