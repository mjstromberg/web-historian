var path = require('path');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  // make request function
  // console.log('method', req);

  // if req.method === GET
  if (req.method === 'GET') {
    // if req.url = '/'
    if (req.url === '/') {
      // grab index.html file
      fs.readFile(path.join(__dirname, '../web/public/index.html'), function(error, content) {
        if (error) {
          console.log(error);
        } else {
          // serve up our html
          console.log('working');
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf8');
        }
      });
    }
  }
  // console.log('resp', res);
  // res.end(path.join(__dirname, '../web/public/index.html'));
  // res.end(archive.paths.list);
};
