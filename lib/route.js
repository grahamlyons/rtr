/**
 * Takes a simple path and creates a regex for the route.
 * Converts ':param' to a group captured for the callback.
 * @param (String|RegExp) path
 * @return RegExp
 */
function createRegexPath(path) {
    if (!(path instanceof RegExp)) {
        var parts = path.split(/:[^/]*/),
            path = '^';
        path += parts.join('([^/]*)') + '$';
        path = new RegExp(path)
    }
    return path;
}

var Route = function(path, handler) {
    this.path = createRegexPath(path);
    this.handler = handler;
}

Route.prototype.match = function(path) {
    var args,
        curriedHandler,
        handlerArgs
        self = this;
    if (args = path.match(this.path)) {
        var curriedHandler = function(request, response) {
            var handlerArgs = args.slice(1);
            handlerArgs.unshift(request, response);
            return self.handler.apply(null, handlerArgs);
        };
        return curriedHandler;
    }
}

module.exports.Route = Route;
