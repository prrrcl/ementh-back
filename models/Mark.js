'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const markSchema = new Schema({
  date: {
    type: Date
  },
  weight:{
    type: String
  },
  reps: {
    type: Number
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;
