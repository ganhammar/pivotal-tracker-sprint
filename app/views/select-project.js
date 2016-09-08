"use strict";

(function () {
    var lsProjects = "pivotal-tracker-projects";
    var lsSelectedProject = "pivotal-tracker-selected-project";    

    function SelectProject (wrapper) {
        this.wrapper = wrapper;
        this.tracker = window.tracker;
        this.projects = null;
        this.project = null;
        this.wrapper = document.getElementById("projects-wrapper");
        this.projectName = document.getElementById("project-name");
        this.switchProject = document.getElementById("switch-project");

        this.init();
    }

    SelectProject.prototype.init = function () {
        var self = this;
        
        if (localStorage.getItem(lsProjects)) {
            this.projects = JSON.parse(localStorage.getItem(lsProjects));

            if (localStorage.getItem(lsSelectedProject)) {
                if (this.setProject(localStorage.getItem(lsSelectedProject))) {
                    this.projectName.innerText = this.project.name;
                    this.switchProject.style.display = "block";
                    this.next();
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

    SelectProject.prototype.getProject = function (projectId) {
        projectId = parseInt(projectId);
        
        for (var i = 0; i < this.projects.length; i++) {
            if (this.projects[i].id === projectId) {
                return this.projects[i];
            }
        }

        return false;
    };

    SelectProject.prototype.setProject = function (projectId) {
        var project;

        if (project = this.getProject(projectId)) {
            this.project = project;
            return true
        }
        
        this.project = null;
        return false;
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
            self.restart("The entered token isn't valid");
        });
    };

    SelectProject.prototype.clearProjectsDom = function () {
        var toBeRemoved = this.wrapper.getElementsByClassName("project");
        while (toBeRemoved.length > 0) {
            toBeRemoved[0].parentElement.removeChild(toBeRemoved[0]);
        }
    };

    SelectProject.prototype.clear = function () {
        this.clearProjectsDom();
        this.projectName.innerText = "";
        this.switchProject.style.display = "none";
        localStorage.removeItem(lsProjects);
        localStorage.removeItem(lsSelectedProject);
    };

    SelectProject.prototype.restart = function (error) {
        this.clear();

        if (error) {
            this.previous(error);
        } else {
            this.init();
        }
    };

    SelectProject.prototype.updateProjectsDom = function () {
        this.clearProjectsDom();
        
        var template = document.getElementById("project-template");
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
        if (this.setProject(element.getAttribute("data-project-id"))) {
            this.wrapper.style.display = "none";
            this.projectName.innerText = this.project.name;
            this.switchProject.style.display = "block";
            localStorage.setItem(lsSelectedProject, JSON.stringify(this.project.id));
            this.next();
        } else {
            this.restart();
        }
    };

    SelectProject.prototype.previous = function () {
        this.tracker.project = null;
        location.href = "#set-token";
    };

    SelectProject.prototype.next = function () {
        this.tracker.project = this.project;
        location.href = "#sprint-backlog";
    };

    window.SelectProject = SelectProject;
}());