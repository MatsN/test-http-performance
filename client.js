var client = function(name, headers, times_to_run, msec_between_requests) {
    var self = this;
    self.name = name;
    self.headers = headers;
    self.times_to_run = times_to_run;
    self.msec_between_requests = msec_between_requests;

}

module.exports = function (name, headers, times_to_run, msec_between_requests) {
    return new client(name, headers, times_to_run, msec_between_requests);
}