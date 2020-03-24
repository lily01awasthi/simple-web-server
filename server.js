const http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

//array of mimeTypes
var mymeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

//create server
http.createServer((req, res) => {
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(), unescape(uri));
    console.log('Loading ' + url);
    var stats;
    try {
        stats = fs.lstatSync(fileName);
    } catch (e) {
        res.writeHead(404, { 'content-type': 'text/plain' });
        res.write('404 not Found\n');
        res.end();
        return;
    }

    //create if file/directory
    if (stats.isFile()) {
        var mymeType = mymeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, { "Content-Type": mymeType });
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            'location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('500 internal error\n');
        res.end();
    }
}).listen(port);

