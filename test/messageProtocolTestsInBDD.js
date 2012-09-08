var should = require('should');
var http = require('http');
var url = require('url');

sendGet = function(options, cb) {
  options.port = 8000;
  options.hostname = 'localhost';
  options.protocol = 'http:';
  http.get(url.format(options), cb);
};

describe('Access exiting object tests', function() {
  var httpServer = null;
  var keyValue = 'participant2';
  
  before(function (){
    httpServer = new require('../modules/httpServer').Server();
    httpServer.run();
  });
  
  after(function() {
    httpServer.end();
  });
  
  beforeEach(function(done) {
    sendGet({ pathname: '/save', query: { key: keyValue,  name: 'duy lam', location: 'barcamp saigon 2012' } }, function(res) {
      res.statusCode.should.equal(200);
      done();
    });
  });
  
  afterEach(function(done) {
    sendGet({ pathname: '/remove', query: { key: keyValue } }, function(res) {
      res.statusCode.should.equal(200);
      done();
    });
  });
    
  it('Get', function(done) {
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
    
  it('Override object', function(done) {
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
