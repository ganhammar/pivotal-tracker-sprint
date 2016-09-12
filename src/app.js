import { inject } from "aurelia-framework";
import { BindingEngine } from "aurelia-binding";
import { Router } from "aurelia-router";
import { Authentication } from "./services/authentication";
import { Busy } from "./services/busy"
import { Tracker } from "./services/tracker";

@inject(BindingEngine, Router, Authentication, Busy, Tracker)
export class App {
  constructor(bindingEngine, router, authentication, busy, tracker) {
    this.bindingEngine = bindingEngine;
    this.router = router;
    this.authentication = authentication;
    this.busy = busy;
    this.isBusy = busy.isBusy;
    this.tracker = tracker;
    this.project = {};
    this.user = {};
    this.isEnlarged = false;
  }

  toggleEnlarged() {
    this.isEnlarged = !this.isEnlarged;
  }

  activate() {
    this.user = this.tracker.currentUser;
    this.bindingEngine.propertyObserver(this.tracker, "currentUser")
      .subscribe((newValue, oldValue) => {
        this.user = this.tracker.currentUser;
      });
    
    this.bindingEngine.propertyObserver(this.tracker, "projectId")
      .subscribe((newValue, oldValue) => {
        this.tracker.getProject(newValue)
          .then(project => this.project = project);
      });

    this.bindingEngine.propertyObserver(this.busy, "isBusy")
      .subscribe((newValue, oldValue) => this.isBusy = newValue);
  }

  logout() {
    this.authentication.logout();
    this.router.navigate("");
  }

  configureRouter(config, router) {
    var auth = true;

    config.title = "Pivotal Tracker Sprint Backlog";
    config.addPipelineStep("authorize", this.authentication);
    config.map([
      { route: ["", "login"], moduleId: "pages/login/login", title: "Login", unAuthedOnly: true },
      { route: "select-project", name: "select-project", moduleId: "pages/projects/select", title: "Select Project", auth },
      { route: "project/:id/sprint-backlog", name: "sprint-backlog", moduleId: "pages/backlog/sprint", title: "Sprint Backlog", auth },
      { route: "settings", name: "settings", moduleId: "pages/settings/settings", title: "Settings", auth }
    ]);
  }
}

