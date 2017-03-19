import { observable } from 'mobx';

class TrackerStore {
    @observable me = {};
    @observable stories = [];
    @observable members = [];
    @observable validStates = ['planned', 'started', 'finished', 'delivered',
      'accepted', 'rejected'];
    @observable columnSetup = [
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
          labels: ['_blocked']
        }
      }
    ];
}

const trackerStore = new TrackerStore();

export default trackerStore;
