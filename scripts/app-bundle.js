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
define('pages/settings/change',["exports", "aurelia-framework", "aurelia-binding", "./../../services/tracker", "./../../services/settings", "./filter-available-options"], function (exports, _aureliaFramework, _aureliaBinding, _tracker, _settings, _filterAvailableOptions) {
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

  var Change = exports.Change = (_dec = (0, _aureliaFramework.inject)(_aureliaBinding.BindingEngine, _tracker.Tracker, _settings.Settings, _filterAvailableOptions.FilterAvailableOptionsValueConverter), _dec(_class = function () {
    function Change(bindingEngine, tracker, settings, filter) {
      _classCallCheck(this, Change);

      this.bindingEngine = bindingEngine;
      this.tracker = tracker;
      this.settings = settings;
      this.filter = filter;
      this.subscriptions = [];
    }

    Change.prototype.activate = function activate() {
      this.availableStoryStates = this.filter.toView(this.settings.storyStates, this.settings.columns).length > 0;
    };

    Change.prototype.deactivate = function deactivate() {
      var subscription;
      while (subscription = this.subscriptions.pop()) {
        subscription.dispose();
      }
    };

    Change.prototype.valueArrayChanged = function valueArrayChanged(newValue, oldValue) {
      console.log(newValue);
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <div id=\"spinner\" if.bind=\"busy.isBusy\"></div>\n  <header>\n    <div class=\"project-info\">\n      ${project.name}\n    </div>\n    <a class=\"switch-project\" if.bind=\"project.name\" route-href=\"route: select-project\">&#10006;</a>\n    <div if.bind=\"user.name\" class=\"user-info\">\n      <span class=\"logged-in-as\">\n        ${user.name}\n      </span>\n      <a click.trigger=\"logout()\">Logout</a>\n    </div>\n    <nav>\n      <ul class=\"settings\">\n        <li if.bind=\"user.name\" class=\"settings\">\n          <a route-href=\"route: settings\">&#9881;</a>\n        </li>\n        <li class=\"switch-mode ${isEnlarged ? 'enlarged' : ''}\">\n          <a click.trigger=\"toggleEnlarged()\"></a>\n        </li>\n      </ul>\n    </nav>\n  </header>\n  <router-view class=\"${isEnlarged ? 'enlarged' : ''}\"></router-view>\n</template>\n"; });
define('text!assets/styles/animations.css', ['module'], function(module) { module.exports = "@-webkit-keyframes scale-it {\n    0% { \n        -webkit-transform: scale(0);\n    }\n    100% {\n        -webkit-transform: scale(1.0);\n        opacity: 0;\n    }\n}\n@keyframes scale-it {\n    0% { \n        -webkit-transform: scale(0);\n        transform: scale(0);\n    }\n    100% {\n        -webkit-transform: scale(1.0);\n        transform: scale(1.0);\n        opacity: 0;\n    }\n}\n@-webkit-keyframes fade-in {\n    0% {\n        opacity: 0;\n        visibility: hidden;\n    }\n    100% {\n        opacity: 1;\n        visibility: visible;\n    }\n}\n@keyframes fade-in {\n    0% {\n        opacity: 0;\n        visibility: hidden;\n    }\n    100% {\n        opacity: 1;\n        visibility: visible;\n    }\n}\n@-webkit-keyframes fade-out {\n    0% {\n        opacity: 1;\n        visibility: visible;\n    }\n    100% {\n        opacity: 0;\n        visibility: hidden;\n    }\n}\n@keyframes fade-out {\n    0% {\n        opacity: 1;\n        visibility: visible;\n    }\n    100% {\n        opacity: 0;\n        visibility: hidden;\n    }\n}"; });
define('text!pages/login/login.html', ['module'], function(module) { module.exports = "<template>\n  <form id=\"enter-token\" submit.trigger=\"setToken()\">\n    <input type=\"text\" value.bind=\"token\" placeholder.bind=\"placeholder\" />\n    <button type=\"submit\">Ok</button>\n  </form>\n</template>\n"; });
define('text!assets/styles/app.css', ['module'], function(module) { module.exports = "html, body {\n  margin: 0;\n  padding: 0;\n}\nbody {\n  background-color: #e9e9e9;\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  font-size: 14px;\n}\np {\n  margin: 0;\n  padding: 0;\n}\n#spinner {\n  width: 80px;\n  height: 80px;\n  background-color: #333;\n  border-radius: 100%;  \n  -webkit-animation: scale-it 1s infinite ease-in-out;\n  animation: scale-it 1.0s infinite ease-in-out;\n  position: absolute;\n  top: 50%;\n  margin-top: -40px;\n  left: 50%;\n  margin-left: -40px;\n  z-index: 2;\n}\n#error {\n  display: none;\n  -webkit-animation: fade-out 0.2s forwards ease-in-out;\n  animation: fade-out 0.2s forwards ease-in-out;\n  position: absolute;\n  top: 100px;\n  background-color: #E3757E;\n  padding-top: 35px;\n  box-shadow: 0 0 3px #ccc;\n  width: 400px;\n  left: 50%;\n  margin-left: -200px;\n}\n#error.visible {\n  -webkit-animation: fade-in 0.2s forwards ease-in-out;\n  animation: fade-in 0.2s forwards ease-in-out;\n}\n#error:before {\n  content: \"X\";\n  color: #fff;\n  position: absolute;\n  top: 5px;\n  width: 20px;\n  text-align: center;\n  line-height: 20px;\n  font-size: 13px;\n  font-weight: 700;\n  margin: 0 auto;\n  margin-left: 5px;\n  border: 2px solid #fff;\n  border-radius: 100%;\n  height: 20px;\n}\n#error #error-message {\n  width: 100%;\n  background-color: #fff;\n  text-align: center;\n  line-height: 25px;\n  padding: 10px 0;\n}\nheader {\n  width: 100%;\n  height: 50px;\n  background-color: #222;\n}\nheader ul {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\nheader .project-info {\n  font-size: 20px;\n  float: left;\n  line-height: 50px;\n  margin-left: 15px;\n  color: #fff;\n}\nheader .switch-project {\n  text-decoration: none;\n  line-height: 35px;\n  float: left;\n  color: #fff;\n  margin-left: 4px;\n  font-size: 11px;\n  cursor: pointer;\n}\nheader .switch-project:hover {\n  color: #e0e0e0;\n}\nheader nav {\n  float: right;\n  line-height: 50px;\n}\nheader nav ul li {\n  float: left;\n  margin-right: 30px;\n  height: 50px;\n}\nheader nav .settings li a {\n  color: #fff;\n  cursor: pointer;\n  font-size: 20px;\n  text-decoration: none;\n  line-height: 50px;\n}\nheader nav .switch-mode a:before, header nav .switch-mode a:after {\n  content: \"A\";\n}\nheader nav .switch-mode a:before {\n  font-size: 12px;\n}\nheader nav .switch-mode a:after {\n  font-size: 20px;\n}\nheader nav .switch-mode.enlarged a:before {\n  font-size: 20px;\n}\nheader nav .switch-mode.enlarged a:after {\n  font-size: 12px;\n}\nheader nav .switch-mode:hover {\n  color: #e0e0e0;\n}\nheader .user-info {\n  float: right;\n  line-height: 50px;\n  margin: 8px 15px 0 0;\n  text-align: right;\n}\nheader .user-info span, header .user-info a {\n  line-height: 16px;\n  color: #fff;\n  display: block;\n}\nheader .user-info span {\n  font-size: 11px;\n}\nheader .user-info a {\n  cursor: pointer;\n}\nheader .user-info a:hover {\n  color: #e0e0e0;\n}\n#enter-token {\n  width: 410px;\n  height: 50px;\n  left: 50%;\n  margin-left: -205px;\n  top: 50%;\n  margin-top: -25px;\n  position: fixed;\n  box-shadow: 0 0 3px #ccc;\n}\n#enter-token input[type=text] {\n  border: none;\n  line-height: 50px;\n  padding: 0 10px;\n  font-size: 20px;\n  background-color: #fff;\n  width: 340px;\n  float: left;\n}\n#enter-token button {\n  padding: 0;\n  margin: 0;\n  border: none;\n  background-color: #333;\n  color: #fff;\n  width: 50px;\n  text-align: center;\n  line-height: 50px;\n  float: left;\n  cursor: pointer;\n  font-size: 18px;\n}\n#enter-token button:hover {\n  background-color: #444;\n}\n#select-projects-list {\n  width: 600px;\n  margin: 80px auto;\n  list-style: none;\n  max-width: calc(100% - 160px);\n  padding: 0;\n}\n#select-projects-list .project a {\n  display: block;\n  font-size: 22px;\n  line-height: 60px;\n  background-color: #fff;\n  box-shadow: 0 0 3px #ccc;\n  padding: 0 20px;\n  margin-bottom: 10px;\n  cursor: pointer;\n  color: #444;\n  box-shadow: 0 0 2px #999;\n}\n#select-projects-list .project a:hover {\n  background-color: #f9f9f9;\n}\n#select-projects-list .project a {\n  text-decoration: none;\n  color: #111;\n}\n.sprint-backlog-headers {\n  width: 100%;\n  background-color: #333;\n  height: 40px;\n  box-shadow: 0 0 2px #111;\n}\n.sprint-backlog-headers span {\n  float: left;\n  display: block;\n  width: 20%;\n  margin: 0;\n  padding: 0;\n  font-size: 1.3em;\n  text-align: center;\n  color: #fff;\n  text-transform: uppercase;\n  line-height: 40px;\n}\n.sprint-backlog .column {\n  display: block;\n  float: left;\n  width: 20%;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.sprint-backlog .column li {\n  margin: 15px 15px 15px 0;\n  padding: 0;\n  height: 100px;\n  box-shadow: 0 0 3px #ccc;\n  background-color: #fff;\n}\n.sprint-backlog .column:first-child li {\n  margin-left: 15px;\n}\n.sprint-backlog .column li .header {\n  padding: 0 10px;\n  color: #fff;\n  display: block;\n  line-height: 25px;\n  height: 25px;\n  font-size: 13px;\n}\n.sprint-backlog .column li .header .owners {\n  float: left;\n}\n.sprint-backlog .column li .header .owners .owner:after {\n  content: \", \";\n}\n.sprint-backlog .column li .header .owners .owner:last-child:after {\n  content: \"\";\n}\n.sprint-backlog .column li .header .estimate {\n  float: right;\n}\n.sprint-backlog .column li.feature .header {\n  background-color: #F2C12E;\n}\n.sprint-backlog .column li.bug .header {\n  background-color: #E74C3C;\n}\n.sprint-backlog .column li.release .header {\n  background-color: #3498DB;\n}\n.sprint-backlog .column li.chore .header {\n  background-color: #2C3E50;\n}\n.sprint-backlog .column li .title {\n  margin: 8px;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  line-height: 20px;\n}\n.enlarged .sprint-backlog .column li {\n  height: 110px;\n  box-shadow: 0 0 3px #888;\n}\n.enlarged .sprint-backlog .column li .header {\n  width: 30px;\n  float: left;\n  height: 110px;\n  padding: 0;\n  position: relative;\n}\n.enlarged .sprint-backlog .column li .header .estimate {\n  display: block;\n  float: none;\n  width: 100%;\n  text-align: center;\n}\n.enlarged .sprint-backlog .column li .header .owners {\n  display: block;\n  width: 100%;\n  float: none;\n  position: absolute;\n  bottom: 3px;\n  left: 0;\n  text-align: center;\n  line-height: 18px;\n}\n.enlarged .sprint-backlog .column li .header .owners .owner {\n  display: block;\n}\n.enlarged .sprint-backlog .column li .header .owners .owner:after {\n  content: \"\";\n}\n.enlarged .sprint-backlog .column li .title {\n  font-size: 19px;\n  -webkit-line-clamp: 4;\n  margin-left: 0;\n  line-height: 25px;\n  padding: 2px 0 0 7px;\n}\n"; });
define('text!pages/backlog/sprint.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./filter-columns\"></require>\n  <div class=\"sprint-backlog-headers\">\n    <span repeat.for=\"column of columns\" class=\"column\">${column.title}</span>\n  </div>\n  <div class=\"sprint-backlog\">\n    <ul repeat.for=\"column of columns\" class=\"column\">\n      <li repeat.for=\"story of iteration.stories | filterColumns:column\" class=\"${story.story_type}\">\n        <div class=\"header\">\n          <div class=\"owners\">\n            <span repeat.for=\"ownerId of story.owner_ids\" class=\"owner\">\n              ${getUser(ownerId).person.initials}\n            </span>\n          </div>\n          <span class=\"estimate\">${story.estimate}</span>\n        </div>\n        <span class=\"title\">\n          ${story.name}\n        </span>\n      </li>\n    </ul>\n  </div>\n</template>\n"; });
define('text!pages/projects/select.html', ['module'], function(module) { module.exports = "<template>\n  <ul id=\"select-projects-list\">\n    <li repeat.for=\"project of projects\" class=\"project\">\n      <a route-href=\"route: sprint-backlog; params.bind: { id:project.id }\" class=\"title\">\n        ${project.name}\n      </a>\n    </li>\n  </ul>\n</template>\n"; });
define('text!pages/settings/change.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./filter-available-options\"></require>\n  <a click.trigger=\"back()\">Back</a>\n  <fieldset repeat.for=\"column of settings.columns\">\n    <input name=\"title\" value.bind=\"column.title\" />\n    <select value.bind=\"column.basedOn\">\n      <option repeat.for=\"option of settings.columnBaseTypes\" value.bind=\"option\">\n        ${option}\n      </option>\n    </select>\n    <div repeat.for=\"value of column.value\">\n      <input value.bind=\"value\" if.bind=\"column.basedOn === 'label'\" />\n      <select value.bind=\"column.value[$index]\" if.bind=\"column.basedOn === 'state'\">\n        <option \n            repeat.for=\"option of settings.storyStates | filterAvailableOptions:settings.columns:value\"\n            value.bind=\"option\">\n          ${option}\n        </option>\n      </select>\n      <input type=\"submit\" value=\"Remove\" \n          click.delegate=\"removeValueFromColumn(value, column)\" />\n    </div>\n    <input type=\"submit\"value=\"Add\"\n        if.bind=\"column.basedOn === 'label' || availableStoryStates\"\n        click.delegate=\"addValueForColumn(column)\" />\n  </fieldset>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map