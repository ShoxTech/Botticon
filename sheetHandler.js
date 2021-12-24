
const util = require('util');
const Sheets = require("node-sheets").default;
const gs = new Sheets('1retoAlSUiBAdBpoGnJ878-7dXaXM2SVeMlu3aRGO7Pw');
const authData = require('./authData.json');

var test = async function(test){
    console.log(test);
    gs.authorizeJWT(authData);
    //table = await gs.tables('Staff List!C3:I36'); // management
    var sttab = await gs.tables('Staff List!C3:C36'); // management
    var ftab = await gs.tables('Staff List!D3:E36'); // management
    var stab = await gs.tables('Staff List!H3:I36'); // management
    table = {
        staff:sttab.rows,
        friday:ftab.rows,
        saturday:stab.rows
    };
    var testtab = []
    for(var i = 0; i<sttab.rows.length; i++){
        if(!ftab.rows[i]){continue;}
        if(!stab.rows[i]){continue;}
        if(!sttab.rows[i]){continue;}
        if(!sttab.rows[i]['Name']){continue;}
        if(!ftab.rows[i]['To ST']){continue;}
        if(!stab.rows[i]['To ST']){continue;}
        if(!ftab.rows[i]['From ST']){continue;}
        if(!stab.rows[i]['From ST']){continue;}
        
        var obj = {
            name: sttab.rows[i]['Name']['value'],
            friday:{
                start: ftab.rows[i]['From ST']['value'],
                end: ftab.rows[i]['To ST']['value']
            },
            saturday:{
                start: stab.rows[i]['From ST']['value'],
                end: stab.rows[i]['To ST']['value']
            }
        };
        testtab.push(obj);
    }
    /*
        {
            name: 'Kiri',
            Frieday: {
                start: '8:30',
                end: 20:00'
            },
            saturday:{
                start: '9:30',
                end: '12:00'
            }
        }
    
    
    */

    
    console.log(util.inspect(testtab,false,null));
    
}
var stafflist = {bartender:[],manager:[],dancer:[],security:[],receptionist:[]};















































var genlist = async function requireSheetInfo() {
    stafflist = {bartender:[],manager:[],dancer:[],security:[],receptionist:[]};
    try {
        gs.authorizeJWT(authData);
        table = await gs.tables('Staff List!C5:C9'); // management
        for(var I=0;I<table.rows.length;I++) {
            var obj = table.rows[I][table.headers]
            if(obj) {
                console.log(obj['value']);
                stafflist['manager'].push(obj['value']);
            }
        }
        table = await gs.tables('Staff List!C11:C13'); // bartender
        for(var I=0;I<table.rows.length;I++) {
            var obj = table.rows[I][table.headers]
            if(obj) {
                stafflist['bartender'].push(obj['value']);
            }
        }
        table = await gs.tables('Staff List!C15:C19'); // receptionist
        for(var I=0;I<table.rows.length;I++) {
            var obj = table.rows[I][table.headers]
            if(obj) {
                stafflist['receptionist'].push(obj['value']);
            }
        }
        table = await gs.tables('Staff List!C21:C25'); // security
        for(var I=0;I<table.rows.length;I++) {
            var obj = table.rows[I][table.headers]
            if(obj) {
                stafflist['security'].push(obj['value']);
            }
        }
        table = await gs.tables('Staff List!C27:C36'); // dancer
        for(var I=0;I<table.rows.length;I++) {
            var obj = table.rows[I][table.headers]
            if(obj) {
                stafflist['dancer'].push(obj['value']);
            }
        }
     
        return true;
    } 
    catch(error) {
    
        console.error(error);
    
    }    
} 
var getStafflist = function(){
    return stafflist;
}


module.exports = {
    test,
    genlist,
    getStafflist

}