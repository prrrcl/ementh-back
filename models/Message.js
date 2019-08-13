'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
  idChat:{
    type: ObjectId,
    required:true
  },
  message: {
    type: String
  },
  notificationUserOne: {
    type: Boolean,
    default: true
  },
  notificationUserTwo: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
