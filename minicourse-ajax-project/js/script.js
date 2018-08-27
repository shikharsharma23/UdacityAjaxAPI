
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val(); // retrieve street
    var cityStr = $('#city').val(); // retrieve city
    var address = streetStr + ',' + cityStr ;// form the address
    $greeting.text("So you want to live at : " + address + "?");
    var streetviewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + address +'';
    // $body.css('background-image', 'url(' + streetviewUrl + ')');
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');


    // NY times ajax request
    var nytimesUrl ='http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=9eb0ca9bcc7a4bce8bcc3f2393614bd8'

    // make the ajax request using $.getJson method of jquery
    $.getJSON(nytimesUrl, function(data){ // when the ajax call is made data is returned to this anonymous funcition which works on processing it
         
         $nytHeaderElem.text('New York Times Articles About ' + cityStr);
         articles = data.response.docs;
         for(var i=0; i<articles.length; i++){
            var article = articles[i]; // get article
             $nytElem.append('<li class="article">' + '<a href="'+article.web_url+'">' + article.headline.main + '</a>' + '<p>' + article.snippet +'</p>' + '</li>');
         }; // close for loop
         
        }// close function opening curly brace 

        ).error(function(e) {
        $nytHeaderElem.text('New York Times Article could not be loaded')
        }); // close $.get json function call and chain .error method and handling of it in get JSon


    // WIKIPEDIA JSONP api request to avoid CORS issue
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr   + '&format=json&callback=wikiCallback';



  // create a setTimeout to handle errors. due to jsonp there is no error handling available.
  var wikiRequestTimeout = setTimeout(function() {
    $wikiElem.text('Failed to get Wikipedia resources! Try again later..')
  }, 8000);

  $.ajax({
    url: wikiUrl,
    dataType: 'jsonp',
    // jsonp: 'callback', --> explanation: some api require you use a different name for the callback function. But by default, setting dataType: 'jsonp' sets jsonp: 'callback' hence this line parameter is redundant
    success: function(response) {
      // console.log('response: ' + response);
      var articleList = response[1];

      for (var i = 0; i < articleList.length; i++) {
        articleStr = articleList[i];
        // console.log('articleStr: ' + articleStr);
        var url = 'https://en.wikipedia.org/wiki/' + articleStr;
        // console.log('url: ' + url);
        $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
      };
      //clear setTimeout so the $wikiElem does not get overwritten
      clearTimeout(wikiRequestTimeout);
    }
  });


return false;
}; // close load data

$('#form-container').submit(loadData);
