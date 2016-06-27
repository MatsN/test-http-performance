var request_dto = function(method, domain, path, queryParameters, body, headers, json, timeout) {
    var self = this;
    if(method === undefined) {
        self.method = 'GET'; //Default to GET for requests
    }
    else{
        self.method = method;
    }
    if(domain === undefined){
        self.domain ='http://localhost'
    }
    else{
        self.domain = domain;
    }

    if(path === undefined) {
        self.path = '/'; //default to empty path
    }
    else {
        self.path = path;
    }
    if(queryParameters === undefined) {
        self.queryParameters = {};
    }
    else {
        self.queryParameters = queryParameters;
    }
    if(body === undefined) {
        self.body = {};//default to empty object if format is json
    }
    else {
        self.body = body;
    }
    if(headers === undefined) {
        self.headers = {}; //defaults to empty
    }
    else {
        self.headers = headers;
    }
    if(json === undefined) {
        self.json = false; //defaults to false (body content-type will not be json)
    }
    else {
        self.json = json;
    }
    if(timeout === undefined) { 
        self.timeout = 10;
    }
    else {
        self.timeout = timeout;
    }
    
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


module.exports = function (method, domain, path, queryParameters, body, headers, json, timeout) {
    return new request_dto(method, domain, path, queryParameters, body, headers, json, timeout);
}