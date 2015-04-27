var util = require('util');
var spawn = require('child_process').spawn;
var http = require('http');
var fs = require('fs');
var url = require('url');

var config   = require(__dirname + '/config.js');

var calls = {
    'getinfo' : {
        protected: false,
        call: 'getinfo'
    },
};


var oJson = function(response, data, callback) {
    response.writeHead(200, {
        'Content-Type': 'text/html' //'application/json'
    });
    console.lg(data);
    response.write(data);
    response.end();
};

var directWallet2Json = function(call, response, callback) {
    var ls = spawn(config.path_wallet, [call]);

    ls.stdout.on('data', function(data) {
        oJson(response, data, function(){callback});
    });

    ls.stderr.on('data', function(data) {
        oJson(response, 'stderr: ' + data, function(){callback});
    });
};


http.createServer(function(request, response) {
    var purl = url.parse(request.url, true);
    switch(purl.pathname) {
        case '/wallet/status':
            directWallet2Json('getinfo', response, function(){});
            break;
        case '/wallet/balance':
            var ls = spawn(config.path_wallet, ['getinfo']);
            ls.stdout.on('data', function(data) {
                var balance = JSON.parse(data).balance;
                oJson(response, balance, function(){});
            });
            ls.stderr.on('data', function(data) {
                oJson(response, 'stderr: ' + data, function(){});
            });
            break;
        case '/wallet':
        default:
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
    }
}).listen(config.port);