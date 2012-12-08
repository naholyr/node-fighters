
var http = require('http');
var fs = require('fs');
var path = require('path');

var mime = require('mime');

var config = require('./board.json');

http.createServer(function (req, res) {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'paper.html'), function (err, content) {
      if (err) return res.end(String(err));
      res.writeHead(200, {'content-type': 'text/html'});
      res.end(content.toString().replace(/\{CONFIG:"INSERT_HERE"\}/, JSON.stringify(config)));
    });
  } else {
    var file = path.join(__dirname, req.url);
    fs.exists(file, function (exists) {
      if (exists) {
        res.writeHead(200, {'content-type': mime.lookup(file)});
        fs.createReadStream(file).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });
  }
}).listen(3000);
