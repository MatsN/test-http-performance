var scenario = require('./scenario.js');
var util = require('util');
var common = require('./common.js');
var c_pool = require('./client_pool.js');

var performance_test = function(scenarios, client_pool, describe) {
    var self = this;
    if(describe === undefined) {
        self.describe = 'performance_test';
    }
    else {
        self.describe = describe;
    }
    if(client_pool === undefined) {
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
            var scenario_start_time = new Date();
            self.scenarios[scenario_index].run(self.client_pool.getNextClient(), function(scenario_results) {
                var scenario_result = {
                    success : true,
                    results : []
                }
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
                        mean_time_ok: (mean_time <= reqirements.max_mean_time_msec),
                        median_time: median_time,
                        median_time_ok: (median_time <= reqirements.max_median_time_msec),
                        max_time: (max_time),
                        max_time_ok: (max_time <= reqirements.max_time_msec)
                    };
                    for(var key in test_results) {
      
                        if(test_results[key] === false) {
                            scenario_result.success = false; //if a resquest fails to meet the reuiremet, fail the scenario too!
                            performance_test_results.success = false; //if a resquest fails to meet the reuiremet, fail the test too!
                        }
                    }
                    scenario_result.results.push(test_results);
                }
                performance_test_results.scenarios.push(scenario_result);
                if(performance_test_results.scenarios.length === self.scenarios.length) {
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
     if(sorted_times.length === 1) return sorted_times[0];//special case
     return (sorted_times.length  % 2 == 1) ? 
            sorted_times[Math.floor(request_times.length / 2)] :  //odd lenth takes the middle value
            (sorted_times[(request_times.length / 2) - 1] + sorted_times[(request_times.length  / 2)])/2;// even sums the middle pair
}

function get_max_time_msec(request_times) {
    return Math.max.apply(null, request_times);
}

module.exports = function(scenarios, client_pool, describe) {
    return new performance_test(scenarios, client_pool, describe);
}
module.exports.get_median_time_msec = get_median_time_msec;