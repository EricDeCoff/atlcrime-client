// middleware.js
(function(){
    const express = require('express');
    const request = require('request');
    const cheerio = require('cheerio');   

    const http = require('http');
    const path = require('path');
    const url = require('url');
    const os = require("os");
    const fs = require('fs');
    const _ = require('underscore');

    const admZip = require('adm-zip');
    
    // CAN NOT HANDLE LARGE FILES
    // const XLSX = require('xlsx');
    // const XLSX = require('xlsx-extract').XLSX;
    // const Excel = require('exceljs');
    // const xlsx = require('node-xlsx');
    // const excel = require('excel-stream');
   

    const regexURL = /(http[s]?:\/\/)?([^\/\s]+\/)(.*)/;

    function atlantapd_parse(){

        var options = {
            method: 'GET',
            host: 'www.atlantapd.org',
            port: 80,
            path: '/crimedatadownloads.aspx'
        };
        console.log('\n\nParsing table:',options.host+options.path);

        var request1 = http.request(options, function(response1) {
            var data1 = '';

            response1.on('data', function(chunk) {
                data1 += chunk;
            });

            response1.on('end', function() {
                atlantapd_extract_zip_location(data1);
            });
        });

        request1.end();
    }
    module.exports.atlantapd_parse = atlantapd_parse;

    function atlantapd_extract_zip_location(data){
        var $ = cheerio.load(data);
        var $pathGetFile = '/'+$('table tr:contains("Crime Data File") td a').attr('href');

        var optGetFile = {
            method:'GET',
            host:'www.atlantapd.org',
            port:80,
            path:$pathGetFile
        }
        console.log('\n\nExtract ZIP file location:',optGetFile.host+optGetFile.path);

        var request2 = http.request(optGetFile,function(response2){
            var data2 = '';

            response2.on('data',function(chunk){
                data2 += chunk;
            });

            response2.on('end',function(){
                atlantapd_download_zip(data2);
            });
        });

        request2.end();
    }
    module.exports.atlantapd_extract_zip_location = atlantapd_extract_zip_location;


    function atlantapd_download_zip(data){
        console.log('\n\nLatest Zip file located:', regexURL.exec(data)[0]);

        // extract pathname for download
        $pathnameDownload = url.parse(regexURL.exec(data)[0]).pathname;

        $filename = path.basename($pathnameDownload);

        $downloadZip = __dirname + '/downloads/' + $filename;

        $fileXLSX = __dirname + '/downloads/' + $filename.replace('zip','xlsx');

        // Open file to download ZIP file into
        var file = fs.createWriteStream($downloadZip);

        var optDownload = {
            method:'GET',
            host:'www.atlantapd.org',
            port:80,
            path:$pathnameDownload
        }

        console.log('\n\nDownloading...', $filename)

        var request3 = http.request(optDownload, function(response3){
            response3.on('data',function(data){
                file.write(data);
            });

            response3.on('end',function(){
                file.end();
                console.log('\n\nFILE [ ',$filename,' ] DOWNLOAD COMPLETE');

                atlantapd_file_unzip($downloadZip);
                
                atlantapd_extract_zip_data($fileXLSX);
            })
        });

        request3.end();
    }
    module.exports.atlantapd_download_zip = atlantapd_download_zip;

    function atlantapd_file_unzip(file){
        console.log('\n\nUnzipping:',path.basename(file),'...');
        
        var zip = new admZip(file);
        zip.extractAllTo(__dirname+'/downloads/');

        console.log('\n\nUzipped Complete...');
    }
    module.exports.atlantapd_file_unzip = atlantapd_file_unzip;

    function atlantapd_extract_zip_data(file){
        console.log('\n\nOpen Excel file:',file,` with Open Office`);
        console.log('\nMove Worksheet [ Query ] to first worksheet and save as CSV');        
    }
    module.exports.atlantapd_extract_zip_data = atlantapd_extract_zip_data;

    function getMostRecentCSV(dir) {
        var files = fs.readdirSync(dir);

        var csv = [];

        for(var i in files){
            if(path.extname(files[i]) === ".csv") {
                //do something
                csv.push(files[i])
            }
        }

        // use underscore for max()
        return _.max(csv, function (f) {
            var fullpath = path.join(dir, f);

            // ctime = creation time is used
            // replace with mtime for modification time
            return fs.statSync(fullpath).ctime;
        });
    }
    module.exports.getMostRecentCSV = getMostRecentCSV;

    function fixHeader(_array){
        for(var i in _array){
            switch(_array[i]){
                case "MI_PRINX":
                    _array[i] = "MI";
                    break;
                case "offense_id":
                    _array[i] = "ID";
                    break;
                case "MinOfibr_code":
                    _array[i] = "MinOfibr";
                    break;
                case "Avg Day":
                    _array[i] = "Avg_Day";
                    break;
                case "MaxOfnum_victims":
                    _array[i] = "victims";
                    break;
                case "UC2 Literal":
                    _array[i] = "UC2"
                    break;
            }
        }
        return _array;
    }
    module.exports.fixHeader = fixHeader;

    const years = [];
    function fixData(data){
        // fix data with \"
        data = data.replace(/\\"/g,'"');

        switch(data.split(',')[0]){
            case '"5117286"':
                console.log(data);
                break;
        }
       
        fields = data.split(',');


        // set str2time returns milli seconds so divide by 1000
        str2time = Date.parse(fields[3].replace(/"/g,'') + " " + fields[4].replace(/"/g,'')) / 1000

        fields.push(str2time);

        // victims: set value or empty to zero
//        fields[14] = parseInt(fields[14]) || "0";
/*
        // UC2
        switch(fields[18].replace(/"/g,'').trim()){
            case 'AUTO THEFT':
            case 'LARCENY-FROM VEHICLE':
                fields[18] = '"AUTO"';
                break;

            case 'AGG ASSAULT':
                fields[18] = `"ASSAULT"`;
                //console.log(fields[18]);
                break;

            case 'BURGLARY-NONRES':
            case 'BURGLARY-RESIDENCE':
                fields[18] = `"BURGLARY"`;
                break;

            case 'LARCENY-NON VEHICLE':
                fields[18] = '"LARCENY"';
                break;

            case 'ROBBERY-COMMERCIAL':
            case 'ROBBERY-PEDESTRIAN':
            case 'ROBBERY-RESIDENCE':
                fields[18] = '"ROBBERY"'
                break;
        }
*/
        data = fields.join(',');

        //console.log(data);

        return data;
    }
    module.exports.fixData = fixData;

    function showFields(fields){
        for(var i in fields){
            console.log(fields[i],':',i);
        }
    }
    module.exports.showFields = showFields;

    function getYear(date){
        parts = date.replace(/"/g,'').split('/');
        return parts[2];
    }
    module.exports.getYear = getYear;

    function putData(putFile, data){
        writeLine = fixData(data);
        putFile.write(writeLine + os.EOL);
    }
    module.exports.putData = putData;

    return module
})();