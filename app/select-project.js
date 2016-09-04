"use strict";

(function () {
    function SelectProject (projects) {
        this.projects = projects;
        this.init();
    }

    SelectProject.prototype.init = function () {
        var wrapper = document.getElementById("projects-wrapper");
        var template = document.getElementById("project-template");

        for (var i = 0; i < this.projects.length; i++) {
            var node = JSON.parse(JSON.stringify(template));
            var project = this.projects[i];

            console.log(node);

            node.querySelector(".title").innerText = project.name;
        }
    };

    window.SelectProject = SelectProject;
}());