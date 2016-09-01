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
        this.tracker.getProjects();
    };

    App.prototype.showError = function (message) {
        document.getElementById("error-message").innerHTML = message;

        var errorElement = document.getElementById("error");
        errorElement.style.visibility = "visible";

        setTimeout(function () {
            errorElement.style.visibility = "hidden";
        }, 2000);
    };

    App.prototype.setToken = function () {
        token = document.getElementById("token").value;

        if (!token) {
            window.app.showError("The entered token isn't valid");
            return;
        }

        localStorage.setItem(lsToken, token);
        this.init();
    };

    App.prototype.getProjects = function () {
        this.tracker.getProjects(function (result) {
            if (!result) {
                localStorage.removeItem(lsToken);
                window.app.showError("No connected projects found");
            } else {
                this.projects = result;
            }
        }, function () {
            localStorage.removeItem(lsToken);
            window.app.showError("The entered token isn't valid");
        });
    };

    window.app = new App();
}());