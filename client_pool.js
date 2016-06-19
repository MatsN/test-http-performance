var util = require('util');
var client_pool = function(name, clients, random) {
    var self = this;
    self.name = name;
    self.clients = clients;
    self.counter = 0;
    self.random = random;
    self.getNextClient = function() {
        var returning_client = undefined;
        if(self.random) {
            //TODO
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