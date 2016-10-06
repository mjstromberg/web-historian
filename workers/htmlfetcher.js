// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

// clock that periodically checks difference between
// sites.txt and the sites folder

// compile the array of sites to download
var htmlFetch = function() {
  // readList
  return archive.readListOfUrls()
    .then(function(listObj) {
      // take content and loop
      console.log(listObj);
      archive.downloadUrls(listObj);
    });
};

htmlFetch();

// I - nothing
// O - an array of urls that are not in the sites folder - calls dl on em

