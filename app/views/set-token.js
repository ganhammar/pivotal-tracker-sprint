"use strict";

(function () {
    var ls = "pivotal-tracker-token";
    
    function SetToken (wrapper) {
        this.token = null;
        this.wrapper = wrapper;
        this.input = document.getElementById("token");
        this.logout = document.getElementById("logout");

        this.init();
    }
    
    SetToken.prototype.init = function () {
        if (localStorage.getItem(ls)) {
            this.hide();
            this.token = localStorage.getItem(ls);
            this.next();
        } else {
            this.show();
        }
    };

    SetToken.prototype.show = function () {
        this.logout.style.display = "none";
    };

    SetToken.prototype.hide = function () {
        this.logout.style.display = "block";
    };

    SetToken.prototype.clear = function () {
        localStorage.removeItem(ls);
        this.input.value = "";
    };

    SetToken.prototype.set = function () {
        this.token = this.input.value;

        if (!this.token) {
            helper.showError("The entered token isn't valid");
            this.clearTokenField();
            return;
        }

        localStorage.setItem(ls, this.token);
        this.hide();
        this.next();
    };

    SetToken.prototype.next = function () {
        window.tracker.token = this.token;
        location.hash = "#select-project";
    };

    SetToken.prototype.restart = function () {
        this.clear();
        this.init();
    };

    window.SetToken = SetToken;
}());