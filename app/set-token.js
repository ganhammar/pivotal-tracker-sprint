"use strict";

(function () {
    var ls = "pivotal-tracker-token";
    
    function SetToken (callback) {
        this.callback = callback;
        this.token = null;
        this.wrapper = document.getElementById("enter-token");
        this.input = document.getElementById("token");

        this.init();
    }
    
    SetToken.prototype.init = function () {
        if (localStorage.getItem(ls)) {
            this.token = localStorage.getItem(ls);
            this.callback(this.token);
        } else {
            this.show();
        }
    };

    SetToken.prototype.show = function () {
        this.wrapper.style.display = "block";
    };

    SetToken.prototype.hide = function () {
        this.wrapper.style.display = "none";
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
        this.callback(this.token);
    };

    SetToken.prototype.restart = function (callback) {
        if (typeof callback === "function") {
            this.callback = callback;
        }

        this.clear();
        this.init();
    };

    window.SetToken = SetToken;
}());