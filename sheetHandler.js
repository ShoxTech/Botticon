
const util = require('util');
const Sheets = require("node-sheets").default;
const gs = new Sheets('1retoAlSUiBAdBpoGnJ878-7dXaXM2SVeMlu3aRGO7Pw');
const authData = require('./authData.json');
const { Discord, MessageEmbed } = require("discord.js");
var stafflist = {};


function authenticate(){
    if(gs.auth == null){
        gs.authorizeJWT(authData);
    }
    
}

var test = async function(test){
    console.log(test);
    authenticate();
    

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
    //console.log(util.inspect(testtab,false,null));
    stafflist = testtab;
    
}
var getPostLayout = async function(id){
    console.log(`Fetching postLayout(${id}) for discord`);
    authenticate();
    var lt = await gs.tables(`Layouts!${id}1:${id}2`);
    layout = lt.rows[0][lt.headers[0]]['value'];
    var ret = {header: lt.headers[0],data: layout};
    return ret;
}
var getPostObject = async function(id){
    console.log('constructing obj');
    authenticate();
    var lt = await gs.tables(`Layouts!${id}1:${id}6`);
    var layout = {
        title: lt.rows[0][lt.headers[0]]['value'],
        weartext: lt.rows[1][lt.headers[0]]['value'],
        musictext: lt.rows[2][lt.headers[0]]['value'],
        flyerlink: lt.rows[3][lt.headers[0]]['value'], 
        social: lt.rows[4][lt.headers[0]]['value'], 
    }
    return layout;
}

var embed = new MessageEmbed();

var getStafflist = function(){
    return stafflist;
}


module.exports = {
    test,
    getStafflist,
    getPostLayout,
    getPostObject

}