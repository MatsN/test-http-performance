# test-http-performance
Node.js mocha friendly http performance scenario test API

## Code Example

### request data
requests are stored as simple objects that can return json that will work with the [request](https://www.npmjs.com/package/request)
 module
```javascript
var request = request_dto('GET','www.example.com','/index.html');
request.get_request();
```
get_request will return

```json
{
    method: 'GET',
    uri: 'www.example.com/index.html',
    qs: {},
    headers: [],
    body: ''
}
```
### scenarios
To combine requests in certain orders we add them to a scenario.
```javascript
var requests = [request_dto('GET','www.example.com','/login.html'),
                request_dto('GET','www.example.com','/index.html'),
                request_dto('GET','www.example.com','/logout.html')];
var example_scenario = scenario(requests);
```
to run a single scenario you can just call the run function on it
```javascript
example_scenario.run( function(scenario_results) {
    //e. g. using assert to test it
    assert.equal(true,scenario_results.success);
});
```
### performance_test example with default settings
Here is a minimal setup to run a performance test with everything set to default(not recomended)
```javascript
var scenario_test = scenario([request_dto('GET','http://localhost:'+some_free_port)]);
var performance_test = performance_test([scenario_test]);
performance_test.run(
    { 
        max_mean_time_msec : 100,
        max_median_time_msec : 100,
        max_time_msec : 150 
    },
    function(test_result) {
        assert.equal(true,test_result.success);
        done();
    }
);

```
## Motivation

test-http-performance was created because there were no modules for node that could be easily configured to do more advanced combinations of requests.
The idea is to provide a tool that can setup multiple simulated clients to run secarios consisting of a combination of request that will simulate intended use during a performance test.
The test will result in some test data being gathered, the data can then be tested against a set of requirements. 


## Installation

For now clone it: 
https://github.com/MatsN/test-http-performance/archive/master.zip
or download zip:
https://github.com/MatsN/test-http-performance.git

Available npm soon!

## API Reference

TODO

## Tests

```javascript

npm test

```

## Contributors

[![Mats Nilsson](https://avatars1.githubusercontent.com/u/6709044?v=3&s=460)](https://github.com/MatsN)

## License

MIT