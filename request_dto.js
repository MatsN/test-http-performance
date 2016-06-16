var request_dto = function(method, domain, path, body, headers, json) {
    var self = this;
    this.method = method;
    this.domain = domain;
    this.path = path;
    this.queryParameters = {};
    this.body = body;
    this.headers = headers;
    this.json = json;
    
    this.get_request = function() {
        var req = {
            method: self.method,
            uri: self.domain + self.path,
            qs: self.queryParameters,
            headers: self.headers,
            body: self.body
        };
        req.json = true;
        return req;
    }
}


module.exports = function (method, domain, path, body, headers, json) {
    return new request_dto(method, domain, path, body, headers, json);
}