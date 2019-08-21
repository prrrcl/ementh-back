'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const benchmarkSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  marks: [{
    type: ObjectId,
    ref:'Mark'
  }]
}, {
  timestamps: true
});

const Benchmark = mongoose.model('Benchmark', benchmarkSchema);

module.exports = Benchmark;
