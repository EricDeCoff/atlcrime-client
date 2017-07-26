var connect = require('connect');
var http = require('http');
var serveStatic = require('serve-static');
var fs = require('fs');
var port = 8080;
var base = "/www"

console.log('Serving directory ' + __dirname +base);
console.log('Running server on port ' + port);
var app = connect()
	.use(require('connect-inject')({
		ignore: ['.js', '.css', '.svg', '.ico', '.woff', '.png', '.jpg', '.jpeg','scss'],
		runAll: true,
		rules: [
			{
				match: /<!doctype html>/ig,
				snippet: '',
				fn: function(w, s) {
					return '';
				}
			},
			{
				match: /<head>/ig,
				snippet: '',
				fn: function(w, s) {
					return w + s;
				}
			}
		]
	}));
//	.use(serveStatic('http://ericdecoff,com/resume'))
	http.get('http://ericdecoff.com').listen(port);
