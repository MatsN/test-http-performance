var client = function(name, headers) {
    var self = this;
    this.name = name;
    this.headers = headers;
}

module.exports = function (name, headers) {
    return new client(name, headers);
}