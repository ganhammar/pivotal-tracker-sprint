import TrackerStore from './../stores/TrackerStore';
import Project from './../api/Project';

import PollStories from './PopulateTrackerStore/PollStories';

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

export function populateIterations(projecId) {
  return Project.getCurrentIteration(projecId)
    .then((iterations) => {
      TrackerStore.iterations.push(iterations[0]);
      return iterations[0];
    });
}

export function populateIterationHistory(projectId, iterationNumber) {
  return Project.getIterationHistory(projectId, iterationNumber)
    .then((history) => {
      TrackerStore.iterationHistory[projectId] = history;
      return history;
    });
}

export function populateStories(projectId, startDate) {
  return Project.getCurrentStories(projectId, startDate)
    .then((stories) => {
      TrackerStore.stories = TrackerStore.stories.concat(stories);
      PollStories();
      return stories;
    });
}

export function populateMembers(projectId) {
  return Project.getMembers(projectId)
    .then((members) => {
      addDistinctMembers(TrackerStore.members, members);
      return members;
    });
}

export function addDistinctMembers(source, members) {
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
