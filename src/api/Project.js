import Base from './Base';

class Project extends Base {
  getById(id) {
    return this._get(`projects/${id}`);
  }

  getCurrent(id) {
    return this.getCurrentIteration(id)
      .then((result) => this.getCurrentStories(id, result[0].start));
  }

  getCurrentIteration(id) {
    return this._get(`projects/${id}/iterations`,
      { scope: 'current_backlog', limit: 1 });
  }

  getCurrentStories(id, currentIterationStartDate) {
    return this._get(`projects/${id}/stories`,
      {
        fields: ':default,tasks',
        filter: `state:planned,started,finished,delivered,rejected OR ` +
          `(state:accepted AND accepted_after:${currentIterationStartDate})`
      });
  }

  getMembers(projectId) {
    return this._get(`projects/${projectId}/memberships`);
  }
}

const project = new Project();

export default project;
