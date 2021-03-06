import { observable, computed } from 'mobx';
import { create, persist } from 'mobx-persist';

class StateStore {
  @observable isLoading = true;

  availableDoneStates = ['finished', 'delivered', 'accepted'];
  defaultDoneState = 'delivered';
  defaultTheme = 'light';
  defaultColumnSetup = [
    {
      name: 'Todo',
      isVisible: true,
      config: {
        states: ['planned']
      }
    },
    {
      name: 'Doing',
      isVisible: true,
      config: {
        states: ['started']
      }
    },
    {
      name: 'Testing',
      isVisible: true,
      config: {
        states: ['finished']
      }
    },
    {
      name: 'Done',
      isVisible: true,
      config: {
        states: ['accepted', 'delivered']
      }
    },
    {
      name: 'Impediments',
      isVisible: true,
      config: {
        states: ['rejected'],
        labels: ['_blocked']
      }
    }
  ];

  @persist @observable doneState = this.defaultDoneState;
  @persist @observable theme = this.defaultTheme;
  @persist @observable apiToken = undefined;
  @persist('list') @observable selectedProjects = [];
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
