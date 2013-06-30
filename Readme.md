# rtr - a very simple http router

A basic router which has support for named parameters in URLs and regexes.

Example usage:

    var Router = require('rtr'),
        http = require('http'),
        router, server;

    router = new Router();
    router.get('/', function(req, res) {
        res.writeHead(200);
        res.end('Hello World');
    });

    router.get('/hello/:name', function(req, res, name) {
        res.writeHead(200);
        res.end('Hello ' + name);
    });

    server = http.createServer(router.dispatch);

    server.listen(8080);
