import React, { PropTypes, Component } from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

import TrackerStore from './../../stores/TrackerStore';
import { sortStoriesIntoColumns } from './../../utils/SortStories';

class TasksPieChart extends Component {
  render() {
    const stories = TrackerStore.stories;
    const colors = ['#77AE3C', '#E13923'];
    let doneCount = 0;
    let notDoneCount = 0;

    stories.forEach((story) => {
      story.tasks.forEach((task) => {
        if (task.complete) {
          doneCount++;
        } else {
          notDoneCount++;
        }
      });
    });

    const data = [
      { name: 'Done', value: doneCount },
      { name: 'Not Done', value: notDoneCount }
    ];

    return (
      <PieChart width={200} height={250}>
        <Pie data={data} cx={100} cy={100} innerRadius={50} stroke="none"
          outerRadius={100} fill="#82ca9d">
          {
            data.map((entry, index) =>
              <Cell key={index} fill={colors[index % colors.length]}/>)
          }
        </Pie>
        <Legend />
        <Tooltip/>
      </PieChart>
    );
  }
}

TasksPieChart.contextTypes = {
    appState: PropTypes.object
};

export default TasksPieChart;
