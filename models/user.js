const mongoose = require("mongoose")
const UserSchema = mongoose.Schema(
    {
        "name":{type:String},
        "phone":{type:String},
        "email":{type:String},
        "age":{type:String},
        "gender":{type:String},
        "address":{type:String},
        "pincode":{type:String},
        "password":{type:String}
    }
)
var UserModel = mongoose.model("users",UserSchema)
module.exports = UserModel