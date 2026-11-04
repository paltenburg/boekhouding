"use strict";
const assert = require("node:assert/strict");
const {parseMoney,sheetIdFrom,rowFromValues,sameRow,direction} = require("../app.js");
for(const [value, expected] of [
  ["€1,000.00",1000],["€1.000,00",1000],["€3,149.90",3149.9],
  ["25,50",25.5],["-3,20",-3.2],["0",0],["€995.00",995]
])assert.equal(parseMoney(value),expected,"Failed amount: "+value);
assert.ok(Number.isNaN(parseMoney("abc")));
assert.ok(Number.isNaN(parseMoney("")));
assert.equal(sheetIdFrom("https://docs.google.com/spreadsheets/d/EXAMPLE_SPREADSHEET_ID_1234567890/edit"),"EXAMPLE_SPREADSHEET_ID_1234567890");
assert.equal(sheetIdFrom("https://evil.example/spreadsheets/d/EXAMPLE_SPREADSHEET_ID_1234567890/edit"),"");
const row=rowFromValues(["2026-05-02","Aldi","Janne","Popke","€51.00"],8);
assert.equal(row.rowNumber,8);
assert.equal(row.amount,51);
assert.equal(direction(row),1);
assert.equal(direction({...row,from:"Popke",to:"Janne"}),-1);
assert.equal(direction({...row,from:"",to:""}),0);
assert.ok(sameRow(row,{...row}));
assert.ok(!sameRow(row,{...row,amount:52}));
assert.equal(rowFromValues(["","","","","€995.00"],14).amount,995);
assert.equal(rowFromValues([],15),null);
const {buildAppendRequest}=require("../app.js");
const appended=buildAppendRequest("2026-11-03","Test","Janne","Popke",40).appendCells;
assert.equal(appended.sheetId,0);
assert.equal(appended.fields,"userEnteredValue,userEnteredFormat.numberFormat");
assert.equal(appended.rows.length,1);
assert.equal(appended.rows[0].values.length,7);
assert.deepEqual(appended.rows[0].values[0],{});
assert.deepEqual(appended.rows[0].values[1],{});
assert.equal(appended.rows[0].values[2].userEnteredValue.stringValue,"2026-11-03");
assert.equal(appended.rows[0].values[3].userEnteredValue.stringValue,"Test");
assert.equal(appended.rows[0].values[4].userEnteredValue.stringValue,"Janne");
assert.equal(appended.rows[0].values[5].userEnteredValue.stringValue,"Popke");
assert.equal(appended.rows[0].values[6].userEnteredValue.numberValue,40);
assert.equal(appended.rows[0].values[6].userEnteredFormat.numberFormat.type,"CURRENCY");
console.log("Boekhouding unit tests geslaagd.");
