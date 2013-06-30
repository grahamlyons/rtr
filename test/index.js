var assert = require('assert');
var http = require('http');

var Route = require('../lib/route').Route;
var Router = require('../lib/router').Router;
var HttpRouter = require('../index');

function test(message, testFunction) {
    if (!testFunction) {
        testFunction = message;
        message = '';
    }
    try{
        testFunction.call();
        console.log('PASSED', message);
    } catch(e) {
        console.error('FAILED', message);
        console.error(e.message);
        console.error(e.stack);
    }
}

/**
 * Route
 */
test(function() {
    var f = function() {};
    var r = new Route("/", f);
    assert.ok(r.match("/") instanceof Function);
});

test(function() {
    var f = function() {};
    var r = new Route("/", f);
    assert.ok(!r.match("/hello"));
});

test(function() {
    var f = function() {};
    var path = new RegExp('^/hello/world$');
    var r = new Route(path, f);
    assert.ok(!r.match("/"));
});

test(function() {
    var f = function(req, res, name) {
        assert.equal('world', name);
    };
    var r = new Route("/hello/:name", f);
    var path = '/hello/world';
    assert.ok(r.match(path));
    r.match(path).call();
});

/**
 * Router
 */
test(function() {
    var r = new Router();
    assert.ok(r.routes);
});

test(function() {
    var r = new Router();
    assert.ok(r.routes instanceof Array);
});

test(function() {
    var r = new Router();
    var f = function() {};
    r.add('/', f);
    assert.equal(1, r.routes.length);
    assert.ok(r.routes[0] instanceof Route);
});

test(function() {
    var r = new Router();
    var f = function() {};
    var path = '/';
    r.add(path, f);
    var result = r.match(path);
    assert.ok(result instanceof Array);
    assert.equal(1, result.length);
});

test(function() {
    var r = new Router();
    var f1 = function(req, res, name) {
        assert.equal('world', name);
    };
    var f2 = function() {
        assert.fail('Calling the wrong function');
    };
    var path = '/hello/:name';
    r.add(path, f1);
    r.add('/', f2);
    var result = r.match('/hello/world');
    assert.equal(1, result.length);
    result.forEach(function(handler) {
        assert.ok(handler instanceof Function);
        handler.call();
    });
});

/**
 * HttpRouter
*/

test(function() {
    var h = new HttpRouter();
    var request = new http.IncomingMessage();
    request.method = 'GET';
    request.url = '/hello';
    var success = false;
    h.get('/hello', function(req, res) {
        success = true;
    });
    h.dispatch(request, null);
    assert.ok(success);
});

test(function() {
    var h = new HttpRouter();
    var request = new http.IncomingMessage();
    request.method = 'POST';
    request.url = '/hello/world';
    var success = false;
    h.post('/hello/:name', function(req, res, name) {
        assert.equal('world', name);
        success = true;
    });
    h.dispatch(request, null);
    assert.ok(success);
});

test(function() {
    var h = new HttpRouter();
    var request = new http.IncomingMessage();
    request.method = 'POST';
    request.url = '/hello/world?_=12342';
    var success = false;
    h.post('/hello/:name', function(req, res, name) {
        assert.equal('world', name);
        success = true;
    });
    h.dispatch(request, null);
    assert.ok(success);
});

test('Not found handler', function() {
    var success = true;
    var request = new http.IncomingMessage();
    var h = new HttpRouter(function(req, res) {
        assert.equal(req, request);
        success = false;
    });
    request.method = 'GET';
    request.url = '/hello/world';
    h.dispatch(request, null);
    assert.ok(!success);
});

test('Does not blow up without not found handler', function() {
    var request = new http.IncomingMessage();
    var h = new HttpRouter();
    request.method = 'GET';
    request.url = '/hello/world';
    try{
        assert.ok(!h.dispatch(request, null));
    } catch(e) {
        assert.fail('It blew up');
    }
});
