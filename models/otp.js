const mongoose = require('mongoose');

const schema = mongoose.Schema({
  number: mongoose.Schema.Types.String,
  otp: mongoose.Schema.Types.String,
}, {
  timestamp: true,
});

module.exports = mongoose.model('otp', schema);
