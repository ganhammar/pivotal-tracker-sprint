"use strict";

(function () {
    function Tracker (token) {
        this.token = token;
        this.baseUrl = "https://www.pivotaltracker.com/services/v5/";
    }

    Tracker.prototype.request = function (method, endpoint, a, b, c) {
        var data = null;
        var callback = function () {};
        var fail = function () {};

        if (typeof a === "function") {
            callback = a;
        } else if (typeof a === "object") {
            data = a;
        }

        if (typeof b === "function" && typeof a !== "function") {
            callback = b;
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
                    callback(JSON.parse(httpRequest.responseText));
                } else {
                    fail(JSON.parse(httpRequest.responseText));
                }
            }
        };

        httpRequest.open(method, this.baseUrl + endpoint);
        httpRequest.setRequestHeader("X-TrackerToken", this.token);
        httpRequest.send(data);
    };

    Tracker.prototype.getProjects = function (callback, fail) {
        this.request("GET", "projects", callback, fail);
    };

    window.Tracker = Tracker;
}());