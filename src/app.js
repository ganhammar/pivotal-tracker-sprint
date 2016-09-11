import { inject } from "aurelia-framework";
import { BindingEngine } from "aurelia-binding";
import { Authentication } from "./services/authentication";
import { Tracker } from "./services/tracker";

@inject(BindingEngine, Authentication, Tracker)
export class App {
  constructor(bindingEngine, authentication, tracker) {
    this.bindingEngine = bindingEngine;
    this.authentication = authentication;
    this.tracker = tracker;
    this.project = {};
    this.user = {};
  }

  activate() {
    this.user = this.authentication.getUser();
    this.bindingEngine.propertyObserver(this.tracker, "projectId")
      .subscribe((newValue, oldValue) => {
        this.tracker.getProject(newValue)
          .then(project => this.project = project);
      });
  }

  configureRouter(config, router) {
    var auth = true;

    config.title = "Pivotal Tracker Sprint Backlog";
    config.addPipelineStep("authorize", this.authentication);
    config.map([
      { route: ["", "login"], moduleId: "pages/login/login", title: "Login", unAuthedOnly: true },
      { route: "select-project", name: "select-project", moduleId: "pages/projects/select", title: "Select Project", auth },
      { route: "project/:id/sprint-backlog", name: "sprint-backlog", moduleId: "pages/backlog/sprint", title: "Sprint Backlog", auth },
      { route: "settings", name: "settings", moduleId: "settings", title: "Settings", auth }
    ]);
  }
}
