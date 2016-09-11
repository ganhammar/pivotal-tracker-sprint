define('app',["exports", "aurelia-framework", "aurelia-binding", "./services/authentication", "./services/tracker"], function (exports, _aureliaFramework, _aureliaBinding, _authentication, _tracker) {
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

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaBinding.BindingEngine, _authentication.Authentication, _tracker.Tracker), _dec(_class = function () {
    function App(bindingEngine, authentication, tracker) {
      _classCallCheck(this, App);

      this.bindingEngine = bindingEngine;
      this.authentication = authentication;
      this.tracker = tracker;
      this.project = {};
      this.user = {};
    }

    App.prototype.activate = function activate() {
      var _this = this;

      this.user = this.authentication.getUser();
      this.bindingEngine.propertyObserver(this.tracker, "projectId").subscribe(function (newValue, oldValue) {
        _this.tracker.getProject(newValue).then(function (project) {
          return _this.project = project;
        });
      });
    };

    App.prototype.configureRouter = function configureRouter(config, router) {
      var auth = true;

      config.title = "Pivotal Tracker Sprint Backlog";
      config.addPipelineStep("authorize", this.authentication);
      config.map([{ route: ["", "login"], moduleId: "pages/login/login", title: "Login", unAuthedOnly: true }, { route: "select-project", name: "select-project", moduleId: "pages/projects/select", title: "Select Project", auth: auth }, { route: "project/:id/sprint-backlog", name: "sprint-backlog", moduleId: "pages/backlog/sprint", title: "Sprint Backlog", auth: auth }, { route: "settings", name: "settings", moduleId: "settings", title: "Settings", auth: auth }]);
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

    this.storyStates = ["unscheduled", "unstarted", "started", "finished", "delivered", "accepted", "rejected"];

    this.columnBaseTypes = ["state", "label"];

    this.columns = [{ title: "Todo", basedOn: "state", value: ["planned", "unstarted"] }, { title: "Doing", basedOn: "state", value: ["started"] }, { title: "Testing", basedOn: "state", value: ["finished"] }, { title: "Done", basedOn: "state", value: ["delivered", "accepted"] }, { title: "Impedements", basedOn: "label", value: ["_blocked"] }];
  }) || _class);
});
define('services/tracker',["exports", "aurelia-framework", "aurelia-fetch-client", "./local"], function (exports, _aureliaFramework, _aureliaFetchClient, _local) {
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

  var Tracker = exports.Tracker = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _local.Local), _dec(_class = function () {
    function Tracker(client, local) {
      _classCallCheck(this, Tracker);

      this.client = client;
      this.local = local;
      this.ls = {
        token: "pivotal-tracker-token",
        user: "pivotal-tracker-current-user"
      };
      this.projectId = null;
      this._projects = [];
      this._currentUser = this.local.g(this.ls.user) || null;
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

    Tracker.prototype._fetch = function _fetch(url) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.client.fetch(url).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.kind !== "error") {
            resolve(response);
          } else {
            _this2.currentUser = null;
            reject(new Error(response.code));
          }
        }).catch(function (error) {
          _this2.currentUser = null;
          reject(error);
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

    Tracker.prototype.getCurrent = function getCurrent() {
      return this._fetch("projects/" + this.projectId + "/iterations?scope=current_backlog&limit=1");
    };

    Tracker.prototype.getUsers = function getUsers() {
      return this._fetch("projects/" + this.projectId + "/memberships");
    };

    Tracker.prototype.isValid = function isValid() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        if (_this5.currentUser) {
          return resolve(_this5.currentUser);
        }

        _this5.client.fetch("me").then(function (response) {
          return response.json();
        }).then(function (result) {
          if (result.kind !== "error") {
            _this5.currentUser = result;
            resolve(_this5.currentUser);
          } else {
            _this5.currentUser = null;
            reject(new Error(response.code));
          }
        }).catch(function (error) {
          _this5.currentUser = null;
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
        this._token = value;

        this.local.s(this.ls.token, value);

        this._configureClient();
      }
    }]);

    return Tracker;
  }()) || _class);
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
      this.startPoll();
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

    Sprint.prototype.startPoll = function startPoll() {
      var _this2 = this;

      this.tracker.getCurrent().then(function (iteration) {
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
define('resources/value-converters/backlogcolumns',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var BacklogcolumnsValueConverters = exports.BacklogcolumnsValueConverters = function () {
    function BacklogcolumnsValueConverters() {
      _classCallCheck(this, BacklogcolumnsValueConverters);
    }

    BacklogcolumnsValueConverters.prototype.toView = function toView(array, config) {
      console.log(array, config);
      return array.filter(function (item) {
        return true;
      });
    };

    return BacklogcolumnsValueConverters;
  }();
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <header>\n    <div class=\"project-info\">\n      ${project.name}\n    </div>\n    <a class=\"switch-project\" route-href=\"route: select-project\">&#10006;</a>\n    <div class=\"user-info\">\n      <span class=\"logged-in-as\">\n        ${user.name}\n      </span>\n      <a>Logout</a>\n    </div>\n    <nav>\n      <ul>\n        <li class=\"settings\">\n          <a route-href=\"route: settings\">Cog</a>\n        </li>\n        <li class=\"switch-mode\"></li>\n      </ul>\n    </nav>\n  </header>\n  <router-view></router-view>\n</template>\n"; });
define('text!pages/backlog/sprint.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./filter-columns\"></require>\n  <div class=\"sprint-backlog-headers\">\n    <span repeat.for=\"column of columns\" class=\"column\">${column.title}</span>\n  </div>\n  <div class=\"sprint-backlog\">\n    <ul repeat.for=\"column of columns\" class=\"column\">\n      <li repeat.for=\"story of iteration.stories | filterColumns:column\">\n        <div class=\"header\">\n          <div class=\"owners\">\n            <span repeat.for=\"ownerId of story.owner_ids\" class=\"owner\">\n              ${getUser(ownerId).person.initials}\n            </span>\n          </div>\n          <span class=\"estimate\">${story.estimate}</span>\n        </div>\n        <span class=\"title\">\n          ${story.name}\n        </span>\n      </li>\n    </ul>\n  </div>\n</template>\n"; });
define('text!pages/login/login.html', ['module'], function(module) { module.exports = "<template>\n  <form submit.trigger=\"setToken()\">\n    <input type=\"text\" value.bind=\"token\" placeholder.bind=\"placeholder\" />\n    <button type=\"submit\">Ok</button>\n  </form>\n</template>\n"; });
define('text!pages/projects/select.html', ['module'], function(module) { module.exports = "<template>\n  <ul>\n    <li repeat.for=\"project of projects\" class=\"project\">\n      <a route-href=\"route: sprint-backlog; params.bind: { id:project.id }\" class=\"title\">\n        ${project.name}\n      </a>\n    </li>\n  </ul>\n</template>\n"; });
define('text!resources/value-converters/backlogcolumns.html', ['module'], function(module) { module.exports = "<template>\n</template>\n"; });
define('text!assets/styles/app.css', ['module'], function(module) { module.exports = "html, body {\n    margin: 0;\n    padding: 0;\n}\nbody {\n    background-color: #e9e9e9;\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n    font-size: 14px;\n}\np {\n    margin: 0;\n    padding: 0;\n}\n#spinner {\n    display: none;\n    width: 80px;\n    height: 80px;\n    background-color: #333;\n    border-radius: 100%;  \n    -webkit-animation: scale-it 1s infinite ease-in-out;\n    animation: scale-it 1.0s infinite ease-in-out;\n    position: absolute;\n    top: 50%;\n    margin-top: -40px;\n    left: 50%;\n    margin-left: -40px;\n    z-index: 2;\n}\n#error {\n    display: none;\n    -webkit-animation: fade-out 0.2s forwards ease-in-out;\n    animation: fade-out 0.2s forwards ease-in-out;\n    position: absolute;\n    top: 100px;\n    background-color: #E3757E;\n    padding-top: 35px;\n    box-shadow: 0 0 3px #ccc;\n    width: 400px;\n    left: 50%;\n    margin-left: -200px;\n}\n#error.visible {\n    -webkit-animation: fade-in 0.2s forwards ease-in-out;\n    animation: fade-in 0.2s forwards ease-in-out;\n}\n#error:before {\n    content: \"X\";\n    color: #fff;\n    position: absolute;\n    top: 5px;\n    width: 20px;\n    text-align: center;\n    line-height: 20px;\n    font-size: 13px;\n    font-weight: 700;\n    margin: 0 auto;\n    margin-left: 5px;\n    border: 2px solid #fff;\n    border-radius: 100%;\n    height: 20px;\n}\n#error #error-message {\n    width: 100%;\n    background-color: #fff;\n    text-align: center;\n    line-height: 25px;\n    padding: 10px 0;\n}\nheader {\n    width: 100%;\n    height: 50px;\n    background-color: #222;\n}\nheader ul {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\nheader .project-info {\n    font-size: 20px;\n    float: left;\n    line-height: 50px;\n    margin-left: 15px;\n    color: #fff;\n}\nheader .switch-project {\n    display: none;\n    line-height: 35px;\n    float: left;\n    color: #fff;\n    margin-left: 4px;\n    font-size: 11px;\n    cursor: pointer;\n}\nheader .switch-project:hover {\n    color: #e0e0e0;\n}\nheader nav {\n    float: right;\n    line-height: 50px;\n}\nheader nav ul li {\n  float: left;\n  margin-right: 30px;\n}\nheader nav .switch-mode {\n    color: #fff;\n    cursor: pointer;\n}\nheader nav .switch-mode:before, header nav .switch-mode:after {\n    content: \"A\";\n}\nheader nav .switch-mode:before {\n    font-size: 12px;\n}\nheader nav .switch-mode:after {\n    font-size: 20px;\n}\nheader nav .switch-mode.enlarged:before {\n    font-size: 20px;\n}\nheader nav .switch-mode.enlarged:after {\n    font-size: 12px;\n}\nheader nav .switch-mode:hover {\n    color: #e0e0e0;\n}\nheader .user-info {\n  float: right;\n  color: #fff;\n  line-height: 50px;\n}\nheader .user-info a {\n    float: right;\n    line-height: 50px;\n    margin-right: 15px;\n    margin-left: 15px;\n    cursor: pointer;\n    color: #fff;\n}\nheader .user-info a:hover {\n    color: #e0e0e0;\n}\n.view[data-name=\"enter-token\"] {\n    width: 410px;\n    height: 50px;\n    left: 50%;\n    margin-left: -205px;\n    top: 50%;\n    margin-top: -25px;\n    position: fixed;\n    box-shadow: 0 0 3px #ccc;\n}\n.view[data-name=\"enter-token\"] #token {\n    border: none;\n    line-height: 50px;\n    padding: 0 10px;\n    font-size: 20px;\n    background-color: #fff;\n    width: 340px;\n    float: left;\n}\n.view[data-name=\"enter-token\"] input[type=submit] {\n    padding: 0;\n    margin: 0;\n    border: none;\n    background-color: #333;\n    color: #fff;\n    width: 50px;\n    text-align: center;\n    line-height: 50px;\n    float: left;\n    cursor: pointer;\n}\n.view[data-name=\"enter-token\"] input[type=submit]:hover {\n    background-color: #444;\n}\n.view[data-name=\"projects\"] {\n    width: 600px;\n    margin: 80px auto;\n}\n.view[data-name=\"projects\"] #project-template {\n    display: none;\n}\n.view[data-name=\"projects\"] .project {\n    font-size: 22px;\n    line-height: 60px;\n    background-color: #fff;\n    box-shadow: 0 0 3px #ccc;\n    padding: 0 20px;\n    margin-bottom: 10px;\n    cursor: pointer;\n    color: #444;\n    box-shadow: 0 0 2px #999;\n}\n.view[data-name=\"projects\"] .project:hover {\n    background-color: #f9f9f9;\n}\n.sprint-backlog-headers {\n    width: 100%;\n    background-color: #333;\n    height: 40px;\n    box-shadow: 0 0 2px #111;\n}\n.sprint-backlog-headers span {\n    float: left;\n    display: block;\n    width: 20%;\n    margin: 0;\n    padding: 0;\n    font-size: 1.3em;\n    text-align: center;\n    color: #fff;\n    text-transform: uppercase;\n    line-height: 40px;\n}\n.sprint-backlog .column {\n    display: block;\n    float: left;\n    width: 20%;\n    margin: 0;\n    padding: 0;\n    list-style: none;\n}\n.sprint-backlog .column li {\n    margin: 15px 15px 15px 0;\n    padding: 0;\n    height: 100px;\n    box-shadow: 0 0 3px #ccc;\n    background-color: #fff;\n}\n.sprint-backlog .column#todo li {\n    margin-left: 15px;\n}\n.sprint-backlog .column li .header {\n    padding: 0 10px;\n    color: #fff;\n    display: block;\n    line-height: 25px;\n    height: 25px;\n    font-size: 13px;\n}\n.sprint-backlog .column li .header .owners {\n    float: left;\n}\n.sprint-backlog .column li .header .owners .owner:after {\n    content: \", \";\n}\n.sprint-backlog .column li .header .owners .owner:last-child:after {\n    content: \"\";\n}\n.sprint-backlog .column li .header .estimate {\n    float: right;\n}\n.sprint-backlog .column li.feature .header {\n    background-color: #F2C12E;\n}\n.sprint-backlog .column li.bug .header {\n    background-color: #E74C3C;\n}\n.sprint-backlog .column li.release .header {\n    background-color: #3498DB;\n}\n.sprint-backlog .column li.chore .header {\n    background-color: #2C3E50;\n}\n.sprint-backlog .column li .title {\n    margin: 8px;\n    display: -webkit-box;\n    -webkit-line-clamp: 3;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n    line-height: 20px;\n}\n.enlarged .sprint-backlog .column li {\n    height: 110px;\n    box-shadow: 0 0 3px #888;\n}\n.enlarged .sprint-backlog .column li .header {\n    width: 30px;\n    float: left;\n    height: 110px;\n    padding: 0;\n    position: relative;\n}\n.enlarged .sprint-backlog .column li .header .estimate {\n    display: block;\n    float: none;\n    width: 100%;\n    text-align: center;\n}\n.enlarged .sprint-backlog .column li .header .owners {\n    display: block;\n    width: 100%;\n    float: none;\n    position: absolute;\n    bottom: 3px;\n    left: 0;\n    text-align: center;\n    line-height: 18px;\n}\n.enlarged .sprint-backlog .column li .header .owners .owner {\n    display: block;\n}\n.enlarged .sprint-backlog .column li .header .owners .owner:after {\n    content: \"\";\n}\n.enlarged .sprint-backlog .column li .title {\n    font-size: 19px;\n    -webkit-line-clamp: 4;\n    margin-left: 0;\n    line-height: 25px;\n    padding: 2px 0 0 7px;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map