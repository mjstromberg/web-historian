var onSubmit = function(url) {
  var newUrl = 'http://127.0.0.1:8080/' + url;
  console.log('input', newUrl);
  location.href = newUrl;
  // $.get(newUrl, function(data) {
  //   console.log('jquery update data');
  // });
};