import React, { PropTypes, Component } from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

import ColumnPieChart from './../components/Statistics/ColumnPieChart';
import TypePieChart from './../components/Statistics/TypePieChart';

class Statistics extends Component {
  render() {
    return (
      <div id="statistics">
        <ColumnPieChart />
        <TypePieChart />
      </div>
    );
  }
}

Statistics.contextTypes = {
    appState: PropTypes.object
};

export default Statistics;
