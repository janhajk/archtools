var util = require('util');
var spawn = require('child_process').spawn;
var http = require('http');
var fs = require('fs');
var config   = require(__dirname + '/config.js');
var url = require('url');


http.createServer(function(request, response) {
    var purl = url.parse(req.url, true);
    switch(purl.pathname) {
        case '/wallet':
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            ls = spawn(config.path_wallet, ['getinfo']);
            ls.stdout.on('data', function(wallet_data) {
                fs.readFile('client.js', 'utf8', function(err, js) {
                    response.write('<html><head></head><body></body>');
                    response.write('<script type="text/javascript">var wallet_data = ' + wallet_data + ';' + js + '</script></html>');
                    response.end();
                });
            });
            ls.stderr.on('data', function(data) {
                response.write('stderr: ' + data);
                response.end();
            });
            break;
        case '/wallet/status':
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            ls = spawn(config.path_wallet, ['getinfo']);
            ls.stdout.on('data', function(data) {
                response.end(data);
            });
            ls.stderr.on('data', function(data) {
                response.write('stderr: ' + data);
                response.end();
            });
            break;
    }
}).listen(config.port);