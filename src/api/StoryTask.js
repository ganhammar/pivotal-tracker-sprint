import Base from './Base';

class Task extends Base {
  put (projectId, storyId, taskId, body) {
    return this._put(`projects/${projectId}/stories/${storyId}/tasks/${taskId}`,
      body);
  }

  post (projectId, storyId, body) {
    return this._post(`projects/${projectId}/stories/${storyId}/tasks`,
      body);
  }

  delete (projectId, storyId, taskId) {
    return this._delete(`projects/${projectId}/stories/${storyId}/tasks/${taskId}`);
  }
}

const task = new Task();

export default task;
