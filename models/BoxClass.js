'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const classSchema = new Schema({
  participants: [{
    type: ObjectId,
    ref: 'User'
  }],
  typeOfClass: {
    type: String,
    enum: ['wod', 'openbox']
  },
  maxParticipants: {
    type: Number
  },
  date:{
    type: Date
  },
  info: {
    type: String
  }
}, {
  timestamps: true
});

const BoxClass = mongoose.model('BoxClass', classSchema);

module.exports = BoxClass;
