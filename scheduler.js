var cron = require("cron").CronJob;

//const createEmbedPost = require('./main.js').createEmbedPost;

var cronInit = function(jobs,callback){
    for(var i = 0; i< jobs.length; i++){
        var tjob = jobs[i]
        var _job = new cron(
            tjob.cron,
            function(){
                console.log("Running cron job: " + i);
                callback(tjob.field,tjob.layout);
            }
        );
        _job.start();
        console.log("Registered Cronjob: " + i);
    }

}
// cron
module.exports = {
    cronInit
}