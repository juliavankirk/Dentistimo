const mongoose = require('mongoose');
//const express = require('express');
//const morgan = require('morgan');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    title:{type: String, required: true},
    message:{type: String, required: true},
    clinicName:{type: String, required:true}
},
{
    timestamps: true
}
)
const Messages = mongoose.model('Messages', messagesSchema);
module.exports = Messages;
