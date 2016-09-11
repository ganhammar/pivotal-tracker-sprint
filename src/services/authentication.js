import { inject } from "aurelia-framework";
import { Redirect } from "aurelia-router";
import { Tracker } from "./tracker";

@inject(Tracker)
export class Authentication {
  constructor(tracker) {
    this.tracker = tracker;
  }

  getUser() {
    return this.tracker.currentUser;
  }

  isAuthenticated() {
    return this.tracker.isValid();
  }

  run(navigationInstruction, next) {
    var instructions = navigationInstruction.getAllInstructions();
    var auth = instructions.some(i => i.config.auth);
    var unAuthedOnly = instructions.some(i => i.config.unAuthedOnly);

    if (auth || unAuthedOnly) {
      return this.isAuthenticated()
        .then(result => {
          return auth
            ? next()
            : next.cancel(new Redirect("select-project"));
        })
        .catch(error => {
          return unAuthedOnly
            ? next()
            : next.cancel(new Redirect("login"));
        });
    } else {
      return next();
    }
  }
}
