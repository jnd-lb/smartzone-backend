const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name : {type:String, required:true},
        _id: {type:ObjectID},
});

module.exports = mongoose.model("brand",schema);