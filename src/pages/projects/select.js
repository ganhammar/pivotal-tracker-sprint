import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Tracker } from "./../../services/tracker";

@inject(Tracker, Router)
export class Select {
  constructor(tracker, router) {
    this.tracker = tracker;
    this.tracker.projectId = null;
    this.router = router;
    this.projects = [];
  }

  attached() {
    this.tracker.getProjects()
      .then(projects => this.projects = projects)
      .catch(error => this.router.navigate(""));
  }
} 
