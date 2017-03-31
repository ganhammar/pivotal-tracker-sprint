import React, { PropTypes, Component } from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

import TrackerStore from './../../stores/TrackerStore';
import { sortStoriesIntoColumns } from './../../utils/SortStories';

class ColumnPieChart extends Component {
  render() {
    const stories = TrackerStore.stories;
    const sorted = sortStoriesIntoColumns(stories,
      this.context.appState.columnSetup);
    const columnPieData = [];
    const columnPieColors = ['#1EBDE8', '#41FFE9', '#2FE894', '#34FF5D',
      '#3493FF'];

    for (let name in sorted) {
      if (sorted.hasOwnProperty(name)) {
        columnPieData.push({ name: name, value: sorted[name].length });
      }
    }

    return (
      <PieChart width={200} height={250}>
        <Pie data={columnPieData} cx={100} cy={100} innerRadius={50}
          outerRadius={100} fill="#82ca9d">
          {
            columnPieData.map((entry, index) =>
              <Cell key={index} fill={columnPieColors[index % columnPieColors.length]}/>)
          }
        </Pie>
        <Legend />
        <Tooltip/>
      </PieChart>
    );
  }
}

ColumnPieChart.contextTypes = {
    appState: PropTypes.object
};

export default ColumnPieChart;
