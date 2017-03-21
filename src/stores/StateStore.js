import { observable, computed } from 'mobx';
import { create, persist } from 'mobx-persist';

class StateStore {
  @observable isLoading = true;

  @persist @observable apiToken = undefined;
  @persist('list') @observable selectedProjects = [];
  @persist('list') @observable columnSetup = [
    {
      name: 'Todo',
      config: {
        states: ['planned']
      }
    },
    {
      name: 'Doing',
      config: {
        states: ['started']
      }
    },
    {
      name: 'Testing',
      config: {
        states: ['finished']
      }
    },
    {
      name: 'Done',
      config: {
        states: ['accepted', 'delivered']
      }
    },
    {
      name: 'Impedements',
      config: {
        states: ['rejected'],
        labels: ['install_tool']
      }
    }
  ];

  @computed get isAuthenticated() {
    return this.apiToken !== undefined;
  }
}

const hydrate = create({});
const stateStore = new StateStore();

hydrate('stateStore', stateStore)
    .then(() => stateStore.isLoading = false);

export default stateStore;
