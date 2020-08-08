const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        content: {type:String,required:true},
        name: {type:String, required:true}
    },
    { timestamps:true}
)

module.exports = mongoose.model('Message', MessageSchema);