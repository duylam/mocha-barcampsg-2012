var should = require('should');
var http = require('http');
var url = require('url');

sendGet = function(options, cb) {
  options.port = 8000;
  options.hostname = 'localhost';
  options.protocol = 'http:';
  http.get(url.format(options), cb);
};

suite('Test messages', function() {
  var httpServer = null;
  setup(function (){
    httpServer = new require('../modules/httpServer').Server();
    httpServer.run();
  });
  
  teardown(function() {
    httpServer.end();
  });
  
  suite('Invalid request', function() {
    test('Demo synchronous code', function() {
      var expected = 100;
      var actual = 100;
      actual.should.equal(expected);
    });
    
    test('Request to /doesnt-exist-endpoint', function(done) {
      sendGet({ pathname: '/doesnt-exist-endpoint' }, function(res) {
        res.statusCode.should.equal(400);
        done();
      });
    });
  
    test('/save with no parameters', function(done) {
      sendGet({ pathname: '/save' }, function(res) {
        res.statusCode.should.equal(400);
        done();
      });
    });
    
    test('/remove with no parameters', function(done) {
      sendGet({ pathname: '/remove' }, function(res) {
        res.statusCode.should.equal(400);
        done();
      });
    });
    
    test('/get with no parameters', function(done) {
      sendGet({ pathname: '/get' }, function(res) {
        res.statusCode.should.equal(400);
        done();
      });
    });
    
    test('/save with no key parameter', function(done) {
      sendGet({ pathname: '/save', query: { field1: 'value1' } }, function(res) {
        res.statusCode.should.equal(400);
        done();
      });
    });
    
    test('/remove with no key parameter', function(done) {
      sendGet({ pathname: '/remove', query: { field1: 'value1' } }, function(res) {
        res.statusCode.should.equal(400);
        done();
      });
    });
    
    test('/get with no key parameter', function(done) {
      sendGet({ pathname: '/get', query: { field1: 'value1' } }, function(res) {
        res.statusCode.should.equal(400);
        done();
      });
    });
  });
  
  suite('Request on object', function() {
    var keyValue = 'participant1';
    test('Save', function(done) {
      sendGet({ pathname: '/save', query: { key: keyValue,  name: 'duy lam', location: 'barcamp saigon 2012' } }, function(res) {
        res.statusCode.should.equal(200);
        done();
      });
    });
    
    test('Get', function(done) {
      sendGet({ pathname: '/get', query: { key: keyValue } }, function(res) {
        res.statusCode.should.equal(200);
        res.on('data', function(data) {
          var responseDataObject = JSON.parse(data.toString('utf8'));
          responseDataObject.hasOwnProperty('name').should.be.true;
          responseDataObject.hasOwnProperty('location').should.be.true;
          responseDataObject.name.should.equal('duy lam');
          responseDataObject.location.should.equal('barcamp saigon 2012');
          done();
        });
      });
    });
    
    test('Remove', function(done) {
      sendGet({ pathname: '/remove', query: { key: keyValue } }, function(res) {
        res.statusCode.should.equal(200);
        done();
      });
    });
    
    test('Get unexisted object', function(done) {
      sendGet({ pathname: '/get', query: { key: 'no-existing-key' } }, function(res) {
        res.statusCode.should.equal(400);
        done();
      });
    });
    
    test('Remove unexisted object', function(done) {
      sendGet({ pathname: '/remove', query: { key: 'no-existing-key' } }, function(res) {
        res.statusCode.should.equal(400);
        done();
      });
    });
    
    test('Override object', function(done) {
      sendGet({ pathname: '/save', query: { key: keyValue,  name: 'duy lam', location: 'barcamp saigon 2012' } }, function(res) {
        res.statusCode.should.equal(200);
        sendGet({ pathname: '/save', query: { key: keyValue,  name: 'somebody', location: '2013' } }, function(res2) {
          res2.statusCode.should.equal(200);
          sendGet({ pathname: '/get', query: { key: keyValue } }, function(res3) {
            res3.on('data', function(data) {
              var responseObject = JSON.parse(data.toString('utf8'));
              responseObject.hasOwnProperty('name').should.be.true;
              responseObject.hasOwnProperty('location').should.be.true;
              responseObject.name.should.equal('somebody');
              responseObject.location.should.equal('2013');
              done();
            });
          });
        });
      });
    });
    
    test('Request to /remove-all');
  });
  
});
