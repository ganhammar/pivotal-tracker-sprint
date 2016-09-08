"use strict";

(function () {
    function Tracker () {
        this.token = null;
        this.project = null;
        this.baseUrl = "https://www.pivotaltracker.com/services/v5/";
        this.spinner = document.getElementById("spinner");
    }

    Tracker.prototype.toggleSpinner = function () {
        this.spinner.style.display = this.spinner.style.display === "block" ? "none" : "block";
    };

    Tracker.prototype.request = function (method, endpoint, a, b, c) {
        this.toggleSpinner();
        var data = null;
        var success = function () {};
        var fail = function () {};

        if (typeof a === "function") {
            success = a;
        } else if (typeof a === "object") {
            data = a;
        }

        if (typeof b === "function" && typeof a !== "function") {
            success = b;
        } else if (typeof b === "function") {
            fail = b;
        }

        if (typeof c === "function") {
            fail = c;
        }

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    success(JSON.parse(httpRequest.responseText));
                } else {
                    fail(JSON.parse(httpRequest.responseText));
                }

                this.toggleSpinner();
            }
        }.bind(this);

        httpRequest.open(method, this.baseUrl + endpoint);
        httpRequest.setRequestHeader("X-TrackerToken", this.token);
        httpRequest.send(data);
    };

    Tracker.prototype.getCurrent = function (success, fail) {
        this.request("GET", "projects/" + this.project.id + "/iterations?scope=current_backlog&limit=1", success, fail);
    };

    Tracker.prototype.getProjects = function (success, fail) {
        this.request("GET", "projects", success, fail);
    };

    Tracker.prototype.getUsers = function (success, fail) {
        this.request("GET", "projects/" + this.project.id + "/memberships", success, fail);
    };

    window.tracker = new Tracker();
}());