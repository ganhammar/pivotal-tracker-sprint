import TrackerStore from './../stores/TrackerStore';
import StateStore from './../stores/StateStore';
import Project from './../api/Project';

export function unsetTrackerStore() {
  TrackerStore.iterations = [];
  TrackerStore.stories = [];
  TrackerStore.members = [];
  TrackerStore.iterationHistory = {};

  if (TrackerStore.polling.stories) {
    clearTimeout(TrackerStore.polling.stories);
  }

  TrackerStore.polling = {};
}

export function populateTrackerStore(projectIds) {
  return new Promise((resolve) => {
    unsetTrackerStore();
    let projectsFetched = 0;

    projectIds.forEach((projectId) => {
      let iterationNumber;

      populateMembers(projectId)
        .then(() => populateIterations(projectId))
        .then((iteration) => {
          iterationNumber = iteration.number;
          return populateStories(projectId, iteration.start);
        })
        .then(() => populateIterationHistory(projectId, iterationNumber))
        .then(() => {
          projectsFetched++;

          if (projectsFetched === projectIds.length) {
            resolve();
          }
        });
    });
  });
}

function populateIterations(projecId) {
  return Project.getCurrentIteration(projecId)
    .then((iterations) => {
      TrackerStore.iterations.push(iterations[0]);
      return iterations[0];
    });
}

function populateIterationHistory(projectId, iterationNumber) {
  return Project.getIterationHistory(projectId, iterationNumber)
    .then((history) => {
      TrackerStore.iterationHistory[projectId] = history;
      return history;
    });
}

function populateStories(projectId, startDate) {
  return Project.getCurrentStories(projectId, startDate)
    .then((stories) => {
      TrackerStore.stories = TrackerStore.stories.concat(stories);
      pollStories();
      return stories;
    });
}

function pollStories() {
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
            updateStories(stories);
            pollStories();
          }
        });
    });
  }, 30000);
}

function updateStories(updates) {
  let current = TrackerStore.stories;
  let i;
  let found;

  updates.forEach((update) => {
    found = false;

    for (i = 0; i < current.length; i++) {
      if (update.id === current[i].id) {
        found = true;

        current[i] = update;
      }
    }

    if (found === false) {
      current.push(update);
    }
  });

  for (i = 0; i < current.length; i++) {
    const story = updates.find((update) => {
      if (update.id === current[i].id) {
        return true;
      }
    });

    if (!story) {
      current.splice(i, 1);
    }
  }

  TrackerStore.stories = current;
}

function populateMembers(projectId) {
  return Project.getMembers(projectId)
    .then((members) => {
      addDistinctMembers(TrackerStore.members, members);
      return members;
    });
}

function addDistinctMembers(source, members) {
  members.forEach((member) => {
    const found = source.some((person) => {
      if (person.id === member.person.id) {
        return person;
      }
    });

    if (!found) {
      source.push(member.person);
    }
  });
}
