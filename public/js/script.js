$( document ).ready(function() {

console.log("JEIHFLKJS");

//scraper button
$('#scraper').click(() => {
  console.log('CLICKED');
  $.ajax({
    method: 'GET',
    url: '/scrape'
  }).then(status => {
    console.log(status);
    window.location.reload();
  });
});

});
