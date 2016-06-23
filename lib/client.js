var client = function(name, headers, times_to_run, msec_between_requests) {
    var self = this;
    if(name === undefined) {
        self.name = 'default_client';
    }
    else {
        self.name = name;
    }
    if(headers === undefined) {    
        self.headers = [];
    }
    else {
        self.headers = headers;
    }
    if(times_to_run === undefined) {
        self.times_to_run = 1;
    }
    else {
        self.times_to_run = times_to_run;
    }
    if(msec_between_requests === undefined) {
        self.msec_between_requests = 10;
    }
    else {
        self.msec_between_requests = msec_between_requests;
    }
}

module.exports = function (name, headers, times_to_run, msec_between_requests) {
    return new client(name, headers, times_to_run, msec_between_requests);
}