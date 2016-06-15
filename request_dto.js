var request_dto = function(method, domain, path, body, headers, json) {
    this.domain = domain;
    this.method = method;
    this.path = path;
    this.body = body;
    this.headers = headers;
    this.json = json;
    
}

module.exports = function (method, domain, path, body, headers, json) {
    return new request_dto(method, domain, path, body, headers, json);
}