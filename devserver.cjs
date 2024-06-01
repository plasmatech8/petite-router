const liveServer = require('live-server');
const path = require('path');

function spaWithAssets(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') next();
  // If the URL does not have a file extension, serve the index.html file instead of asset in folder
  if (path.extname(req.url) === '') req.url = '/index.html';
  next();
}

const params = {
  root: 'example',
  middleware: [spaWithAssets]
};

liveServer.start(params);
