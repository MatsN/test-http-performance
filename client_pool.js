var client_pool = function(name, clients, random) {
    var self = this;
    self.name = name;
    self.clients = clients;
    self.counter = 0;
    self.getNextClient = function() {
        if(!self.random) {
            //TODO
        }
        else {
            if(self.counter < self.clients.length) {
                counter++;
            }
            else {
                counter = 0;
            }
            return clients[counter];
        }
    }
}

module.exports = function (name, clients) {
    return new client_pool(name, clients);
}