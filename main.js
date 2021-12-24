const {Intents, Discord, Client, Message, MessageEmbed, Channel, Emoji, Collector, GuildChannel, Team} = require('discord.js');
const { prefix, token } = require('./config.json');
const Sheets = require("node-sheets").default;
const util = require('util');
const sh = require('./sheetHandler.js');
const pe = require('./postEmbed.js');
var formattedTable = "Staff:";
const client = new Client({

    intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES]
    
});

client.once('ready', whenReady);

async function whenReady(){
   
    console.log("Client is ready to login.");
    //requireSheetInfo();
    await sh.test("test");
    sh.getPostLayout('A');
    sh.getPostLayout('B');
    sh.getPostLayout('C');

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
                    createEmbed(message.channel,formattedTable,"LOL");
                    break;

                    case "hi":
                    message.reply(`${args[0]}\n${args[1]}\n${args[2]}`);
                    break;


                }
        }
});


async function createEmbed(channel, description, title, thumbnail ,col) {

    embed = new MessageEmbed()
    .setThumbnail(thumbnail)
    .setDescription(`${description}whatever`)
    .setTitle(title)
    channel.send(   {embeds: [embed]}  );

}
