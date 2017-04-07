import Base from './Base';

class CommentApi extends Base {
  post (projectId, storyId, body) {
    return this._post(`projects/${projectId}/stories/${storyId}/comments`,
      body);
  }
}

const commentApi = new CommentApi();

export default commentApi;
