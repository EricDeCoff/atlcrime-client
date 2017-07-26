const mysql = require("mysql");

var sqlCommands = [
    {"SQL":"SELECT DISTINCT UC2 FROM atlcrime_import WHERE UC2 NOT IN ('ASSAULT','AUTO','BURGLARY','HOMICIDE','LARCENY','RAPE','ROBBERY') ORDER BY UC2",
     "MSG":"CHECK FOR UN-RECONIZIED UC2"},
    {"SQL":"SELECT RPT_DATE FROM `atlcrime_import` WHERE RPT_DATE REGEXP '/'",
      "MSG":"CHECK FOR MISSED-REFORMATED DATES"},
    {"SQL":"SELECT OCCUR_DATE FROM `atlcrime_import` WHERE OCCUR_DATE REGEXP '/'",
      "MSG":"CHECK FOR MISSSED-REFORMATED DATES"},
    {"SQL":"SELECT OCCUR_DATE FROM `atlcrime_import` WHERE OCCUR_DATE REGEXP '/'",
      "MSG":"CHECK FOR MISSED-REFORMATED DATES"},
]

for(var i in sqlCommands){
    console.log(sqlCommands[i].MSG);

    var connection = mysql.createConnection({
        host:'107.180.40.41',
        user:'atlcrime',
        password:'Eric@4503',
        database:'atlcrime'

    });

    connection.connect();

    connection.query(sqlCommands[i].SQL, [ sqlCommands[i].MSG ], function(err, rows, fields) {
        if (err) throw err;
        console.log('Results: ',this.values,'\n', rows);
    });

    connection.end();
}

