const JSftp = require("jsftp");
const fs = require("fs");
const mysql = require("mysql");

var year = new Date().getFullYear();
var subYear = 1;
var _continue = true;

console.log('argv',process.argv.length);

if(process.argv.length === 3){
    year = process.argv[2]; 
    subYear = 2000;
}

while (year > 2008){
    console.log('Loading ',year,'...');

    var connection = mysql.createConnection({
        host:'107.180.40.41',
        user:'atlcrime',
        password:'Eric@4503',
        database:'atlcrime'

    });

    connection.connect();
    
    connection.query("LOAD DATA LOCAL INFILE './uploads/atlcrime"+year+".csv' REPLACE INTO TABLE atlcrime_import FIELDS TERMINATED BY  ',' ENCLOSED BY  '\"'", [ year ], function(err, rows, fields) {
        if (err) throw err;
        console.log('Results: ',this.values,'\n', rows);
    });
    
    connection.end();
    year = year - subYear;
}
console.log('Please Wait...')


