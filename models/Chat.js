'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const chatSchema = new Schema({
  userOne: {
    type: ObjectId
  },
  userTwo: {
    type: ObjectId
  },
  messages: [{
    type: ObjectId,
    ref: 'Message'
  }],
  sala: String
}, {
  timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
