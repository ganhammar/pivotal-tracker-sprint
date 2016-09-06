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

    window.app = new App();
}());