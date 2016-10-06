var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf8', function(err, content) {
      if (err) {
        reject(err, content);
      } else {
        resolve(content);
      }
    });
  }).then(function(content) {
    return JSON.parse(content.toString());
  }).catch(function(err, content) {
    console.log('readListOfUrls', err, content);
  });
};
// exports.readListOfUrls = readListOfUrls;

exports.isUrlInList = function(url) {
  return exports.readListOfUrls()
    .then(function(listObj) {
      // console.log('in listObj', listObj);
      return _.contains(listObj, url);
    });
};

exports.addUrlToList = function(url) {
  return exports.readListOfUrls()
    .then(function(listObj) {
      if (!listObj) {
        listObj = {};
      }
      listObj[url] = url;
      fs.writeFile(exports.paths.list, JSON.stringify(listObj), function(err) {
        console.log('addUrlToList', err);
      });
    });
};

exports.isUrlArchived = function(url) {
  // Build a promise
  return new Promise(function(resolve, reject) {
    fs.readdir(exports.paths.archivedSites, function(err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  }).then(function(files) {
    var newUrl = url + '.html';
    // check the folder if the right page is there
    return _.contains(files, newUrl);
  });
};

exports.downloadUrls = function(urlArray) {
  // for each url in urlArray
  urlArray.forEach(function(url) {
    // create a new Promise
    new Promise(function(resolve, reject) {
      // check isUrlArchived
      exports.isUrlArchived(url)
      // then
      .then(function(bool) {
        // if bool is false
        if (!bool) {
          //open a request
          request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              // store file in sites folder
              fs.writeFile(exports.path.archivedSites + url + '.html', body, function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(url, ' downloaded');
                }
              });
            }
          }); 
        }
      });
    });
  });
};


















