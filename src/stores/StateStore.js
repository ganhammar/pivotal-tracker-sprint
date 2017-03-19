import { observable, computed } from 'mobx';
import { create, persist } from 'mobx-persist';

class StateStore {
  @observable isLoading = true;

  @persist @observable apiToken = undefined;
  @persist('list') @observable selectedProjects = [];

  @computed get isAuthenticated() {
    return this.apiToken !== undefined;
  }
}

const hydrate = create({});
const stateStore = new StateStore();

hydrate('stateStore', stateStore)
    .then(() => stateStore.isLoading = false);

export default stateStore;
