const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
};

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // SPA fallback
                fs.readFile(path.join(__dirname, 'index.html'), (e2, d2) => {
                    if (e2) { res.writeHead(500); res.end('Internal Server Error'); return; }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(d2);
                });
            } else {
                res.writeHead(500);
                res.end('Internal Server Error');
            }
            return;
        }
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Etz Chaim server running on port ${PORT}`);
});
