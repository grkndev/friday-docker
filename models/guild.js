const mongoose = require("mongoose");

const guildSh = new mongoose.Schema({
    GuildID: {type:String,default:null},
    SysDurum: {type:Boolean,default:null},
    dil: {type:String,default:"en-US"},
    j2tChannelId: {type:String,default:null},
   });
   
   module.exports = mongoose.model("guild", guildSh);