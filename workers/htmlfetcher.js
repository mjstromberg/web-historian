// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

// clock that periodically checks difference between
// sites.txt and the sites folder

var htmlArray = [];

// compile the array of sites to download
var htmlFetch = function() {
  // readList
  return archive.readListOfUrls()
    .then(function(listObj) {
      // take content and loop
      for (var url in listObj) {
        archive.isUrlArchived(url)
          .then(function(bool) {
            // if Url is not archived
            if (!bool) {
              // push to htmlArray
              htmlArray.push(url);
            }
          });
      }
    });
};

htmlFetch();

// calls download on the array
if (htmlArray.length !== 0) {
  archive.downloadUrls(htmlArray);
}
// I - nothing
// O - an array of urls that are not in the sites folder - calls dl on em

