var Xray = require('x-ray')
var util = require('util')
var x = new Xray().delay(1000);

var f = [];
var scrapeUrl = function(url, callback) {
  x(url, {
      title: 'title', 
      items: x('.content_area',[{
          title: 'h2',
          items: x('li', [{
                href: 'a@href',
                text: 'a@html'
              }])
      }])
  })
  (function(err, obj) {
    if(err || !obj) {
      console.log('An exception occured.')
      callback(err);
      return;
    }
    console.log(obj)
    let processNext = false;
    obj.items.forEach((item) => {
      console.log(item);
      if (processNext) {
        processNext = false;
        console.log(item.items)
      }
      if (item.hasOwnProperty('title')) {
        switch(item.title.substring(0,3).toLowerCase()) {
          case "raw":  
            console.log(item.title);
            processNext = true;
            break;
         }
      }
    })

    callback(null, obj)
  }).write('results.json')
}

scrapeUrl("http://www.atlantapd.org/i-want-to/crime-data-downloads", function(err, obj) {
  if(err) {
    console.log(err);
  } else {
    // obj.forEach((linker) => {
    //   console.log(linker);
    //   var link = linker.link
    //   genericScrape(link, (err, obj) => {
    //     if(obj.title) {
    //       console.log(util.format("%s :::: %s", obj.title.trim(), obj.links.trim()))
    //     }
    //   })
    // })
  }
});