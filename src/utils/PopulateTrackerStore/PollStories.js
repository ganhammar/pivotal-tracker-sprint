import TrackerStore from './../../stores/TrackerStore';
import StateStore from './../../stores/StateStore';
import Project from './../../api/Project';

import UpdateStories from './UpdateStories';

export default function PollStories() {
  setTimeout(() => {
    let stories = [];
    let updatedProjects = 0;
    let projects = StateStore.selectedProjects.slice(0);

    projects.forEach((projectId) => {
      let startDate;
      TrackerStore.iterations.slice(0).forEach((iteration) => {
        if (projectId === iteration.project_id) {
          startDate = iteration.start;
        }
      });

      Project.getCurrentStories(projectId, startDate)
        .then((result) => {
          updatedProjects++;
          stories = stories.concat(result);

          if (updatedProjects === projects.length) {
            UpdateStories(stories);
            PollStories();
          }
        });
    });
  }, 30000);
}
