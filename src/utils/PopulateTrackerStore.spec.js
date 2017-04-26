import './Test/LocalStorageMock';
import * as PopulateTrackerStore from './PopulateTrackerStore';
import TrackerStore from './../stores/TrackerStore';
import Project from './../api/Project';
jest.mock('./PopulateTrackerStore/PollStories');
import PollStories from './PopulateTrackerStore/PollStories';

describe('PopulateTrackerStore', () => {
  const projectIds = [1, 2];
  const iterations = [{ number: 1, start: '1974-01-03', project_id: 1 }];
  const history = [{ history: 'A Test' }];
  const stories = [{id: 1, name: 'A'}, {id: 2, name: 'B'}, {id: 3, name: 'C'}];

  const populateIterations = PopulateTrackerStore.populateIterations;
  const populateIterationHistory = PopulateTrackerStore.populateIterationHistory;
  const populateStories = PopulateTrackerStore.populateStories;

  it ('fetches iterations and populates store when populateIterations is called', (done) => {
    Project.getCurrentIteration = jest.fn()
      .mockReturnValue(new Promise((resolve) => resolve(iterations)));

    populateIterations()
      .then((iteration) => {
        expect(iteration).toEqual(iterations[0]);
        expect(TrackerStore.iterations.slice(0)).toEqual(iterations);
        done();
      });

    expect(Project.getCurrentIteration.mock.calls.length).toEqual(1);
  });

  it ('fetches iteration history and populates store when populateIterationHistory is called', (done) => {
    Project.getIterationHistory = jest.fn()
      .mockReturnValue(new Promise((resolve) => resolve(history)));

    populateIterationHistory(projectIds[0], iterations[0].number)
      .then((result) => {
        expect(result).toEqual(history);
        expect(TrackerStore.iterationHistory[projectIds[0]]).toEqual(history);
        done();
      });

    expect(Project.getIterationHistory.mock.calls.length).toEqual(1);
    expect(Project.getIterationHistory)
      .toBeCalledWith(projectIds[0], iterations[0].number);
  });

  it ('fetches stories and populates store when populateStories is called', (done) => {
    PollStories.mockImplementation(() => {});
    Project.getCurrentStories = jest.fn()
      .mockReturnValue(new Promise((resolve) => resolve(stories)));

    populateStories(projectIds[0], iterations[0].start)
      .then((result) => {
        expect(result).toEqual(stories);
        expect(TrackerStore.stories.slice(0)).toEqual(stories);
        expect(PollStories.mock.calls.length).toBe(1);
        done();
      });

    expect(Project.getCurrentStories.mock.calls.length).toBe(1);
    expect(Project.getCurrentStories)
      .toBeCalledWith(projectIds[0], iterations[0].start);
  });
});
