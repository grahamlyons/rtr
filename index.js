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
    method, i,
    routes = {};

    for (i in methods) {
        method = methods[i];
        routes[method] = new Router();
        this[method.toLowerCase()] = makeAddRoute(method);
    }

    this.addRoute = function(method, path, handler) {
        routes[method].add(path, handler);
        return this;
    }

    this.dispatch = function(request, response) {
        var method = request.method.toUpperCase(),
            path = urlparse(request.url).pathname,
            handlers = routes[method].match(path),
            handled = false;
        handlers.forEach(function(handler) {
            handled = true;
            handler.call(null, request, response);
        });
        if (!handled && unhandledRequestCallback) {
            unhandledRequestCallback.call(null, request, response);
        }
        return handled;
    }

}

module.exports = HttpRouter;
