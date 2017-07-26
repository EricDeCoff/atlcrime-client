const XLSX = require('xlsx');
var wb = XLSX.readFile('downloads/COBRA110416.xlsx',
    {sheetStubs:true, bookDeps:true, bookFiles:true, bookSheet:true});
console.log(wb);
console.log(wb.Sheets);
console.log(wb.Sheets['sheet4.xml']);
console.log(XLSX.utils.sheet_to_formulae(wb.Sheets['']));
console.log(wb.AppVersion);