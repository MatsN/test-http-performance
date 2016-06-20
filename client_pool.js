var util = require('util');
var client = require('./client.js');
var client_pool = function(name, clients, random) {
    var self = this;
    if(name === undefined) {
        self.name = 'default_client_pool';
    }
    else {
        self.name = name;
    }
    if(clients == undefined) {
        self.clients = [client()];//1 client with default settings 
    }
    else {
        self.clients = clients;
    }
    if(random === undefined) {
         self.random = false;
    }
    else {
         self.random = random;
    }
    self.counter = 0;
   
    self.getNextClient = function() {
        var returning_client = undefined;
        if(self.random) {
            //TODO implement ramdom selection of client
        }
        else {
            if(self.counter < self.clients.length) {
                returning_client = self.clients[self.counter];
                self.counter++;
            }
            else {
                self.counter = 0;
                returning_client = self.clients[self.counter];
            }
            return returning_client;
        }
    }
}

module.exports = function (name, clients, random) {
    return new client_pool(name, clients, random);
}