var expect = require('chai').expect;
var server = require('../web/basic-server.js');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var path = require('path');
var supertest = require('supertest');
var initialize = require('../web/initialize.js');

initialize(path.join(__dirname, '/testdata'));

archive.initialize({
  archivedSites: path.join(__dirname, '/testdata/sites'),
  list: path.join(__dirname, '/testdata/sites.txt')
});

var request = supertest.agent(server);

describe('server', function() {
  describe('GET /', function () {
    it('should return the content of index.html', function (done) {
      // just assume that if it contains an <input> tag its index.html
      request
        .get('/')
        .expect(200, /<input/, done);
    });
  });

  describe('archived websites', function () {
    describe('GET', function () {
      it('should return the content of a website from the archive', function (done) {
        var fixtureName = 'www.google.com';
        var fixturePath = archive.paths.archivedSites + '/' + fixtureName;

        // Create or clear the file.
        var fd = fs.openSync(fixturePath, 'w');
        fs.writeSync(fd, 'google');
        fs.closeSync(fd);

        // Write data to the file.
        fs.writeFileSync(fixturePath, 'google');

        request
          .get('/' + fixtureName)
          .expect(200, /google/, function (err) {
            fs.unlinkSync(fixturePath);
            done(err);
          });
      });

      it('Should 404 when asked for a nonexistent file', function(done) {
        request.get('/arglebargle').expect(404, done);
      });
    });

    describe('POST', function () {
      it('should append submitted sites to \'sites.txt\'', function(done) {
        var url = 'www.example.com';

        // Reset the test file and process request
        fs.closeSync(fs.openSync(archive.paths.list, 'w'));

        request
          .post('/')
          .type('form')
          .send({ url: url })
          .expect(302, function (err) {
            if (!err) {
              var fileContents = fs.readFileSync(archive.paths.list, 'utf8');
              expect(fileContents).to.equal(url + '\n');
            }

            done(err);
          });
      });
    });
  });
});

describe('archive helpers', function() {
  describe('#readListOfUrls', function () {
    it('should read urls from sites.txt', function (done) {
      fs.writeFileSync(archive.paths.list, {'example1.com': true, 'example2.com': true});

      archive.readListOfUrls().then(function(parsedObj) {
        expect(parsedObj).to.deep.equal({'example1.com': true, 'example2.com': true});
        console.log('test', parsedObj);
        done();  
      }).catch(done());
    });
  });

  describe('#isUrlInList', function () {
    it('should check if a url is in the list', function (done) {
      fs.writeFileSync(archive.paths.list, {'example1.com': true, 'example2.com': true});

      archive.isUrlInList('example1.com').then(function(result) {
        expect(result).to.be.true;
      });

      archive.isUrlInList('funyuns.com').then(function(result) {
        expect(result).to.be.false;
      }).catch(done());

    });
  });

  describe('#addUrlToList', function () {
    it('should add a url to the list', function (done) {

      archive.addUrlToList('example1.com');
      archive.addUrlToList('example2.com');

      archive.isUrlInList('example1.com').then(function(result) {
        expect(result).to.be.true;
      });

      archive.isUrlInList('example2.com').then(function(result) {
        expect(result).to.be.true;
      }).catch(done());
    });
  });

  describe('#isUrlArchived', function () {
    it('should check if a url is archived', function (done) {
      fs.writeFileSync(archive.paths.archivedSites + '/www.example.com', 'blah blah');

      archive.isUrlArchived('www.example.com').then(function(result) {
        expect(result).to.be.true;
      }).catch(done());
    });
  });

  describe('#downloadUrls', function () {
    it('should download all pending urls in the list', function (done) {
      var urlArray = ['www.example.com', 'www.google.com'];
      archive.downloadUrls(urlArray);

      // Ugly hack to wait for all downloads to finish.
      setTimeout(function () {
        expect(fs.readdirSync(archive.paths.archivedSites)).to.deep.equal(urlArray);
        done();
      }, 2000);
    });
  });
});

