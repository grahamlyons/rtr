var Route = require('./route').Route;

var Router = function() {
    this.routes = [];
}

Router.prototype.add = function(path, handler) {
    this.routes.push(new Route(path, handler));
    return this;
}

Router.prototype.match = function(path) {
    var match = function(route) {
        return route.match(path);
    };
    return this.routes.filter(match).map(match);
}

exports.Router = Router;
