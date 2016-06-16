var Q = require('q');

var performance_test = function(describe, client_pool, scenarios) {
    var self = this;
    self.describe = describe;
    self.client_pool = client_pool;
    self.scenarios = scenarios;
    /**
    * settings = { repeats }
    */
    self.run = function(reqirements) {
        var deferred = Q.defer();
        describe(self.describe, function() {
            //TODO run each scenario with the given clients & settings
            for(var scenario_index = 0; scenario_index < self.scenarios.length; scenario_index++) {
                describe(self.scenarios[index].description, function() {
                    self.scenarios[index].run(client_pool.getNextClient(), function(scenario_result) {
                        //handle callback, calculate statistics and check for success!
                        it('', function() {
                            //TODO 
                        });
                    });
                });
            }
            //TODO analyse the results and compare them to the requirements
        });
    };
}

module.exports = function(describe, clients, scenarios, reqirements) {
    return new performance_test(describe, clients, scenarios, reqirements);
}