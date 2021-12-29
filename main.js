const {Intents, Discord, Client, Message, MessageEmbed, Channel, Emoji, Collector, GuildChannel, Team} = require('discord.js');
const config = require('./config.json');
const Sheets = require("node-sheets").default;
const util = require('util');
const sh = require('./sheetHandler.js');
const pe = require('./postEmbed.js');
const moment = require('moment');
const fs = require("fs");
const lastPost = require("./lastPost.json");
const cron = require('./scheduler.js');


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
    cron.cronInit(config.jobs,createEmbedPost);

}


if(config.discord.token.length>0) {

    client.login(config.discord.token);

}
else {

console.log(`Token is invalid: ${config.discord.token}`);

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
    if(message.channelId!=config.discord.channelid) {return;}
    if(!message.author.bot) {
    const args = message.content.slice(config.discord.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
            switch(command) {

                    case "help":
                    console.log("Help requested");
                    break;

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
    //setTimeout(() => {console.log(initiateDailyPost())}, 1000);

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

async function createEmbed(channel, title) {

embed = new MessageEmbed()
.setTitle(title)

channel.send( {embeds: [embed]});


}

async function createEmbedPost(row,layout) {

    var postObject = await sh.getPostObject(row);
    var guild = client.guilds.cache.get(config.discord.guildid);
    var channel = guild.channels.cache.get(postObject["channelid"]);
    switch(layout){
        case "1":
            embed = new MessageEmbed()
            .setThumbnail('https://cdn.discordapp.com/emojis/905148984463593522.gif?size=96')
            .addField("But what should I wear?",postObject["weartext"])
            .addField("What about music?",postObject["musictext"])
            .addField("But how can we keep in touch?",postObject["social"])
            .addField("Time",`<t:${formattedTime}>`)
            .setTitle(postObject["title"])
            .setImage(postObject["flyerlink"])
            channel.send(   {embeds: [embed]}  );
            break;
        case "2":
            embed = new MessageEmbed()
            .setThumbnail('https://cdn.discordapp.com/emojis/905148984463593522.gif?size=96')
            .addField("INFO",postObject["weartext"])
            .addField("Link to the register",postObject["flyerlink"])
            .setURL(postObject["flyerlink"])
            .setTitle(postObject["title"])
            .setFooter("Made by ShoxTech & Kiri Kasuto","https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/GNOME_Terminal_icon_2019.svg/192px-GNOME_Terminal_icon_2019.svg.png")
            channel.send(   {embeds: [embed]}  );
            break;
        default: 
        console.log("");
    }
     
}