const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const billSchema = new Schema(
  {
    patientId: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    services: {
      type: Array,
      required: true,
    },
    outsourceServices: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    referredDoctor: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bill', billSchema);
