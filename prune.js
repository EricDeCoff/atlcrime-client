const mysql = require("mysql");

const sqlCommands = [
    {"SQL":"ALTER TABLE `atlcrime`.`atlcrime` \
    DROP `apt_office_num`, \
    DROP `apt_office_prefix`, \
    DROP `Avg_Day`, \
    DROP `beat`, \
    DROP `dispo_code`, \
    DROP `loc_type`, \
    DROP `MinOfibr`, \
    DROP `MinOfucr`, \
    DROP `npu`, \
    DROP `poss_date`, \
    DROP `poss_time`, \
    DROP `Shift`",
     "MSG":"DROP UN-USED COLUMNS",
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

