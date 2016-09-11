import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { Local } from "./local";

@inject(HttpClient, Local)
export class Tracker {
  constructor(client, local) {
    this.client = client;
    this.local = local;
    this.ls = {
      token: "pivotal-tracker-token",
      user: "pivotal-tracker-current-user"
    };
    this.projectId = null;
    this._projects = [];
    this._currentUser = this.local.g(this.ls.user) || null;
    this._token = this.local.g(this.ls.token) || null;
    this._configureClient();
  }

  _configureClient() {
    this.client.configure(config => {
      config
        .withBaseUrl("https://www.pivotaltracker.com/services/v5/")
        .withDefaults({
          headers: {
            "X-TrackerToken": this._token
          }
        });
    });
  }

  set currentUser(value) {
    if (value) {
      this._currentUser = value;
      this.local.s(this.ls.user, value);
    } else {
      this._currentUser = null;
      this.local.d(this.ls);
    }
  }

  get currentUser() {
    return this._token ? this._currentUser : null;
  }

  set token(value) {
    this._token = value;

    this.local.s(this.ls.token, value);

    this._configureClient();
  }

  _fetch(url) {
    return new Promise((resolve, reject) => {
      this.client.fetch(url)
        .then(response => response.json())
        .then(response => {
          if (response.kind !== "error") {
            resolve(response);
          } else {
            this.currentUser = null;
            reject(new Error(response.code));
          }
        })
        .catch(error => {
          this.currentUser = null;
          reject(error);
        })
    });
  }

  getProject(projectId) {
    projectId = parseInt(projectId);
    
    return new Promise((resolve, reject) => {
      this.getProjects()
        .then(projects => {
          projects.forEach(item => {
            if (item.id === projectId) {
              resolve(item);
            }
          });
          resolve();
        })
        .catch(error => reject(error));
    });
  }

  getProjects() {
    return new Promise((resolve, reject) => {
      if (this._projects && this._projects.length > 0) {
        return resolve(this._projects);
      }

      this._fetch("projects")
        .then(projects => {
          this._projects = projects;
          resolve(this._projects);
        })
        .catch(error => reject(error));
    });
  }

  getCurrent() {
    return this._fetch(`projects/${this.projectId}/iterations?scope=current_backlog&limit=1`);
  }

  getUsers() {
    return this._fetch(`projects/${this.projectId}/memberships`);
  }

  isValid() {
    return new Promise((resolve, reject) => {
      if (this.currentUser) {
        return resolve(this.currentUser);
      }

      this.client.fetch("me")
        .then(response => response.json())
        .then(result => {
          if (result.kind !== "error") {
            this.currentUser = result;
            resolve(this.currentUser);
          } else {
            this.currentUser = null;
            reject(new Error(response.code));
          }
        })
        .catch(error => {
          this.currentUser = null;
          reject(error);
        });
    });
  }
}
