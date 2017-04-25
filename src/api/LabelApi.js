import Base from './Base';

class LabelApi extends Base {
  get (projectId) {
    return this._get(`projects/${projectId}/labels`);
  }
}

const labelApi = new LabelApi();

export default labelApi;
