"use strict";

(function () {
    function Router (routes) {
        this.routes = routes || {};
        this.controller = null;
        this.init();
    }

    Router.prototype.init = function () {
        window.onhashchange = this.handleHashChange.bind(this);

        if (location.hash) {
            this.handleHashChange();
        }
    };

    Router.prototype.hideViews = function () {
        var views = document.querySelectorAll(".view");

        for (var i = 0; i < views.length; i++) {
            views[i].style.display = "none";
        }
    };

    Router.prototype.handleHashChange = function () {
        var hash = location.hash.replace("#", "");

        if (this.routes[hash]) {
            this.hideViews();
            var route = this.routes[hash];
            var view = document.querySelector(".view[data-name='" + route.view + "']");
            view.style.display = "block";
            
            this.controller = new route.controller(view);
        }
    };

    window.Router = Router;
}());