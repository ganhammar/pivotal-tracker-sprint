import React, { PropTypes, Component } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import Moment from 'moment';

import TrackerStore from './../../stores/TrackerStore';

class StoryPointBurndownChart extends Component {
  render() {
    const history = TrackerStore.iterationHistory;
    const stories = TrackerStore.stories;
    const iterations = TrackerStore.iterations;
    let storyPoints = 0;
    let startDate;
    let endDate;
    let length;
    let data = [];
    let remain = [];

    stories.forEach((story) => {
      if ((!this.props.projectId || story.project_id === this.props.projectId)
          && story.estimate) {
        storyPoints += story.estimate;
      }
    });
    let remainingStoryPoints = storyPoints;

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

    for (let projectId in history) {
      if (history.hasOwnProperty(projectId)) {
        if (!this.props.projectId || parseInt(projectId) === this.props.projectId) {
          history[projectId].data.forEach((point, index) => {
            if (remain[index] === undefined) {
              remain[index] = 0;
            }
            if (this.context.doneState === 'finished') {
              remain[index] += point[1] + point[2] + point[3];
            } else if (this.context.doneState === 'delivered') {
              remain[index] += point[1] + point[2];
            } else {
              remain[index] += point[1];
            }
          });
        }
      }
    }

    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      let currentDate = new Date(startDate.toString());
      let index = 0;
      while (currentDate <= endDate) {
        remainingStoryPoints -= remain[index] || 0;
        let currentRemain = typeof remain[index] === 'number'
          ? remainingStoryPoints : null;
        const dateString = Moment(currentDate).format('L');

        if (currentDate.toString() === startDate.toString()) {
          data.push({ name: dateString, Ideal: storyPoints, Remain: currentRemain });
        } else if (currentDate.toString() === endDate.toString()) {
          data.push({ name: dateString, Ideal: 0, Remain: currentRemain });
        } else {
          data.push({ name: dateString, Ideal: null, Remain: currentRemain });
        }

        currentDate.setDate(currentDate.getDate() + 1);
        index++;
      }
    } else {
      let current = 0;
      while (current <= length * 7) {
        remainingStoryPoints -= remain[current] || 0;
        let currentRemain = typeof remain[current] === 'number' ? remainingStoryPoints : null;
        current++;

        if (current === 1) {
          data.push({ name: current, Ideal: storyPoints, Remain: currentRemain });
        } else if (current === length * 7) {
          data.push({ name: current, Ideal: 0, Remain: currentRemain });
        } else {
          data.push({ name: current, Ideal: null, Remain: currentRemain });
        }
      }
    }

    return (
      <LineChart width={760} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line connectNulls={true} type="monotone" dataKey="Ideal"
          stroke="#8884d8" fill="#8884d8" />
        <Line connectNulls={true} type="monotone" dataKey="Remain"
          stroke="#82ca9d" fill="#82ca9d" />
      </LineChart>
    );
  }
}

StoryPointBurndownChart.propTypes = {
  projectId: PropTypes.number
};

StoryPointBurndownChart.contextTypes = {
  appState: PropTypes.object
};

export default StoryPointBurndownChart;
