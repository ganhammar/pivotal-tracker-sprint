"use strict";

(function () {
    function App () {
        this.setToken = null;
        this.selectProject = null;
        this.kanban = null;
        this.tracker = null;

        this.initSetToken();
    }

    App.prototype.initSetToken = function () {
        this.setToken = new SetToken(this.initTracker.bind(this));
    };

    App.prototype.initTracker = function (token) {
        this.tracker = new Tracker(token);
        this.initSelectProject();
    };

    App.prototype.initSelectProject = function () {
        var self = this;

        self.selectProject = new SelectProject(this.tracker, this.initKanban.bind(this), function (error) {
            helper.showError(error);
            self.setToken.restart();
        });
    };

    App.prototype.initKanban = function (project) {
        this.tracker.project = project;
        this.kanban = new Kanban(this.tracker);
    };

    App.prototype.switchProject = function () {
        if (this.kanban) {
            this.kanban.clear();
            this.kanban = null;
        }

        this.selectProject.restart();
    };

    App.prototype.logout = function () {
        if (this.kanban) {
            this.kanban.clear();
            this.kanban = null;
        }

        this.selectProject.clear();
        this.setToken.restart();
    };

    window.app = new App();
}());