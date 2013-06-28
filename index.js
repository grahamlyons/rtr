var Router = require('./lib/router').Router,
    urlparse = require('url').parse;

var HttpRouter = function() {
    var methods = [
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'DELETE'
    ],
    makeAddRoute = function(method) {
        return function(path, handler) {
            return self.addRoute(method, path, handler);
        };
    },
    self = this,
    method, i;

    this.routes = {};

    for (i in methods) {
        method = methods[i];
        this.routes[method] = new Router();
        this[method.toLowerCase()] = makeAddRoute(method);
    }
}

HttpRouter.prototype.addRoute = function(method, path, handler) {
    this.routes[method].add(path, handler);
    return this;
}

HttpRouter.prototype.dispatch = function(request, response) {
    var method = request.method.toUpperCase(),
        path = urlparse(request.url).pathname,
        handlers = this.routes[method].match(path);
    handlers.forEach(function(handler) {
        handler.call(null, request, response);
    });
}

module.exports = HttpRouter;
