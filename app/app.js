"use strict";

(function () {
    function App () {
        this.setToken = null;
        this.selectProject = null;
        this.kanban = null;
        this.tracker = null;

        this.initSetToken();
    }

    App.prototype.showError = function (message) {
        document.getElementById("error-message").innerHTML = message;

        var errorElement = document.getElementById("error");
        errorElement.style.display = "block";

        setTimeout(function () {
            errorElement.style.display = "none";
        }, 2000);
    };

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
            self.showError(error);
            self.setToken.restart();
        });
    };

    App.prototype.initKanban = function (projectId) {
        console.log(projectId);
    };

    window.app = new App();
}());