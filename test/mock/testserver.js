/*
* testserver
*/
var express = require('express');

var server = express();
var server_handle = undefined;

// just say 200 ok on any request
server.get('/', function(req,res,next) {
    res.status(200).send();
});

exports.start = function(port) {
    server_handle = server.listen(port);
}

exports.stop = function() {
    if(server_handle !== undefined) {
        server_handle.close();
    }
}