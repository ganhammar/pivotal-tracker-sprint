import React, { PropTypes, Component } from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

import TrackerStore from './../../stores/TrackerStore';

class TypePieChart extends Component {
  render() {
    const stories = TrackerStore.stories;

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
      <PieChart width={200} height={250}>
        <Pie data={typePieData} cx={100} cy={100} innerRadius={50} stroke="none"
          outerRadius={100} fill="#82ca9d">
          {
            typePieData.map((entry, index) =>
              <Cell key={index} fill={typePieColors[index % typePieColors.length]}/>)
          }
        </Pie>
        <Legend />
        <Tooltip/>
      </PieChart>
    );
  }
}

TypePieChart.contextTypes = {
    appState: PropTypes.object
};

export default TypePieChart;
