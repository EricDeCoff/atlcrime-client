var phantom=require('node-phantom');
phantom.create(function(err,ph) {
  return ph.createPage(function(err,page) {
    return page.open("http://www.google.com", function(err,status) {
      console.log("opened site? ", status);
        //jQuery Loaded. 
        //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds. 
        setTimeout(function() {
          return page.evaluate(function() {
            //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object. 
            var h2Arr = [],
            pArr = [];
            $('h2').each(function() {
              h2Arr.push($(this).html());
            });
            $('p').each(function() {
              pArr.push($(this).html());
            });
 
            return {
              h2: h2Arr,
              p: pArr
            };
          }, function(err,result) {
            console.log(result);
            ph.exit();
          });
        }, 5000);
      
    });
  });
});