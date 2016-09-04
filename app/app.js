"use strict";

(function () {
    var lsToken = "pivotal-tracker-token";
    var lsProject = "pivotal-tracker-project";

    function App () {
        if (localStorage.getItem(lsToken)) {
            this.init();
        }
    }

    App.prototype.init = function () {
        this.tracker = new Tracker(localStorage.getItem(lsToken));
        this.getProjects();
    };

    App.prototype.clearTokenField = function () {
        token = document.getElementById("token").value = "";
    };

    App.prototype.showError = function (message) {
        document.getElementById("error-message").innerHTML = message;

        var errorElement = document.getElementById("error");
        errorElement.style.display = "block";

        setTimeout(function () {
            errorElement.style.display = "none";
        }, 2000);
    };

    App.prototype.setToken = function () {
        token = document.getElementById("token").value;

        if (!token) {
            window.app.showError("The entered token isn't valid");
            this.clearTokenField();
            return;
        }

        localStorage.setItem(lsToken, token);
        this.init();
    };

    App.prototype.getProjects = function () {
        var self = this;

        this.tracker.getProjects(function (result) {
            if (!result) {
                localStorage.removeItem(lsToken);
                window.app.showError("No connected projects found");
                self.clearTokenField();
            } else {
                self.projects = result;
                self.selectProject = new SelectProject(self.projects);
            }
        }, function () {
            localStorage.removeItem(lsToken);
            window.app.showError("The entered token isn't valid");
            self.clearTokenField();
        });
    };

    window.app = new App();
}());