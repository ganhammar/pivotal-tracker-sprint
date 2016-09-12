import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { Busy } from "./busy"
import { Local } from "./local";

@inject(HttpClient, Busy, Local)
export class Tracker {
  constructor(client, busy, local) {
    this.client = client;
    this.busy = busy;
    this.local = local;
    this.ls = {
      token: "pivotal-tracker-token",
      user: "pivotal-tracker-current-user"
    };
    this.projectId = null;
    this._projects = [];
    this._currentUser = this.local.g(this.ls.user) || null;
    this._users = [];
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
    if (!value) {
      this._currentUser = null;
      this._projectId = null;
    }

    this._token = value;

    this.local.s(this.ls.token, value);

    this._configureClient();
  }

  _fetch(url, inBackground) {
    return new Promise((resolve, reject) => {
      if (inBackground !== true) {
        this.busy.on();
      }

      this.client.fetch(url)
        .then(response => response.json())
        .then(response => {
          if (response.kind !== "error") {
            resolve(response);
          } else {
            this.currentUser = null;
            reject(new Error(response.code));
          }
          this.busy.off();
        })
        .catch(error => {
          this.currentUser = null;
          reject(error);
          this.busy.off();
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

  getCurrent(inBackground) {
    return this._fetch(`projects/${this.projectId}/iterations?scope=current_backlog&limit=1`, inBackground);
  }

  getUsers() {
    return new Promise((resolve, reject) => {
      if (this._users && this._users.length > 0) {
        return resolve(this._users);
      }

      this._fetch(`projects/${this.projectId}/memberships`)
        .then(projects => {
          this._users = projects;
          resolve(this._users);
        })
        .catch(error => reject(error));
    });
  }

  isValid() {
    return new Promise((resolve, reject) => {
      if (this.currentUser) {
        return resolve(this.currentUser);
      }

      if (!this._token) {
        return reject(new Error("No token set"));
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
