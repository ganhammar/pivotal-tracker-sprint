import React, { PropTypes, Component } from 'react';

import ColumnPieChart from './../components/Statistics/ColumnPieChart';
import TypePieChart from './../components/Statistics/TypePieChart';
import TasksPieChart from './../components/Statistics/TasksPieChart';
import StoryPointBurndownChart from './../components/Statistics/StoryPointBurndownChart';
import Tabs from './../components/Layout/Tabs';
import Tab from './../components/Layout/Tab';
import TrackerStore from './../stores/TrackerStore';

import './../styles/statistics.scss';

class Statistics extends Component {
  render() {
    let burndowns = [];
    let overall = <StoryPointBurndownChart />;

    if (overall) {
      burndowns.push(
        <Tab key={0} name="All Projects">
          <StoryPointBurndownChart />
        </Tab>
      );
    }

    TrackerStore.me.projects.forEach((project) => {
      if (this.context.appState.selectedProjects.indexOf(project.project_id) === -1) {
        return;
      }

      burndowns.push(
        <Tab key={project.project_id} name={project.project_name}>
          <StoryPointBurndownChart key={project.project_id}
            projectId={project.project_id} />
        </Tab>
      );
    });

    return (
      <div id="statistics">
        <div className="statistics__pie">
          <ColumnPieChart />
        </div>
        <div className="statistics__pie">
          <TypePieChart />
        </div>
        <div className="statistics__pie last">
          <TasksPieChart />
        </div>
        <div className="statistics__burndown clear">
          <Tabs>
            {burndowns}
          </Tabs>
        </div>
      </div>
    );
  }
}

Statistics.contextTypes = {
    appState: PropTypes.object
};

export default Statistics;
