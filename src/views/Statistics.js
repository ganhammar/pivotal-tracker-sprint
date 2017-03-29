import React, { PropTypes, Component } from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

import TrackerStore from './../stores/TrackerStore';
import { sortStoriesIntoColumns } from './../utils/SortStories';

class Statistics extends Component {
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

    let typeCount = {};
    stories.forEach((story) => {
      if (typeCount[story.story_type] === undefined) {
        typeCount[story.story_type] = 0;
      }

      typeCount[story.story_type]++;
    });

    let typePieData = [];
    let typePieColors = [];
    for (let type in typeCount) {
      if (typeCount.hasOwnProperty(type)) {
        typePieData.push({
          name: type.charAt(0).toUpperCase() + type.slice(1),
          value: typeCount[type]
        });

        switch (type) {
          case "chore":
            typePieColors.push('#2C3E50');
            break;
          case "feature":
            typePieColors.push('#F2C12E');
            break;
          case "release":
            typePieColors.push('#3498DB');
            break;
          case "bug":
            typePieColors.push('#E74C3C');
            break;
        }
      }
    }

    return (
      <div id="statistics">
        <PieChart width={200} height={200}>
          <Pie data={columnPieData} cx={100} cy={100} innerRadius={50}
            outerRadius={100} fill="#82ca9d">
            {
            	columnPieData.map((entry, index) =>
                <Cell key={index} fill={columnPieColors[index % columnPieColors.length]}/>)
            }
          </Pie>
          <Tooltip/>
        </PieChart>
        <PieChart width={200} height={200}>
          <Pie data={typePieData} cx={100} cy={100} innerRadius={50}
            outerRadius={100} fill="#82ca9d">
            {
            	typePieData.map((entry, index) =>
                <Cell key={index} fill={typePieColors[index % typePieColors.length]}/>)
            }
          </Pie>
          <Tooltip/>
        </PieChart>
      </div>
    );
  }
}

Statistics.contextTypes = {
    appState: PropTypes.object
};

export default Statistics;
