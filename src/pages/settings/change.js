import { inject } from "aurelia-framework";
import { Tracker } from "./../../services/tracker";
import { Settings } from "./../../services/settings";

@inject(Tracker, Settings)
export class Change {
  constructor(tracker, settings) {
    this.tracker = tracker;
    this.settings = settings;
  }

  removeValueFromColumn(value, column) {
    column.value.splice(column.value.indexOf(value));
  }

  addValueForColumn(column) {
    this.settings.storyStates.forEach(item => {
      var valid = true;

      this.settings.columns.forEach(col => {
        
      })
    });
  }

  back() {
    history.back();
  }
}
