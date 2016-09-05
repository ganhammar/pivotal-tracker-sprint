"use strict";

(function () {
    function Tracker (token) {
        this.token = token;
        this.projectId = null;
        this.baseUrl = "https://www.pivotaltracker.com/services/v5/";
    }

    Tracker.prototype.request = function (method, endpoint, a, b, c) {
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
            }
        };

        httpRequest.open(method, this.baseUrl + endpoint);
        httpRequest.setRequestHeader("X-TrackerToken", this.token);
        httpRequest.send(data);
    };

    Tracker.prototype.getCurrent = function (success, fail) {
        this.request("GET", "projects/" + this.projectId + "/iterations?limit=1&offset=0", success, fail);
    };

    Tracker.prototype.getProjects = function (success, fail) {
        this.request("GET", "projects", success, fail);
    };

    window.Tracker = Tracker;
}());