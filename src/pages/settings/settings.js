import { inject } from "aurelia-framework";
import { Tracker } from "./../../services/tracker";

@inject(Tracker)
export class Settings {
  constructor(tracker) {
    this.tracker = tracker;
  }

  back() {
    history.back();
  }
}
