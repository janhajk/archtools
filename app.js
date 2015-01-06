var util  = require('util');
var spawn = require('child_process').spawn;
var http = require('http');

var PORT = 1337;
var PATHARCHOIND = '/home/pi/ARCH/src/archcoind';


http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'application/json'});
  ls = spawn(PATHARCHOIND, ['getinfo']);
  ls.stdout.on('data', function (data) {
    response.write(data);
    response.end();
  });
  ls.stderr.on('data', function (data) {
    response.write('stderr: ' + data);
    response.end();
  });
}).listen(PORT);