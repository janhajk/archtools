var util = require('util');
var spawn = require('child_process').spawn;
var http = require('http');
var fs = require('fs');
var config   = require(__dirname + '/config.js');


http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    ls = spawn(config.path_wallet, ['getinfo']);
    ls.stdout.on('data', function(wallet_data) {
        fs.readFile('client.js', 'utf8', function(err, js) {
            if(err) {
                return console.log(err);
            }
            response.write('<html><head><script type="text/javascript">var wallet = ' + wallet_data + ';');
            response.write(js);
            response.write('</script></head><body></body></html>');
            response.end();
        });
    });
    ls.stderr.on('data', function(data) {
        response.write('stderr: ' + data);
        response.end();
    });
}).listen(config.port);