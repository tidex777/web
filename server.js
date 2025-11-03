var http = require('http');
var fs = require('fs');
var path = require('path');

var mimeTypes = {
        '.html': 'text/html',
        '.htm': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.txt': 'text/plain'
};

http.createServer(function (request, response) {
        var requestUrl = request.url || '/';
        // Strip query string and hash
        var requestPath = requestUrl.split('?')[0].split('#')[0];

        // Default to /magwell/zh_cn/index.html for root
        if (requestPath === '/' || requestPath === '') {
                requestPath = '/magwell/zh_cn/index.html';
        }

        // Prevent directory traversal and ensure path is relative to project dir
        var safePath = path.normalize(requestPath).replace(/^(\.{2}[\/\\])+/g, '');
        // Remove leading slashes so path.join doesn't treat the path as absolute
        safePath = safePath.replace(/^\/+/, '');
        var filePath = path.join(__dirname, safePath);
        console.log('url:', request.url);

        fs.stat(filePath, function(err, stats) {
                if (err || !stats.isFile()) {
                        response.writeHead(404, {'Content-Type': 'text/plain'});
                        response.end('404 Not Found\n');
                        return;
                }

                var ext = path.extname(filePath).toLowerCase();
                var contentType = mimeTypes[ext] || 'application/octet-stream';

                fs.readFile(filePath, function(err, data) {
                        if (err) {
                                response.writeHead(500, {'Content-Type': 'text/plain'});
                                response.end('500 Internal Server Error\n');
                                return;
                        }

                        response.writeHead(200, {'Content-Type': contentType});
                        response.end(data);
                });
        });
}).listen(80);

console.log('Server running at http://127.0.0.1/');