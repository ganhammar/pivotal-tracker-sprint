import './../Test/LocalStorageMock';
import PollStories from './PollStories';
import TrackerStore from './../../stores/TrackerStore';
import Project from './../../api/Project';
import StateStore from './../../stores/StateStore';

describe('PopulateTrackerStore', () => {
  const projectIds = [1, 2];
  const iterations = [{ number: 1, start: '1974-01-03', project_id: 1 }];
  const stories = [{id: 1, name: 'A'}, {id: 2, name: 'B'}, {id: 3, name: 'C'}];

  it ('polls stories at frequency', () => {
      jest.useFakeTimers();

      StateStore.selectedProjects = [projectIds[0]];
      TrackerStore.iterations = iterations;

      Project.getCurrentStories = jest.fn()
        .mockReturnValue(new Promise((resolve) => resolve(stories)));

      PollStories();

      expect(Project.getCurrentStories).not.toBeCalled();
      expect(setTimeout.mock.calls.length).toBe(1);

      jest.runOnlyPendingTimers();

      expect(Project.getCurrentStories.mock.calls.length).toBe(1);
      expect(Project.getCurrentStories)
        .toBeCalledWith(projectIds[0], iterations[0].start);
  });
});
