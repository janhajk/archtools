var util = require('util');
var spawn = require('child_process').spawn;
var http = require('http');
fs = require('fs');

var PORT = 1337;
var PATHARCHOIND = '/home/pi/ARCH/src/archcoind';

http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    ls = spawn(PATHARCHOIND, ['getinfo']);
    ls.stdout.on('data', function(wallet_data) {
        fs.readFile('client.js', 'utf8', function(err, js) {
            if(err) {
                return console.log(err);
            }
            response.write('<html><head><script type="text/javascript">var wallet = ' + wallet_data + ';');
            response.write(js);
            response.write('</script></head><body></body></html>');
        });
        response.end();
    });
    ls.stderr.on('data', function(data) {
        response.write('stderr: ' + data);
        response.end();
    });
}).listen(PORT);