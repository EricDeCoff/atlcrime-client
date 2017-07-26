const os = require("os");
const fs = require('fs');
const _ = require('underscore');
const middleware = require('./middleware.js');

//const JSftp = require("jsftp");

var CWD = process.cwd();
var fileCSV = middleware.getMostRecentCSV('./downloads');

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./downloads/'+fileCSV)
});

var expectedHeader = [ "MI","ID","rpt_date","occur_date","occur_time","poss_date","poss_time","beat","apt_office_prefix","apt_office_num","location","MinOfucr","MinOfibr","dispo_code","victims","Shift","Avg_Day","loc_type","UC2","neighborhood","npu","x","y" ];
var readHeader = [];
var lineCount = 0;
var writeStream = false;
var validHeader = false;

const years = [];
const putFiles = [];

console.log(middleware.showFields(expectedHeader));

lineReader.on('line', function (line) {
    lineCount = lineCount+1;
    if (lineCount === 1){
        readHeader = line.replace(/"/g,'').split(',');
        console.log("expecteHeader vs readHeader _.isEqual:", _.isEqual(expectedHeader,middleware.fixHeader(readHeader)));
        if (_.isEqual(expectedHeader,middleware.fixHeader(readHeader))){
            validHeader = true;
            // lineReader.close();
        } else {
            console.log(expectedHeader);
            console.log(middleware.fixHeader(readHeader));
            lineReader.close();          
        }
    }
    if (validHeader && lineCount > 1){
//        console.log('Processing Line ',lineCount,' from file:', fileCSV);
        var putYear = middleware.getYear(line.split(',')[3]);
        var putFile = null;

        if (years.indexOf(putYear) === -1){
            years.push(putYear);
            /*
            console.log(years);
            console.log(years.indexOf(putYear));
            console.log(years[years.indexOf(putYear)]);
            */
            putFile = putFiles[years.indexOf(putYear)] = fs.createWriteStream('./uploads/atlcrime'+putYear+'.csv');
        }else{
            putFile = putFiles[years.indexOf(putYear)];
        }
        middleware.putData(putFile,line);   
    }
});
