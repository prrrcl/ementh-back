'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type:String,
    required: true,
    unique: true
  },
  token: {
    type: Number,
    required: true
  }
  ,
  password: {
    type: String,
  },
  friends: [{
    type: ObjectId,
    ref: 'User'
  }],
  profileImg: {
    type: String,
    default: 'https://res.cloudinary.com/dsjopbxpn/image/upload/v1565555836/ementh/ementh_01-05_sqertp.jpg'
  },
  chats: {
    type: [{
      type: ObjectId,
      ref: 'Chat'
    }]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
