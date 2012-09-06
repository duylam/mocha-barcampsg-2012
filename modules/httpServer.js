var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

exports.Server = function() {
  this.server = http.createServer(function (req, res) {
    var urlParts = url.parse(req.url, true);
    if(!urlParts.query.key) {
      res.statusCode = 400;
      res.end();
    }
    else {
      res.statusCode = 200;
      var queryData = urlParts.query;
      var filepath = path.join(__dirname, 'db/' + queryData.key);
      delete queryData.key;
      switch(urlParts.pathname) {
        case '/save':
          fs.writeFile(filepath, JSON.stringify(queryData), function(err) {
            if(err) res.statusCode = 400;
            res.end();  
          });
          
          break;
        case '/remove':
          if(fs.existsSync(filepath))
            fs.unlink(filepath);
          else
            res.statusCode = 400;
          res.end();
          break;
        case '/get':
          fs.readFile(filepath, function (err, data) {
            if (err) res.statusCode = 400;
            else res.write(data.toString());
            res.end();             
          });
          break;
        default:
          res.statusCode = 400;
          res.end();
      }
    }
  });
  
  this.run = function() {
    this.server.listen(8000);
  };
  
  this.end = function() {
    this.server.close();
  };
  
  return this;
};
