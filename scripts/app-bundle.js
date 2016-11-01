define('app',["exports", "aurelia-framework", "aurelia-binding", "aurelia-router", "./services/authentication", "./services/busy", "./services/tracker"], function (exports, _aureliaFramework, _aureliaBinding, _aureliaRouter, _authentication, _busy, _tracker) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaBinding.BindingEngine, _aureliaRouter.Router, _authentication.Authentication, _busy.Busy, _tracker.Tracker), _dec(_class = function () {
    function App(bindingEngine, router, authentication, busy, tracker) {
      _classCallCheck(this, App);

      this.bindingEngine = bindingEngine;
      this.router = router;
      this.authentication = authentication;
      this.busy = busy;
      this.isBusy = busy.isBusy;
      this.tracker = tracker;
      this.project = {};
      this.user = {};
      this.isEnlarged = false;
    }

    App.prototype.toggleEnlarged = function toggleEnlarged() {
      this.isEnlarged = !this.isEnlarged;
    };

    App.prototype.activate = function activate() {
      var _this = this;

      this.user = this.tracker.currentUser;
      this.bindingEngine.propertyObserver(this.tracker, "currentUser").subscribe(function (newValue, oldValue) {
        _this.user = _this.tracker.currentUser;
      });

      this.bindingEngine.propertyObserver(this.tracker, "projectId").subscribe(function (newValue, oldValue) {
        _this.tracker.getProject(newValue).then(function (project) {
          return _this.project = project;
        });
      });

      this.bindingEngine.propertyObserver(this.busy, "isBusy").subscribe(function (newValue, oldValue) {
        return _this.isBusy = newValue;
      });
    };

    App.prototype.logout = function logout() {
      this.authentication.logout();
      this.router.navigate("");
    };

    App.prototype.configureRouter = function configureRouter(config, router) {
      var auth = true;

      config.title = "Pivotal Tracker Sprint Backlog";
      config.addPipelineStep("authorize", this.authentication);
      config.map([{ route: ["", "login"], moduleId: "pages/login/login", title: "Login", unAuthedOnly: true }, { route: "select-project", name: "select-project", moduleId: "pages/projects/select", title: "Select Project", auth: auth }, { route: "project/:id/sprint-backlog", name: "sprint-backlog", moduleId: "pages/backlog/sprint", title: "Sprint Backlog", auth: auth }, { route: "settings", name: "settings", moduleId: "pages/settings/change", title: "Settings", auth: auth }]);
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',["exports", "./environment"], function (exports, _environment) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature("./resources");

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin("aurelia-testing");
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/authentication',["exports", "aurelia-framework", "aurelia-router", "./tracker"], function (exports, _aureliaFramework, _aureliaRouter, _tracker) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Authentication = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Authentication = exports.Authentication = (_dec = (0, _aureliaFramework.inject)(_tracker.Tracker), _dec(_class = function () {
    function Authentication(tracker) {
      _classCallCheck(this, Authentication);

      this.tracker = tracker;
    }

    Authentication.prototype.getUser = function getUser() {
      return this.tracker.currentUser;
    };

    Authentication.prototype.isAuthenticated = function isAuthenticated() {
      return this.tracker.isValid();
    };

    Authentication.prototype.logout = function logout() {
      this.tracker.token = null;
    };

    Authentication.prototype.run = function run(navigationInstruction, next) {
      var instructions = navigationInstruction.getAllInstructions();
      var auth = instructions.some(function (i) {
        return i.config.auth;
      });
      var unAuthedOnly = instructions.some(function (i) {
        return i.config.unAuthedOnly;
      });

      if (auth || unAuthedOnly) {
        return this.isAuthenticated().then(function (result) {
          return auth ? next() : next.cancel(new _aureliaRouter.Redirect("select-project"));
        }).catch(function (error) {
          return unAuthedOnly ? next() : next.cancel(new _aureliaRouter.Redirect("login"));
        });
      } else {
        return next();
      }
    };

    return Authentication;
  }()) || _class);
});
define('services/busy',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Busy = exports.Busy = function () {
    function Busy() {
      _classCallCheck(this, Busy);

      this.isBusy = false;
    }

    Busy.prototype.on = function on() {
      this.isBusy = true;
    };

    Busy.prototype.off = function off() {
      this.isBusy = false;
    };

    return Busy;
  }();
});
define('services/local',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Local = exports.Local = function () {
    function Local() {
      _classCallCheck(this, Local);
    }

    Local.prototype.g = function g(key) {
      if (localStorage.getItem(key)) {
        try {
          return JSON.parse(localStorage.getItem(key));
        } catch (err) {
          this.d(key);
          return false;
        }
      }
    };

    Local.prototype.s = function s(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    };

    Local.prototype.d = function d(key) {
      var _this = this;

      if (Array.isArray(key)) {
        key.forEach(function (i) {
          return _this.d(i);
        });
      }
      localStorage.removeItem(key);
    };

    return Local;
  }();
});
define('services/settings',["exports", "aurelia-framework", "./local"], function (exports, _aureliaFramework, _local) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Settings = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Settings = exports.Settings = (_dec = (0, _aureliaFramework.inject)(_local.Local), _dec(_class = function Settings() {
    _classCallCheck(this, Settings);

    this.storyStates = ["unscheduled", "unstarted", "started", "finished", "delivered", "accepted", "rejected", "planned"];

    this.columnBaseTypes = ["state", "label"];

    this.columns = [{ title: "Todo", basedOn: "state", value: ["planned", "unstarted"] }, { title: "Doing", basedOn: "state", value: ["started"] }, { title: "Testing", basedOn: "state", value: ["finished"] }, { title: "Done", basedOn: "state", value: ["delivered", "accepted"] }, { title: "Impedements", basedOn: "label", value: ["_blocked"] }];
  }) || _class);
});
define('services/tracker',["exports", "aurelia-framework", "aurelia-fetch-client", "./busy", "./local"], function (exports, _aureliaFramework, _aureliaFetchClient, _busy, _local) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Tracker = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var Tracker = exports.Tracker = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _busy.Busy, _local.Local), _dec(_class = function () {
    function Tracker(client, busy, local) {
      _classCallCheck(this, Tracker);

      this.client = client;
      this.busy = busy;
      this.local = local;
      this.ls = {
        token: "pivotal-tracker-token",
        user: "pivotal-tracker-current-user"
      };
      this.projectId = null;
      this._projects = [];
      this._currentUser = this.local.g(this.ls.user) || null;
      this._users = {};
      this._token = this.local.g(this.ls.token) || null;
      this._configureClient();
    }

    Tracker.prototype._configureClient = function _configureClient() {
      var _this = this;

      this.client.configure(function (config) {
        config.withBaseUrl("https://www.pivotaltracker.com/services/v5/").withDefaults({
          headers: {
            "X-TrackerToken": _this._token
          }
        });
      });
    };

    Tracker.prototype._fetch = function _fetch(url, inBackground) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (inBackground !== true) {
          _this2.busy.on();
        }

        _this2.client.fetch(url).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.kind !== "error") {
            resolve(response);
          } else {
            _this2.currentUser = null;
            reject(new Error(response.code));
          }
          _this2.busy.off();
        }).catch(function (error) {
          _this2.currentUser = null;
          reject(error);
          _this2.busy.off();
        });
      });
    };

    Tracker.prototype.getProject = function getProject(projectId) {
      var _this3 = this;

      projectId = parseInt(projectId);

      return new Promise(function (resolve, reject) {
        _this3.getProjects().then(function (projects) {
          projects.forEach(function (item) {
            if (item.id === projectId) {
              resolve(item);
            }
          });
          resolve();
        }).catch(function (error) {
          return reject(error);
        });
      });
    };

    Tracker.prototype.getProjects = function getProjects() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (_this4._projects && _this4._projects.length > 0) {
          return resolve(_this4._projects);
        }

        _this4._fetch("projects").then(function (projects) {
          _this4._projects = projects;
          resolve(_this4._projects);
        }).catch(function (error) {
          return reject(error);
        });
      });
    };

    Tracker.prototype.getCurrent = function getCurrent(inBackground) {
      return this._fetch("projects/" + this.projectId + "/iterations?scope=current_backlog&limit=1", inBackground);
    };

    Tracker.prototype.getUsers = function getUsers() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        if (_this5._users[_this5.projectId] && _this5._users[_this5.projectId].length > 0) {
          return resolve(_this5._users[_this5.projectId]);
        }

        _this5._fetch("projects/" + _this5.projectId + "/memberships").then(function (users) {
          _this5._users[_this5.projectId] = users;
          resolve(_this5._users[_this5.projectId]);
        }).catch(function (error) {
          return reject(error);
        });
      });
    };

    Tracker.prototype.isValid = function isValid() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        if (_this6.currentUser) {
          return resolve(_this6.currentUser);
        }

        if (!_this6._token) {
          return reject(new Error("No token set"));
        }

        _this6.client.fetch("me").then(function (response) {
          return response.json();
        }).then(function (result) {
          if (result.kind !== "error") {
            _this6.currentUser = result;
            resolve(_this6.currentUser);
          } else {
            _this6.currentUser = null;
            reject(new Error(response.code));
          }
        }).catch(function (error) {
          _this6.currentUser = null;
          reject(error);
        });
      });
    };

    _createClass(Tracker, [{
      key: "currentUser",
      set: function set(value) {
        if (value) {
          this._currentUser = value;
          this.local.s(this.ls.user, value);
        } else {
          this._currentUser = null;
          this.local.d(this.ls);
        }
      },
      get: function get() {
        return this._token ? this._currentUser : null;
      }
    }, {
      key: "token",
      set: function set(value) {
        if (!value) {
          this._currentUser = null;
          this._projectId = null;
        }

        this._token = value;

        this.local.s(this.ls.token, value);

        this._configureClient();
      }
    }]);

    return Tracker;
  }()) || _class);
});
define('pages/backlog/filter-columns',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var FilterColumnsValueConverter = exports.FilterColumnsValueConverter = function () {
    function FilterColumnsValueConverter() {
      _classCallCheck(this, FilterColumnsValueConverter);
    }

    FilterColumnsValueConverter.prototype.toView = function toView(array, config) {
      if (Array.isArray(array) === false) {
        return array;
      }

      var value = config.value;
      if (Array.isArray(value) === false) {
        value = [value];
      }

      return array.slice(0).filter(function (item) {
        if (config.basedOn === "state") {
          for (var i = 0; i < value.length; i++) {
            if (item.current_state === value[i]) {
              return true;
            }
          }
        } else {
          for (var i = 0; i < value.length; i++) {
            for (var y = 0; y < item.labels.length; y++) {
              if (item.labels[y].name === value[i]) {
                return true;
              }
            }
          }
        }

        return false;
      });
    };

    return FilterColumnsValueConverter;
  }();
});
define('pages/backlog/sprint',["exports", "aurelia-framework", "aurelia-router", "./../../services/tracker", "./../../services/settings"], function (exports, _aureliaFramework, _aureliaRouter, _tracker, _settings) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Sprint = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Sprint = exports.Sprint = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _tracker.Tracker, _settings.Settings), _dec(_class = function () {
    function Sprint(router, tracker, settings) {
      _classCallCheck(this, Sprint);

      this.columns = settings.columns;
      this.router = router;
      this.tracker = tracker;
      this.iteration = {};
      this.timeout = null;
      this.pollInterval = 60000;
      this.users = [];
    }

    Sprint.prototype.activate = function activate(params, routeConfig) {
      var _this = this;

      this.tracker.projectId = this.projectId = params.id;
      this.tracker.getUsers().then(function (users) {
        return _this.users = users;
      }).catch(function (error) {
        return _this.router.navigate("");
      });
      this.startPoll(true);
    };

    Sprint.prototype.deactivate = function deactivate() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    };

    Sprint.prototype.getUser = function getUser(userId) {
      userId = parseInt(userId);

      for (var i = 0; i < this.users.length; i++) {
        var user = this.users[i];

        if (userId === user.person.id) {
          return user;
        }
      }
    };

    Sprint.prototype.startPoll = function startPoll(isFirst) {
      var _this2 = this;

      this.tracker.getCurrent(!isFirst).then(function (iteration) {
        _this2.iteration = iteration[0];
        _this2.timeout = setTimeout(_this2.startPoll.bind(_this2), _this2.pollInterval);
      }).catch(function (error) {
        return _this2.router.navigate("");
      });
    };

    return Sprint;
  }()) || _class);
});
define('pages/login/login',["exports", "aurelia-framework", "aurelia-router", "./../../services/tracker"], function (exports, _aureliaFramework, _aureliaRouter, _tracker) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_tracker.Tracker, _aureliaRouter.Router), _dec(_class = function () {
    function Login(tracker, router) {
      _classCallCheck(this, Login);

      this.tracker = tracker;
      this.router = router;

      this.placeholder = "Enter API token..";
      this.token = "4ea441cc4dcb4ee87426549edd244a95";
    }

    Login.prototype.setToken = function setToken() {
      var _this = this;

      if (this.token.length > 0) {
        this.tracker.token = this.token;
        this.tracker.isValid().then(function (result) {
          _this.router.navigate("select-project");
        }).catch(function (error) {
          console.log("Try again, stupid");
        });
      } else {
        console.log("Try again, stupid 2");
      }
    };

    return Login;
  }()) || _class);
});
define('pages/projects/select',["exports", "aurelia-framework", "aurelia-router", "./../../services/tracker"], function (exports, _aureliaFramework, _aureliaRouter, _tracker) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Select = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Select = exports.Select = (_dec = (0, _aureliaFramework.inject)(_tracker.Tracker, _aureliaRouter.Router), _dec(_class = function () {
    function Select(tracker, router) {
      _classCallCheck(this, Select);

      this.tracker = tracker;
      this.tracker.projectId = null;
      this.router = router;
      this.projects = [];
    }

    Select.prototype.attached = function attached() {
      var _this = this;

      this.tracker.getProjects().then(function (projects) {
        return _this.projects = projects;
      }).catch(function (error) {
        return _this.router.navigate("");
      });
    };

    return Select;
  }()) || _class);
});
define('pages/settings/change',["exports", "aurelia-framework", "aurelia-binding", "aurelia-templating-resources", "./../../services/tracker", "./../../services/settings", "./filter-available-options"], function (exports, _aureliaFramework, _aureliaBinding, _aureliaTemplatingResources, _tracker, _settings, _filterAvailableOptions) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Change = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Change = exports.Change = (_dec = (0, _aureliaFramework.inject)(_aureliaTemplatingResources.BindingSignaler, _tracker.Tracker, _settings.Settings, _filterAvailableOptions.FilterAvailableOptionsValueConverter), _dec(_class = function () {
    function Change(bindingSignaler, tracker, settings, filter) {
      _classCallCheck(this, Change);

      this.bindingSignaler = bindingSignaler;
      this.tracker = tracker;
      this.settings = settings;
      this.filter = filter;
      this.subscriptions = [];
    }

    Change.prototype.activate = function activate() {
      this.availableStoryStates = this.filter.toView(this.settings.storyStates, this.settings.columns).length > 0;
    };

    Change.prototype.deactivate = function deactivate() {
      var subscription = void 0;
      while (subscription = this.subscriptions.pop()) {
        subscription.dispose();
      }
    };

    Change.prototype.valueArrayChanged = function valueArrayChanged(newValue, oldValue) {
      console.log(newValue);
    };

    Change.prototype.valueHasChanged = function valueHasChanged() {
      this.bindingSignaler.signal("available-options-changed");
    };

    Change.prototype.removeValueFromColumn = function removeValueFromColumn(value, column) {
      column.value.splice(column.value.indexOf(value), 1);

      this.availableStoryStates = this.filter.toView(this.settings.storyStates, this.settings.columns).length > 0;
    };

    Change.prototype.addValueForColumn = function addValueForColumn(column) {
      if (column.basedOn === "label") {
        return column.value.push("");
      }

      var available = this.filter.toView(this.settings.storyStates, this.settings.columns);

      if (available && available.length > 0) {
        column.value.push(available[0]);
      }

      this.availableStoryStates = available.length > 1;
      this.bindingSignaler.signal("available-options-changed");
    };

    Change.prototype.hasEmptyLabel = function hasEmptyLabel(column) {
      return column.value.find(function (item) {
        return item.length === 0;
      }) !== undefined;
    };

    Change.prototype.back = function back() {
      history.back();
    };

    return Change;
  }()) || _class);
});
define('pages/settings/filter-available-options',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var FilterAvailableOptionsValueConverter = exports.FilterAvailableOptionsValueConverter = function () {
    function FilterAvailableOptionsValueConverter() {
      _classCallCheck(this, FilterAvailableOptionsValueConverter);
    }

    FilterAvailableOptionsValueConverter.prototype.toView = function toView(array, config, except) {
      if (Array.isArray(array) === false) {
        return array;
      }

      array = array.slice(0);

      config.forEach(function (item) {
        if (item.basedOn !== "state") {
          return;
        }

        item.value.forEach(function (val) {
          if (val !== except && array.indexOf(val) !== -1) {
            array.splice(array.indexOf(val), 1);
          }
        });
      });

      return array;
    };

    return FilterAvailableOptionsValueConverter;
  }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <div id=\"spinner\" if.bind=\"busy.isBusy\"></div>\r\n  <header>\r\n    <div class=\"project-info\">\r\n      ${project.name}\r\n    </div>\r\n    <a class=\"switch-project\" if.bind=\"project.name\" route-href=\"route: select-project\">&#10006;</a>\r\n    <div if.bind=\"user.name\" class=\"user-info\">\r\n      <span class=\"logged-in-as\">\r\n        ${user.name}\r\n      </span>\r\n      <a click.trigger=\"logout()\">Logout</a>\r\n    </div>\r\n    <nav>\r\n      <ul class=\"settings\">\r\n        <li if.bind=\"user.name\" class=\"settings\">\r\n          <a route-href=\"route: settings\">&#9881;</a>\r\n        </li>\r\n        <li class=\"switch-mode ${isEnlarged ? 'enlarged' : ''}\">\r\n          <a click.trigger=\"toggleEnlarged()\"></a>\r\n        </li>\r\n      </ul>\r\n    </nav>\r\n  </header>\r\n  <router-view class=\"${isEnlarged ? 'enlarged' : ''}\"></router-view>\r\n</template>\r\n"; });
