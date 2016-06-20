var scenario = require('./scenario.js');
var util = require('util');
var common = require('./common.js');
var c_pool = require('./client_pool.js');

var performance_test = function(describe, client_pool, scenarios) {
    var self = this;
    if(describe === undefined) {
        self.describe = 'performance_test';
    }
    else {
        self.describe = describe;
    }
    if(client_pool === undefined){
        self.client_pool = c_pool();//Create a default pool
    }
    else{
        self.client_pool = client_pool;
    }
    self.scenarios = scenarios;
    
    self.run = function(reqirements, cb) {
                        
        var performance_test_results = {
            describe : self.describe,
            success : true,
            scenarios : []
        };
        //TODO run each scenario with the given clients & settings
        for(var scenario_index = 0; scenario_index < self.scenarios.length; scenario_index++) {
            var scenario_result = {
                describe : self.scenarios[scenario_index].description,
                success : true,
                results : []
            }
            var scenario_start_time = new Date();
            self.scenarios[scenario_index].run(client_pool.getNextClient(), function(scenario_results) {
                for(var i = 0; i < scenario_results.length; i++) {
                    //extract all the response times
                    var request_times = get_scenario_request_times(scenario_results[i]);                                                        
                    //count total for the requests (this will not be real percived time since requests have been running asyncronusly)
                    //var total_time = get_total_time_msec(request_times);
                    //calculate mean/average time
                    var mean_time = get_mean_time_msec(request_times);
                    //calculate median
                    var median_time = get_median_time_msec(request_times);
                    //find the max time
                    var max_time = get_max_time_msec(request_times);
                    var test_results = {
                        mean_time: mean_time,
                        mean_time_ok: (mean_time < reqirements.max_mean_time_msec),
                        median_time: median_time,
                        median_time_ok: (median_time < reqirements.max_median_time_msec),
                        max_time: (max_time),
                        max_time_ok: (max_time < reqirements.max_time_msec)
                    };
                    scenario_result.results.push(test_results);
                }
                performance_test_results.scenarios.push(scenario_result);
                if(performance_test_results.scenarios.length === self.scenarios.length){
                    cb(performance_test_results);
                }
            });
        }
    }
}

function get_scenario_request_times(scenario_reslut) {
    var request_times = [];
        //console.log(util.inspect(scenario_reslut, { showHidden: true, depth: null }));
    //extract all the request times
    for(var index = 0; index < scenario_reslut.responses.length; index++) {
        request_times.push(scenario_reslut.responses[index].request_time);
    }
    return request_times;
}

function get_total_time_msec(request_times) {
    return request_times.reduce(function(previous,current,index,array) {
        return previous + current;
    });
}

function get_mean_time_msec(request_times) {
    return get_total_time_msec(request_times) / request_times.length;
}
    
function get_median_time_msec(request_times) {
     var sorted_times = request_times.sort(function(a, b) {
            return a - b;
     });
     return (sorted_times.length  % 2 == 1) ? 
            sorted_times[request_times.length / 2] :  //odd lenth takes the middle value
            (sorted_times[(request_times.length / 2) - 1] + sorted_times[(request_times.length  / 2)]);// even sums the middle pair
}

function get_max_time_msec(request_times) {
    return Math.max.apply(null, request_times);
}

module.exports = function(describe, clients, scenarios) {
    return new performance_test(describe, clients, scenarios);
}