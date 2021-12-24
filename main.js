const {Intents, Discord, Client, Message, MessageEmbed, Channel, Emoji, Collector, GuildChannel, Team} = require('discord.js');
const { prefix, token } = require('./config.json');
const Sheets = require("node-sheets").default;
const util = require('util');
const sh = require('./sheetHandler.js');
const pe = require('./postEmbed.js');
const moment = require('moment');
const fs = require("fs");
const lastPost = require("./lastPost.json");

var formattedTable = "Staff:";
var formattedTime;

const client = new Client({

    intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES]
    
});

client.once('ready', whenReady);

async function whenReady(){
   
    console.log("Client is ready to login.");
    //requireSheetInfo();
    await sh.test("test");
    sh.getPostObject('B');
    initiateDailyPost();
    determineExistingPosts();

}


if(token.length>0) {

    client.login(token);

}
else {

console.log(`Token is invalid: ${token}`);

}





async function requireSheetInfo() {

try {

    const gs = new Sheets('1retoAlSUiBAdBpoGnJ878-7dXaXM2SVeMlu3aRGO7Pw');
    const authData = require('./authData.json');
    gs.authorizeJWT(authData);
    table = await gs.tables('Staff List!C5:C35');
    formattedTable = "Staff:\n";

    for(var I=0;I<table.rows.length;I++) {
        var obj = table.rows[I][table.headers]
        if(obj) {
        formattedTable+=table.rows[I][table.headers]["value"]+"\n";
    }

    }

    console.log(formattedTable);


} 
catch(error) {

    console.error(error);

}



} 

client.on('messageCreate', message => {

    if(!message.author.bot) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
            switch(command) {

                    case "help":
                    console.log("Help requested");
                    var formattedString = "";
                    for(var I=0;I<args.length;I++) {

                        formattedString+=args[I]+"\n";


                    }
                    message.reply(formattedString);
                    createEmbed(message.channel,"","LOL");
                    break;

                    case "hi":
                    message.reply(`<t:803581260>`);
                    break;

                    case "testembed":
                    createEmbed(message.channel);


                }
        }
});



async function initiateDailyPost() {
    setTimeout(() => {console.log(initiateDailyPost())}, 1000);

    if(!lastPost.lastPost==moment().dayOfYear()) {

        var date = new Date();
        
        formattedTime = moment().add(2,"day").unix();
        
        console.log("Creating Post...");


    }

    else{
    
    console.log("Post was already made, returning");

    }

    return moment().day();

}




function callback(huso) {

console.log(huso);

}



function determineExistingPosts () {
    var fileName = "lastPost.json";
    fs.readFile(fileName, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj["lastPost"] = moment().dayOfYear();
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile(fileName, json, 'utf8', callback); // write it back 
    }});

}



async function createEmbed(channel) {

var postObject = await sh.getPostObject("B");
    embed = new MessageEmbed()
    .setThumbnail('https://cdn.discordapp.com/emojis/905148984463593522.gif?size=96')
    .addField("But what should I wear?",postObject["weartext"])
    .addField("What about music?",postObject["musictext"])
    .addField("But how can we keep in touch?",postObject["social"])
    .addField("Time",`<t:${formattedTime}>`)
    .setTitle(postObject["title"])
    .setImage(postObject["flyerlink"])
    channel.send(   {embeds: [embed]}  );
    
}
