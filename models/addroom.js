const mongoose = require("mongoose")
const RoomSchema = mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
        roomnumber:{type:String},
        type:{type:String},
        availability:{type:String},
        amenities:{type:String},
        description:{type:String},
        profile:{type:String},
        price:{type:Number}
        
    }
)

var RoomModel = mongoose.model("rooms",RoomSchema)
module.exports=RoomModel