import React, { PropTypes, Component } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import TrackerStore from './../../stores/TrackerStore';

class BurndowChart extends Component {
  render() {
    const history = TrackerStore.iterationHistory;
    const stories = TrackerStore.stories;
    const iterations = TrackerStore.iterations;
    let storyPoints = 0;
    let startDate;
    let endDate;
    let length;
    let data = [];
    let remainMap = {};

    stories.forEach((story) => {
      if ((!this.props.projectId || story.project_id === this.props.projectId)
          && story.estimate) {
        storyPoints += story.estimate;
      }
    });

    iterations.forEach((iteration) => {
      if (!length || iteration.length === length) {
        length = iteration.length;
      } else {
        length = false;
      }

      if ((!startDate && !endDate) || (startDate === iteration.start &&
          endDate === iteration.finish)) {
        startDate = iteration.start;
        endDate = iteration.finish;
      } else {
        startDate = false;
      }
    });

    if (!startDate && !length) {
      return null;
    }

    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      let currentDate = new Date(startDate.toString());
      while (currentDate <= endDate) {
        if (currentDate.toString() === startDate.toString()) {
          data.push({ name: currentDate, 'Story Points': storyPoints });
        } else if (currentDate.toString() === endDate.toString()) {
          data.push({ name: currentDate.getDate(), 'Story Points': 0 });
        } else {
          data.push({ name: currentDate.getDate() });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      let current = 0;
      while (current <= length * 7) {
        current++;
        if (current === 1) {
          data.push({ name: current, 'Story Points': storyPoints });
        } else if (current === length * 7) {
          data.push({ name: current, 'Story Points': 0 });
        } else {
          data.push({ name: current });
        }
      }
    }

    for (let projectId in history) {
      if (history.hasOwnProperty(projectId)) {
        if (!this.props.projectId || projectId === this.props.projectId) {
          history[projectId].data.forEach((point) => {
            if (remainMap[point[0]] === undefined) {
              remainMap[point[0]] = 0;
            }
            if (this.context.doneState === 'finished') {
              remainMap[point[0]] += point[1] + point[2] + point[3];
            } else if (this.context.doneState === 'delivered') {
              remainMap[point[0]] += point[1] + point[2];
            } else {
              remainMap[point[0]] += point[1];
            }
          });
        }
      }
    }

    for (let date in remainMap) {
      if (remainMap.hasOwnProperty(date)) {
        //remain.push({ name: date, 'Story Points': remainMap[date] });
      }
    }

    return (
      <LineChart width={600} height={200} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line connectNulls={true} type='monotone' dataKey='Story Points' stroke='#8884d8'
          fill='#8884d8' />
      </LineChart>
    );
  }
}

BurndowChart.propTypes = {
  projectId: PropTypes.number
}

BurndowChart.contextTypes = {
  appState: PropTypes.object
};

export default BurndowChart;
