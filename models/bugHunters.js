const mongoose = require("mongoose");

const hunter = new mongoose.Schema({
    memberId: {type:String, default:null},
    totalBug: {type:Number, default:0},
    trueBug: {type:Number, default:0},
    crossBug: {type:Number, default:0},
    points: {type:Number, default:0},
   });
   
   module.exports = mongoose.model("bugHunter", hunter);