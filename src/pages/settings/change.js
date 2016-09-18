import { inject } from "aurelia-framework";
import { BindingEngine } from "aurelia-binding";
import { Tracker } from "./../../services/tracker";
import { Settings } from "./../../services/settings";
import { FilterAvailableOptionsValueConverter } from "./filter-available-options";

@inject(BindingEngine, Tracker, Settings, FilterAvailableOptionsValueConverter)
export class Change {
  constructor(bindingEngine, tracker, settings, filter) {
    this.bindingEngine = bindingEngine;
    this.tracker = tracker;
    this.settings = settings;
    this.filter = filter;
    this.subscriptions = [];
  }

  activate() {
    this.availableStoryStates = this.filter.toView(this.settings.storyStates,
      this.settings.columns).length > 0;
  }

  deactivate() {
    var subscription;
    while(subscription = this.subscriptions.pop()) {
      subscription.dispose();
    }
  }

  valueArrayChanged(newValue, oldValue) {
    console.log(newValue);
  }

  removeValueFromColumn(value, column) {
    column.value.splice(column.value.indexOf(value), 1);
    
    this.availableStoryStates = this.filter.toView(this.settings.storyStates,
      this.settings.columns).length > 0;
  }

  addValueForColumn(column) {
    if (column.basedOn === "label") {
      return column.value.push("");
    }

    var available = this.filter.toView(this.settings.storyStates,
      this.settings.columns);
    
    if (available && available.length > 0) {
      column.value.push(available[0]);
    }

    this.availableStoryStates = available.length > 1;
  }

  hasEmptyLabel(column) {
    return column.value.find(item => {
      return item.length === 0;
    }) !== undefined;
  }

  back() {
    history.back();
  }
}
