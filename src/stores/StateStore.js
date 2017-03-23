import { observable, computed } from 'mobx';
import { create, persist } from 'mobx-persist';

class StateStore {
  @observable isLoading = true;

  @persist @observable apiToken = undefined;
  @persist('list') @observable selectedProjects = [];
  defaultColumnSetup = [
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
      name: 'Impediments',
      config: {
        states: ['rejected'],
        labels: ['_blocked']
      }
    }
  ];
  @persist('list') @observable columnSetup = this.defaultColumnSetup;

  @computed get isAuthenticated() {
    return this.apiToken !== undefined;
  }
}

const hydrate = create({});
const stateStore = new StateStore();

hydrate('stateStore', stateStore)
    .then(() => stateStore.isLoading = false);

export default stateStore;
