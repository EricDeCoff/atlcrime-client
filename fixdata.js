const mysql = require('mysql');



var sqlCommands = [     
    {'SQL':"UPDATE atlcrime_import SET OCCUR_TIME = '00:00:00' WHERE OCCUR_TIME = ''"},    
    {'SQL':"UPDATE atlcrime_import SET UC2 = 'AUTO' WHERE UC2 = 'AUTO THEFT' OR UC2 = 'LARCENY-FROM VEHICLE'"},
    {'SQL':"UPDATE atlcrime_import SET UC2 = 'ASSAULT' WHERE UC2 = 'AGG ASSAULT'"},
    {'SQL':"UPDATE atlcrime_import SET UC2 = 'BURGLARY' WHERE UC2 = 'BURGLARY-NONRES' OR UC2 = 'BURGLARY-RESIDENCE'"},
    {'SQL':"UPDATE atlcrime_import SET UC2 = 'LARCENY' WHERE UC2 = 'LARCENY-NON VEHICLE'"},
    {'SQL':"UPDATE atlcrime_import SET UC2 = 'ROBBERY' WHERE UC2 = 'ROBBERY-COMMERCIAL' OR UC2 = 'ROBBERY-RESIDENCE' OR UC2 = 'ROBBERY-PEDESTRIAN'"},    
    {'SQL':"UPDATE atlcrime_import SET Shift = 'Day' WHERE HOUR(OCCUR_TIME) > 3 AND HOUR(OCCUR_TIME) < 17"},    
    {'SQL':"UPDATE atlcrime_import SET Shift = 'Night' WHERE HOUR(OCCUR_TIME) < 3 OR HOUR(OCCUR_TIME) > 17"},    
    {'SQL':"UPDATE atlcrime_import SET occur_date = CONCAT( SUBSTRING( occur_date, 7, 4 ) ,  '-', SUBSTRING( occur_date, 1, 2 ) ,  '-', SUBSTRING( occur_date, 4, 2 ) ) WHERE occur_date REGEXP '^[0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]$'"},    
    {'SQL':"UPDATE atlcrime_import SET poss_date = CONCAT( SUBSTRING( poss_date, 7, 4 ) ,  '-', SUBSTRING( poss_date, 1, 2 ) ,  '-', SUBSTRING( poss_date, 4, 2 ) ) WHERE poss_date REGEXP '^[0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]$'"},    
    {'SQL':"UPDATE atlcrime_import SET rpt_date = CONCAT( SUBSTRING( rpt_date, 7, 4 ) ,  '-', SUBSTRING( rpt_date, 1, 2 ) ,  '-', SUBSTRING( rpt_date, 4, 2 ) ) WHERE rpt_date REGEXP '^[0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]$'"},    
];

for(var i in sqlCommands){
    console.log(sqlCommands[i].SQL);

    var connection = mysql.createConnection({
        host:'107.180.40.41',
        user:'atlcrime',
        password:'Eric@4503',
        database:'atlcrime'
    });

    connection.connect();


    connection.query(sqlCommands[i].SQL, [ sqlCommands[i].SQL ], function(err, rows, fields) {
        if (err) throw err;
        console.log('Results: ',this.values,'\n', rows);
    });

    connection.end();

}