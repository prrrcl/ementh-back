'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  friends: [{
    type: ObjectId,
    ref: 'User'
  }],
  profileImg: {
    type: String,
    default: 'https://res.cloudinary.com/dsjopbxpn/image/upload/v1565555836/ementh/ementh_01-05_sqertp.jpg'
  }
  ,
  chats: {
    type: [{
      type: ObjectId,
      ref: 'Chat'
    }]
  },
  classes:[{
    type: ObjectId,
    ref: 'BoxClass'
  }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
