"use strict";

(function () {
    var pollFrequency = 60000;

    function Kanban (tracker, iterationNumber) {
        this.tracker = tracker;
        this.users = [];
        this.current = null;
        this.timeout = null;
        this.wrapper = document.getElementById("kanban");
        this.todo = document.getElementById("todo");
        this.doing = document.getElementById("doing");
        this.testing = document.getElementById("testing");
        this.done = document.getElementById("done");
        this.impedements = document.getElementById("impedements");

        this.init();
    }

    Kanban.prototype.init = function () {
        this.tracker.getUsers(function (result) {
            for (var i = 0; i < result.length; i++) {
                this.users.push(result[i].person);
            }
            this.getCurrent();
        }.bind(this));
    };

    Kanban.prototype.getUser = function (userId) {
        userId = parseInt(userId);

        for (var i = 0; i < this.users.length; i++) {
            var user = this.users[i];

            if (userId === user.id) {
                return user;
            }
        }
    };

    Kanban.prototype.getCurrent = function () {
        this.tracker.getCurrent(function (result) {
            this.current = result[0];
            this.updateDom();
            this.poll();
        }.bind(this));
    };

    Kanban.prototype.poll = function () {
        this.timeout = setTimeout(function () {
            this.getCurrent();
        }.bind(this), pollFrequency);
    };

    Kanban.prototype.isStoryBlocked = function (story) {
        for (var i = 0; i < story.labels.length; i++) {
            var label = story.labels[i];

            if (label.name === "_blocked") {
                return true;
            }
        }

        return false;
    };

    Kanban.prototype.setStoryOwnersDom = function (node, story) {
        var owners = node.querySelector(".owners");
        for (var y = 0; y < story.owner_ids.length; y++) {
            var user = this.getUser(story.owner_ids[y]);

            if (!user || owners.querySelector("span[data-user-id='" + user.id + "']")) {
                continue;
            }

            var owner = document.createElement("span");
            owner.classList.add("owner");
            owner.setAttribute("data-user-id", user.id);
            owner.innerText = user.initials;
            owners.appendChild(owner);
        }
    };

    Kanban.prototype.setEstimateDom = function (node, story) {
        if (story.estimate) {
            node.querySelector(".estimate").innerText = story.estimate;
        }
    };

    Kanban.prototype.updateDom = function () {
        var template = document.getElementById("story-template");

        for (var i = 0; i < this.current.stories.length; i++) {
            var story = this.current.stories[i];
            var id = "story-" + story.id;
            var node;

            if (document.getElementById(id)) {
                if (node = this[this.getType(story)].querySelector("#" + id)) {
                    this.setStoryOwnersDom(node, story);
                    continue;
                } else {
                    document.getElementById(id).parentElement.removeChild(document.getElementById(id));
                }
            }

            node = template.cloneNode(true);
            node.style.display = "block";
            node.id = id;
            node.classList.add(story.story_type);
            node.classList.add("story");
            node.querySelector(".title").innerText = story.name;

            this.setStoryOwnersDom(node, story);
            this.setEstimateDom(node, story);

            this.appendStory(story, node);
        }

        this.wrapper.style.display = "block";
    };

    Kanban.prototype.getType = function (story) {
        if (this.isStoryBlocked(story)) {
            return "impedements";
        }

        switch (story.current_state) {
            case "planned":
            case "unstarted":
                return "todo";
            case "started":
                return "doing";
            case "finished":
                return "testing";
            case "delivered":
            case "accepted":
                return "done";
        }
    };

    Kanban.prototype.appendStory = function (story, node) {
        if (this.getType(story)) {
            this[this.getType(story)].appendChild(node);
        } else {
            helper.showError("Don't know what to do with story in state: " + story.current_state);
        }
    };

    Kanban.prototype.clear = function () {
        var stories = document.getElementsByClassName("story");

        while (stories.length > 0) {
            stories[0].parentElement.removeChild(stories[0]);
        }

        this.wrapper.style.display = "none";
    };

    window.Kanban = Kanban;
}());