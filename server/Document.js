// import { Schema, model } from "mongoose";
const {Schema , model} = require('mongoose')

const DocumentSchema = Schema({
    _id:String,
    data:Object
});

const Document = model('Document',DocumentSchema);

module.exports = Document;