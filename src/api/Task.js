import Base from './Base';

class Task extends Base {
  put (projectId, storyId, taskId, body) {
    return this._put(`projects/${projectId}/stories/${storyId}/tasks/${taskId}`,
      body);
  }
}

const task = new Task();

export default task;