define('text!assets/styles/animations.css', ['module'], function(module) { module.exports = "@-webkit-keyframes scale-it {\r\n    0% { \r\n        -webkit-transform: scale(0);\r\n    }\r\n    100% {\r\n        -webkit-transform: scale(1.0);\r\n        opacity: 0;\r\n    }\r\n}\r\n@keyframes scale-it {\r\n    0% { \r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n    }\r\n    100% {\r\n        -webkit-transform: scale(1.0);\r\n        transform: scale(1.0);\r\n        opacity: 0;\r\n    }\r\n}\r\n@-webkit-keyframes fade-in {\r\n    0% {\r\n        opacity: 0;\r\n        visibility: hidden;\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n        visibility: visible;\r\n    }\r\n}\r\n@keyframes fade-in {\r\n    0% {\r\n        opacity: 0;\r\n        visibility: hidden;\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n        visibility: visible;\r\n    }\r\n}\r\n@-webkit-keyframes fade-out {\r\n    0% {\r\n        opacity: 1;\r\n        visibility: visible;\r\n    }\r\n    100% {\r\n        opacity: 0;\r\n        visibility: hidden;\r\n    }\r\n}\r\n@keyframes fade-out {\r\n    0% {\r\n        opacity: 1;\r\n        visibility: visible;\r\n    }\r\n    100% {\r\n        opacity: 0;\r\n        visibility: hidden;\r\n    }\r\n}"; });
define('text!pages/backlog/sprint.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./filter-columns\"></require>\r\n  <div class=\"sprint-backlog-headers\">\r\n    <span repeat.for=\"column of columns\" class=\"column\">${column.title}</span>\r\n  </div>\r\n  <div class=\"sprint-backlog\">\r\n    <ul repeat.for=\"column of columns\" class=\"column\">\r\n      <li repeat.for=\"story of iteration.stories | filterColumns:column\" class=\"${story.story_type}\">\r\n        <div class=\"header\">\r\n          <div class=\"owners\">\r\n            <span repeat.for=\"ownerId of story.owner_ids\" class=\"owner\">\r\n              ${getUser(ownerId).person.initials}\r\n            </span>\r\n          </div>\r\n          <span class=\"estimate\">${story.estimate}</span>\r\n        </div>\r\n        <span class=\"title\">\r\n          ${story.name}\r\n        </span>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</template>\r\n"; });
define('text!assets/styles/app.css', ['module'], function(module) { module.exports = "html, body {\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\nbody {\r\n  background-color: #e9e9e9;\r\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\r\n  font-size: 14px;\r\n}\r\np {\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n#spinner {\r\n  width: 80px;\r\n  height: 80px;\r\n  background-color: #333;\r\n  border-radius: 100%;  \r\n  -webkit-animation: scale-it 1s infinite ease-in-out;\r\n  animation: scale-it 1.0s infinite ease-in-out;\r\n  position: absolute;\r\n  top: 50%;\r\n  margin-top: -40px;\r\n  left: 50%;\r\n  margin-left: -40px;\r\n  z-index: 2;\r\n}\r\n#error {\r\n  display: none;\r\n  -webkit-animation: fade-out 0.2s forwards ease-in-out;\r\n  animation: fade-out 0.2s forwards ease-in-out;\r\n  position: absolute;\r\n  top: 100px;\r\n  background-color: #E3757E;\r\n  padding-top: 35px;\r\n  box-shadow: 0 0 3px #ccc;\r\n  width: 400px;\r\n  left: 50%;\r\n  margin-left: -200px;\r\n}\r\n#error.visible {\r\n  -webkit-animation: fade-in 0.2s forwards ease-in-out;\r\n  animation: fade-in 0.2s forwards ease-in-out;\r\n}\r\n#error:before {\r\n  content: \"X\";\r\n  color: #fff;\r\n  position: absolute;\r\n  top: 5px;\r\n  width: 20px;\r\n  text-align: center;\r\n  line-height: 20px;\r\n  font-size: 13px;\r\n  font-weight: 700;\r\n  margin: 0 auto;\r\n  margin-left: 5px;\r\n  border: 2px solid #fff;\r\n  border-radius: 100%;\r\n  height: 20px;\r\n}\r\n#error #error-message {\r\n  width: 100%;\r\n  background-color: #fff;\r\n  text-align: center;\r\n  line-height: 25px;\r\n  padding: 10px 0;\r\n}\r\nheader {\r\n  width: 100%;\r\n  height: 50px;\r\n  background-color: #222;\r\n}\r\nheader ul {\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n}\r\nheader .project-info {\r\n  font-size: 20px;\r\n  float: left;\r\n  line-height: 50px;\r\n  margin-left: 15px;\r\n  color: #fff;\r\n}\r\nheader .switch-project {\r\n  text-decoration: none;\r\n  line-height: 35px;\r\n  float: left;\r\n  color: #fff;\r\n  margin-left: 4px;\r\n  font-size: 11px;\r\n  cursor: pointer;\r\n}\r\nheader .switch-project:hover {\r\n  color: #e0e0e0;\r\n}\r\nheader nav {\r\n  float: right;\r\n  line-height: 50px;\r\n}\r\nheader nav ul li {\r\n  float: left;\r\n  margin-right: 30px;\r\n  height: 50px;\r\n}\r\nheader nav .settings li a {\r\n  color: #fff;\r\n  cursor: pointer;\r\n  font-size: 20px;\r\n  text-decoration: none;\r\n  line-height: 50px;\r\n}\r\nheader nav .switch-mode a:before, header nav .switch-mode a:after {\r\n  content: \"A\";\r\n}\r\nheader nav .switch-mode a:before {\r\n  font-size: 12px;\r\n}\r\nheader nav .switch-mode a:after {\r\n  font-size: 20px;\r\n}\r\nheader nav .switch-mode.enlarged a:before {\r\n  font-size: 20px;\r\n}\r\nheader nav .switch-mode.enlarged a:after {\r\n  font-size: 12px;\r\n}\r\nheader nav .switch-mode:hover {\r\n  color: #e0e0e0;\r\n}\r\nheader .user-info {\r\n  float: right;\r\n  line-height: 50px;\r\n  margin: 8px 15px 0 0;\r\n  text-align: right;\r\n}\r\nheader .user-info span, header .user-info a {\r\n  line-height: 16px;\r\n  color: #fff;\r\n  display: block;\r\n}\r\nheader .user-info span {\r\n  font-size: 11px;\r\n}\r\nheader .user-info a {\r\n  cursor: pointer;\r\n}\r\nheader .user-info a:hover {\r\n  color: #e0e0e0;\r\n}\r\n#enter-token {\r\n  width: 410px;\r\n  height: 50px;\r\n  left: 50%;\r\n  margin-left: -205px;\r\n  top: 50%;\r\n  margin-top: -25px;\r\n  position: fixed;\r\n  box-shadow: 0 0 3px #ccc;\r\n}\r\n#enter-token input[type=text] {\r\n  border: none;\r\n  line-height: 50px;\r\n  padding: 0 10px;\r\n  font-size: 20px;\r\n  background-color: #fff;\r\n  width: 340px;\r\n  float: left;\r\n}\r\n#enter-token button {\r\n  padding: 0;\r\n  margin: 0;\r\n  border: none;\r\n  background-color: #333;\r\n  color: #fff;\r\n  width: 50px;\r\n  text-align: center;\r\n  line-height: 50px;\r\n  float: left;\r\n  cursor: pointer;\r\n  font-size: 18px;\r\n}\r\n#enter-token button:hover {\r\n  background-color: #444;\r\n}\r\n#select-projects-list {\r\n  width: 600px;\r\n  margin: 80px auto;\r\n  list-style: none;\r\n  max-width: calc(100% - 160px);\r\n  padding: 0;\r\n}\r\n#select-projects-list .project a {\r\n  display: block;\r\n  font-size: 22px;\r\n  line-height: 60px;\r\n  background-color: #fff;\r\n  box-shadow: 0 0 3px #ccc;\r\n  padding: 0 20px;\r\n  margin-bottom: 10px;\r\n  cursor: pointer;\r\n  color: #444;\r\n  box-shadow: 0 0 2px #999;\r\n}\r\n#select-projects-list .project a:hover {\r\n  background-color: #f9f9f9;\r\n}\r\n#select-projects-list .project a {\r\n  text-decoration: none;\r\n  color: #111;\r\n}\r\n.sprint-backlog-headers {\r\n  width: 100%;\r\n  background-color: #333;\r\n  height: 40px;\r\n  box-shadow: 0 0 2px #111;\r\n}\r\n.sprint-backlog-headers span {\r\n  float: left;\r\n  display: block;\r\n  width: 20%;\r\n  margin: 0;\r\n  padding: 0;\r\n  font-size: 1.3em;\r\n  text-align: center;\r\n  color: #fff;\r\n  text-transform: uppercase;\r\n  line-height: 40px;\r\n}\r\n.sprint-backlog .column {\r\n  display: block;\r\n  float: left;\r\n  width: 20%;\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n}\r\n.sprint-backlog .column li {\r\n  margin: 15px 15px 15px 0;\r\n  padding: 0;\r\n  height: 100px;\r\n  box-shadow: 0 0 3px #ccc;\r\n  background-color: #fff;\r\n}\r\n.sprint-backlog .column:first-child li {\r\n  margin-left: 15px;\r\n}\r\n.sprint-backlog .column li .header {\r\n  padding: 0 10px;\r\n  color: #fff;\r\n  display: block;\r\n  line-height: 25px;\r\n  height: 25px;\r\n  font-size: 13px;\r\n}\r\n.sprint-backlog .column li .header .owners {\r\n  float: left;\r\n}\r\n.sprint-backlog .column li .header .owners .owner:after {\r\n  content: \", \";\r\n}\r\n.sprint-backlog .column li .header .owners .owner:last-child:after {\r\n  content: \"\";\r\n}\r\n.sprint-backlog .column li .header .estimate {\r\n  float: right;\r\n}\r\n.sprint-backlog .column li.feature .header {\r\n  background-color: #F2C12E;\r\n}\r\n.sprint-backlog .column li.bug .header {\r\n  background-color: #E74C3C;\r\n}\r\n.sprint-backlog .column li.release .header {\r\n  background-color: #3498DB;\r\n}\r\n.sprint-backlog .column li.chore .header {\r\n  background-color: #2C3E50;\r\n}\r\n.sprint-backlog .column li .title {\r\n  margin: 8px;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 3;\r\n  -webkit-box-orient: vertical;\r\n  overflow: hidden;\r\n  line-height: 20px;\r\n}\r\n.enlarged .sprint-backlog .column li {\r\n  height: 110px;\r\n  box-shadow: 0 0 3px #888;\r\n}\r\n.enlarged .sprint-backlog .column li .header {\r\n  width: 30px;\r\n  float: left;\r\n  height: 110px;\r\n  padding: 0;\r\n  position: relative;\r\n}\r\n.enlarged .sprint-backlog .column li .header .estimate {\r\n  display: block;\r\n  float: none;\r\n  width: 100%;\r\n  text-align: center;\r\n}\r\n.enlarged .sprint-backlog .column li .header .owners {\r\n  display: block;\r\n  width: 100%;\r\n  float: none;\r\n  position: absolute;\r\n  bottom: 3px;\r\n  left: 0;\r\n  text-align: center;\r\n  line-height: 18px;\r\n}\r\n.enlarged .sprint-backlog .column li .header .owners .owner {\r\n  display: block;\r\n}\r\n.enlarged .sprint-backlog .column li .header .owners .owner:after {\r\n  content: \"\";\r\n}\r\n.enlarged .sprint-backlog .column li .title {\r\n  font-size: 19px;\r\n  -webkit-line-clamp: 4;\r\n  margin-left: 0;\r\n  line-height: 25px;\r\n  padding: 2px 0 0 7px;\r\n}\r\n"; });
define('text!pages/login/login.html', ['module'], function(module) { module.exports = "<template>\r\n  <form id=\"enter-token\" submit.trigger=\"setToken()\">\r\n    <input type=\"text\" value.bind=\"token\" placeholder.bind=\"placeholder\" />\r\n    <button type=\"submit\">Ok</button>\r\n  </form>\r\n</template>\r\n"; });
define('text!pages/projects/select.html', ['module'], function(module) { module.exports = "<template>\r\n  <ul id=\"select-projects-list\">\r\n    <li repeat.for=\"project of projects\" class=\"project\">\r\n      <a route-href=\"route: sprint-backlog; params.bind: { id:project.id }\" class=\"title\">\r\n        ${project.name}\r\n      </a>\r\n    </li>\r\n  </ul>\r\n</template>\r\n"; });
define('text!pages/settings/change.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./filter-available-options\"></require>\r\n  <a click.trigger=\"back()\">Back</a>\r\n  <fieldset repeat.for=\"column of settings.columns\">\r\n    <input name=\"title\" value.bind=\"column.title\" />\r\n    <select value.bind=\"column.basedOn\">\r\n      <option repeat.for=\"option of settings.columnBaseTypes\" value.bind=\"option\">\r\n        ${option}\r\n      </option>\r\n    </select>\r\n    <div repeat.for=\"value of column.value\">\r\n      <input value.bind=\"value\" if.bind=\"column.basedOn === 'label'\" />\r\n      <select value.bind=\"column.value[$index]\"\r\n          if.bind=\"column.basedOn === 'state'\"\r\n          change.trigger=\"valueHasChanged(column.value[$index])\">\r\n        <option \r\n            repeat.for=\"option of settings.storyStates | filterAvailableOptions:settings.columns:column.value[$index] & signal:'available-options-changed'\"\r\n            value.bind=\"option\">\r\n          ${option}\r\n        </option>\r\n      </select>\r\n      <input type=\"submit\" value=\"Remove\" \r\n          click.delegate=\"removeValueFromColumn(value, column)\" />\r\n    </div>\r\n    <input type=\"submit\"value=\"Add\"\r\n        if.bind=\"column.basedOn === 'label' || availableStoryStates\"\r\n        click.delegate=\"addValueForColumn(column)\" />\r\n  </fieldset>\r\n</template>\r\n"; });
//# sourceMappingURL=app-bundle.js.map