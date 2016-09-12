export class Busy {
  constructor() {
    this.isBusy = false;
  }

  on() {
    this.isBusy = true;
  }

  off() {
    this.isBusy = false;
  }
}
