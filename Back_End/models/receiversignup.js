
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const donorschem = new schema({
    ngoname: { type: String },
    email: { type: String, unique: true },
    password: { type: String},
    address: { type: String },
    contact: { type: Number, },
    ngourl:{ type:String,unique:true}

})

const receiver= mongoose.model('receiver', donorschem);

module.exports =receiver