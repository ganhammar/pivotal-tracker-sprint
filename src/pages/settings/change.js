import { inject } from "aurelia-framework";
import { Tracker } from "./../../services/tracker";
import { Settings } from "./../../services/settings";

@inject(Tracker, Settings)
export class Change {
  constructor(tracker, settings) {
    this.tracker = tracker;
    this.settings = settings;
  }

  back() {
    history.back();
  }
}
