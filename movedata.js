const mysql = require("mysql");

const sqlCommands = [
    {"SQL":"DROP TABLE IF EXISTS  `atlcrime`.`new_atlcrime`",
     "MSG":"DROP TABLE IF EXISTS `atlcrime`.`new_atlcrime`",
    "INDEX":1},
    {"SQL":"CREATE TABLE `new_atlcrime` LIKE `atlcrime_import`",
      "MSG":"CREATE TABLE `new_atlcrime`",
    "INDEX":2},
    {"SQL":"INSERT `new_atlcrime` SELECT * FROM `atlcrime_import`",
      "MSG":"INSERT DATA INTO `new_atlcrime`",
      "INDEX":3},
    {"SQL":"DROP TABLE IF EXISTS  `atlcrime`.`atlcrime`",
     "MSG":"DROP TABLE IF EXISTS `atlcrime`.`atlcrime`",
    "INDEX":4},
    {"SQL":"RENAME TABLE `atlcrime`.`new_atlcrime` TO `atlcrime`.`atlcrime`",
     "MSG":"RENAME TABLE `atlcrime`.`new_atlcrime` TO `atlcrime`.`atlcrime`",
    "INDEX":0},
];

process_sql(sqlCommands,0);

function process_sql(_sqlCommands,_i){
    console.log(_sqlCommands[_i].MSG);

    var connection = mysql.createConnection({
        host:'107.180.40.41',
        user:'atlcrime',
        password:'Eric@4503',
        database:'atlcrime'

    });

    connection.connect();

    connection.query(_sqlCommands[_i].SQL, { "sqlCommands":_sqlCommands, "i":_i }, function(err, rows, fields) {
        if (err) {
            console.log("\n\nMight need remote database ip address access\n\n");
            throw err;
        }
        console.log('Results: ',this.values.sqlCommands[this.values.i].MSG,'\n', rows);
        if (this.values.sqlCommands[this.values.i].INDEX > 0){
            process_sql(this.values.sqlCommands,this.values.sqlCommands[this.values.i].INDEX);
//            process_sql(this.values.sqlCommands,this.values.sqlCommands[this.values.i].INDEX)
        }
            

    });

    connection.end();
}
module.exports.process_sql = process_sql;

