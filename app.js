const express = require('express');
const http = require('http');

const app = express();

const middleware = require('./middleware.js');

const $;

app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/download', function(req,res){
    middleware.atlantapd_parse();
    res.send('DOWNLOAD REQUESTED');
});

app.get('/process/:file',function(req,res){
    console.log(req.params);

    var file = decodeURIComponent(req.params.file);
    middleware.atlantapd_extract_zip_data(file);

    res.send('PROCESSING');
})
const server = http.createServer(app).listen(8080, function(err) {
  if (err) {
    console.log(err);
  } else {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server listening on ${host}:${port}`);
  }
});