// IIFE - Immediately-Invoked Function Expression
(function(){
    // const express = require('express');
    // const request = require('request');
    // const cheerio = require('cheerio');   

    let async = require("async");
    let http = require('http');
    let path = require('path');
    // const url = require('url');
    // const os = require("os");
    var fs = require('fs');
    // const _ = require('underscore');

    var Xray = require('x-ray')
    var util = require('util')
    var x = new Xray().delay(1000);

    let admZip = require('adm-zip');

    let i = module.exports = {
        downloadUrl: 'http://www.atlantapd.org/i-want-to/crime-data-downloads',
        crimeRawList: '',
        crimeData: '',
        scrapUrl: (url, callback) => {
            console.log('scrapUrl');
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
            (function(err, obj){
            console.log('scrapProcess');
            if(err || !obj) {
                console.log('An exception occured.')
                callback(err);
                return;
            }
            let processNext = false;
            obj.items.forEach((item) => {
                if (processNext) {
                    i.crimeRawList = item;
                    return false;
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
            if (processNext === true) {
                callback(null, i.crimeRawList);
            } else {
                callback('failed: NO RAW DATA FOUND');
            }
            }).write('scrap.json')
        },
        getList: () => {
            console.log('getList');
            i.scrapUrl(i.downloadUrl, i.processData)
        },
        processData: (err, data) => {
            console.log('processData');
            if (err || !data) {
                console.log(err);
            } else {
                console.log(data);
                let downloads = [];
                data.items.forEach((item, i) => {
                    console.log(i);
                    console.log(item);
                    if (item.hasOwnProperty('href') 
                        && item.hasOwnProperty('text')){
                            let s = item.text.split(' ');
                            item.text = s[0];
                            downloads.push(item);
                    }
                });
                let max_downloads = 10;
                async.eachLimit(
                    downloads,
                    max_downloads,
                    i.download
                    // (item, next) => {
                    //     console.log('downloading: ' + item.text);
                    //     let file = fs.createWriteStream(item.text+".zip");

                    //     let request = http.get(item.href, function(response) {
                    //         response.pipe(file);
                    //         file.on('finish', ()=>{
                    //             file.close();
                    //             next();
                    //         })
                    //     });                                        
                    // })
                )
            }
        },
        download: (item, next) => {
            console.log('downloading: ',item.text);
            let file = fs.createWriteStream(item.text+".zip");

            let request = http.get(item.href, function(response) {
                response.pipe(file);
                file.on('finish', ()=>{
                    file.close();
                    i.unzip(file.path)
                    next();
                })
                file.on('end', (file)=> {
//                    console.log('\n\nUnzipping:',path.basename(file),'...');
                    
                    // var zip = new admZip(file);
                    // zip.extractAllTo(__dirname+'/downloads/');

                    // console.log('\n\nUzipped Complete...');
                })
            });            
        },
        unzip: (file) =>{
            console.log('\n\nUn-zipping:',path.basename(file),'...');
                    
            var zip = new admZip(__dirname+'/'+path.basename(file));
            zip.extractAllTo(__dirname+'/downloads/');

            console.log('\n\nUn-zipped:', file, ' ( Complete )');
            
        }
    };

    return module
})();

