var express  = require('express');
var path = require('path');
var connect = require('connect');
var serveStatic = require('serve-static');
var fs = require('fs');
var port = 8080;
var base = "/www"

var app = express();

console.log('Serving directory ' + __dirname +base);
console.log('Running server on port ' + port);
connect()
	.use(require('connect-inject')({
		ignore: ['.js', '.css', '.svg', '.ico', '.woff', '.png', '.jpg', '.jpeg', '.scss'],
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
	}))
	.use(serveStatic(__dirname+base))
	.listen(port);
