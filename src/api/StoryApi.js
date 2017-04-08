import Base from './Base';

class StoryApi extends Base {
  put (projectId, storyId, body) {
    return this._put(`projects/${projectId}/stories/${storyId}`, body);
  }
}

const storyApi = new StoryApi();

export default storyApi;
