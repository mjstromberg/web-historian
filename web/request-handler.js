var path = require('path');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var fs = require('fs');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.handleRequest = function (req, res) {
  // make request function
  // console.log('method', req);

  var filePath;
  var headers = defaultCorsHeaders;

  var renderFile = function(filePath, statusCode, respUrl) {
    fs.readFile(filePath, 'utf8', function(error, content) {
      if (error) {
        console.log(error);
      } else {
        // serve up our html

        // set contentType in header
        // headers['Content-Type'] = contentType || 'text/plain';

        // response body
        var responseBody = {
          header: headers,
          method: 'GET',
          url: respUrl || req.url,
          results: content
        };
        statusCode = statusCode || 200;
        res.writeHead(statusCode, headers);
        res.end(responseBody.results);
      }
    });
  };

  
  // if req.method === GET
  if (req.method === 'GET') {
    // if req.url = '/'
    var extension = req.url.slice(req.url.lastIndexOf('/') + 1);

    if (extension === 'styles.css' || extension === 'submit.js' || extension === 'jquery.min.js') {
      console.log(extension);
      if (extension === 'jquery.min.js') {
        filePath = path.join(__dirname, '../bower_components/jquery/dist/jquery.min.js');
        renderFile(filePath, 200);
      } else {
        filePath = path.join(__dirname, '../web/public/' + req.url.slice(req.url.lastIndexOf('/') + 1));
        renderFile(filePath, 200);
      }
    } else if (req.url === '/') {
      // grab index.html file
      filePath = path.join(__dirname, '../web/public/index.html');
      renderFile(filePath, 200);
      // if url is in sites.txt && url is archived
    } else {
      console.log('bool', req.url.toString().indexOf('=') !== -1);
      if (req.url.toString().indexOf('=') !== -1) {
        var domain = req.url.toString().slice(req.url.lastIndexOf('=') + 1);
        console.log('domain', domain);
      } else {
        var domain = req.url.toString().slice(1);
      }
      console.log('running', req.url);
      archive.isUrlArchived(domain)
        .then(function(bool) {
          if (!bool) {
            filePath = path.join(__dirname, '../web/public/loading.html');
            renderFile(filePath);
            archive.addUrlToList(domain);     
          } else {
            filePath = archive.paths.archivedSites.concat('/', domain, '.html');
            renderFile(filePath);
          }
        });    
    }
  }
};

