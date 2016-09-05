"use strict";

(function () {
    var lsProjects = "pivotal-tracker-projects";
    var lsSelectedProject = "pivotal-tracker-selected-project";    

    function SelectProject (tracker, success, fail) {
        this.fail = fail;
        this.success = success;
        this.tracker = tracker;
        this.projects = null;
        this.projectId = null;
        this.wrapper = document.getElementById("projects-wrapper");

        this.init();
    }

    SelectProject.prototype.init = function () {
        var self = this;
        
        if (localStorage.getItem(lsProjects)) {
            this.projects = JSON.parse(localStorage.getItem(lsProjects));

            if (localStorage.getItem(lsSelectedProject)) {
                if (this.setProjectId(localStorage.getItem(lsSelectedProject))) {
                    this.success(this.projectId);
                } else {
                    this.restart();
                }
            } else {
                self.updateProjectsDom();
            }
        } else {
            this.getProjects();
        }
    };

    SelectProject.prototype.setProjectId = function (projectId) {
        projectId = parseInt(projectId);

        var valid = false;
        for (var i = 0; i < this.projects.length; i++) {
            if (this.projects[i].id === projectId) {
                valid = true;
                break;
            }
        }

        this.projectId = valid === true ? projectId : null;
        return valid;
    };

    SelectProject.prototype.getProjects = function () {
        var self = this;

        this.tracker.getProjects(function (result) {
            if (!result) {
                this.restart("No connected projects found");
            } else {
                self.projects = result;
                localStorage.setItem(lsProjects, JSON.stringify(self.projects));
                self.updateProjectsDom();
            }
        }, function () {
            this.restart("The entered token isn't valid");
        });
    };

    SelectProject.prototype.restart = function (error) {
        localStorage.removeItem(lsProjects);
        localStorage.removeItem(lsSelectedProject);

        if (error) {
            this.fail(error);
        } else {
            this.init();
        }
    };

    SelectProject.prototype.updateProjectsDom = function () {
        var template = document.getElementById("project-template");
        
        var toBeRemoved = this.wrapper.getElementsByClassName("project");
        while (toBeRemoved.length > 0) {
            toBeRemoved[0].parentElement.removeChild(toBeRemoved[0]);
        }

        for (var i = 0; i < this.projects.length; i++) {
            var node = template.cloneNode(true);
            node.id = "";
            node.style.display = "block";
            node.className = "project";
            var project = this.projects[i];

            node.setAttribute("data-project-id", project.id)
            node.querySelector(".title").innerText = project.name;
            template.parentElement.appendChild(node);
        }

        this.wrapper.style.display = "block";
    };

    SelectProject.prototype.makeSelection = function (element) {
        if (this.setProjectId(element.getAttribute("data-project-id"))) {
            this.wrapper.style.display = "none";
            localStorage.setItem(lsSelectedProject, JSON.stringify(this.projectId));
            this.success(this.projectId);
        } else {
            this.restart();
        }
    };

    window.SelectProject = SelectProject;
}());