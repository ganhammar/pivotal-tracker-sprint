import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Tracker } from "./../../services/tracker";
import { Settings } from "./../../services/settings";

@inject(Router, Tracker, Settings)
export class Sprint {
  constructor(router, tracker, settings) {
    this.columns = settings.columns;
    this.router = router;
    this.tracker = tracker;
    this.iteration = {};
    this.timeout = null;
    this.pollInterval = 60000;
    this.users = [];
  }

  activate(params, routeConfig) {
    this.tracker.projectId = this.projectId = params.id;
    this.tracker.getUsers()
      .then(users => this.users = users)
      .catch(error => this.router.navigate(""));
    this.startPoll();
  }

  deactivate() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  getUser(userId) {
    userId = parseInt(userId);

    for (var i = 0; i < this.users.length; i++) {
      var user = this.users[i];

      if (userId === user.person.id) {
        return user;
      }
    }
  }

  startPoll() {
    this.tracker.getCurrent()
      .then(iteration => {
        this.iteration = iteration[0];
        this.timeout = setTimeout(this.startPoll.bind(this), this.pollInterval);
      })
      .catch(error => this.router.navigate(""));
  }
}
