var cron = require("cron").CronJob;

//const createEmbedPost = require('./main.js').createEmbedPost;

var cronInit = function(callback){
    
var job = new cron(
    '*/1 * * * *',
    function(){
        console.log("uff log");
        //createEmbedPost('B');
        callback('D',2);
    }
);

/**
 * {
 *  cron: '',
 * row: 'B'
 * }
 * 
 */
job.start();
}
// cron
module.exports = {
    cronInit
}