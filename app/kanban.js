"use strict";

(function () {
    function Kanban (tracker, iterationNumber) {
        this.tracker = tracker;
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
        this.timeout = setTimeout(function () {
            this.getCurrent();
            this.poll();
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
                console.log(this, this.getType(story), story);
                if (this[this.getType(story)].querySelector("#" + id)) {
                    continue;
                } else {
                    document.getElementById(id).parentElement.removeChild(document.getElementById(id));
                }
            }

            var node = template.cloneNode(true);
            node.style.display = "block";
            node.id = id;
            node.querySelector(".title").innerText = story.name;
            node.querySelector(".story-type").innerText = helper.ucfirst(story.story_type);
            
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
                return "todo";
            case "started":
                return "doing";
            case "delivered":
                return "testing";
            case "finished":
                return "done";
        }
    };

    Kanban.prototype.appendStory = function (story, node) {
        this[this.getType(story)].appendChild(node);
    };

    window.Kanban = Kanban;
}());