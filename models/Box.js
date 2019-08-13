'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const boxSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  members: [{
      type: ObjectId,
      ref: 'User'
    }],
  owner:{
    type: String,
    required:true
  },
  phone: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Box = mongoose.model('Box', boxSchema);

module.exports = Box;
