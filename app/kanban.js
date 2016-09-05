"use strict";

(function () {
    function Kanban (tracker) {
        this.tracker = tracker;
        this.current = null;
        this.wrapper = document.getElementById("kanban");
        this.todo = document.getElementById("todo");
        this.doing = document.getElementById("doing");
        this.testing = document.getElementById("testing");
        this.done = document.getElementById("done");
        this.impedements = document.getElementById("impedements");

        this.init();
    }

    Kanban.prototype.init = function () {
        this.getCurrent();
    };

    Kanban.prototype.getCurrent = function () {
        this.tracker.getCurrent(function (result) {
            this.current = result[0];
            this.updateDom();
            this.poll();
        }.bind(this));
    };

    Kanban.prototype.poll = function () {
        this.poll = setTimeout(function () {
            this.getCurrent();
        }.bind(this), 60000);
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

    Kanban.prototype.updateDom = function () {
        var template = document.getElementById("story-template");

        for (var i = 0; i < this.current.stories.length; i++) {
            var story = this.current.stories[i];
            var id = "story-" + story.id;

            if (document.getElementById(id)) {
                
            }

            var node = template.cloneNode(true);
            node.style.display = "block";
            node.id = id;
            node.querySelector(".title").innerText = story.name;

            this.appendStory(story, node);
        }

        this.wrapper.style.display = "block";
    };

    Kanban.prototype.appendStory = function (story, node) {
        if (this.isStoryBlocked(story)) {
            this.impedements.appendChild(node);
            return;
        }

        switch (story.current_state) {
            case "unstarted":
                this.todo.appendChild(node);
                break;
            case "started":
                this.doing.appendChild(node);
                break;
            case "delivered":
                this.testing.appendChild(node);
                break;
            case "finished":
                this.done.appendChild(node);
                break;
        }
    };

    window.Kanban = Kanban;
}());