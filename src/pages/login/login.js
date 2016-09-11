import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Tracker } from "./../../services/tracker";

@inject(Tracker, Router)
export class Login {
  constructor(tracker, router) {
    this.tracker = tracker;
    this.router = router;

    this.placeholder = "Enter API token..";
    this.token = "4ea441cc4dcb4ee87426549edd244a95";
  }

  setToken() {
    if (this.token.length > 0) {
      this.tracker.token = this.token;
      this.tracker.isValid()
        .then(result => {
          this.router.navigate("select-project");
        })
        .catch(error => {
          console.log("Try again, stupid");
        });
    } else {
      console.log("Try again, stupid 2");
    }
  }
}
