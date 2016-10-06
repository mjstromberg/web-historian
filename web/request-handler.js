var path = require('path');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  // make request function
  // console.log('method', req);
  var filePath;
  var contentType;
  // if req.method === GET
  if (req.method === 'GET') {
    // if req.url = '/'
    if (req.url === '/') {
      // grab index.html file
      filePath = path.join(__dirname, '../web/public/index.html');
      var contentType = 'text/html';
    } else {
      // get whatever is in sites.txt
      var sites;

      fs.readFile(path.join(__dirname, '../archives/sites.txt'), function(error, content) {
        if (error) {
          console.log(error);
        } else {
          sites = content;
        }
      });
      // if url is in sites.txt
      if (sites[req.url]) {
        // set filePath to sites/url
        filePath = path.join(__dirname, '../archives/sites' + req.url);
        // set contentType to 'text/html'
        contentType = 'text/html';
      // else
      } else {
        // set filePath to loading.html
        filePath = path.join(__dirname, '../web/public/loading.html');
        // set contentType to 'text/html'
        var contentType = 'text/html';
        // add url to sites.txt

        // save html file in sites folder
        
      }
    }
  }

  fs.readFile(filePath, function(error, content) {
    if (error) {
      console.log(error);
    } else {
      // serve up our html
      console.log('working');
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });

  // res.end(archive.paths.list);
};
