var Router = require('./lib/router').Router,
    urlparse = require('url').parse;

var HttpRouter = function(unhandledRequestCallback) {
    var methods = [
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'DELETE'
    ],
    self = this,
    makeAddRoute = function(method) {
        return function(path, handler) {
            return self.addRoute(method, path, handler);
        };
    },
    method, i;

    this.routes = {};

    for (i in methods) {
        method = methods[i];
        this.routes[method] = new Router();
        this[method.toLowerCase()] = makeAddRoute(method);
    }

    this.unhandledRequestCallback = unhandledRequestCallback;
}

HttpRouter.prototype.addRoute = function(method, path, handler) {
    this.routes[method].add(path, handler);
    return this;
}

HttpRouter.prototype.dispatch = function(request, response) {
    var method = request.method.toUpperCase(),
        path = urlparse(request.url).pathname,
        handlers = this.routes[method].match(path),
        handled = false;
    handlers.forEach(function(handler) {
        handled = true;
        handler.call(null, request, response);
    });
    if (!handled) {
        this.unhandledRequestCallback.call(null, request, response);
    }
    return handled;
}

module.exports = HttpRouter;
