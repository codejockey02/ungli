const mongoose = require('mongoose');

const schema = mongoose.Schema({
  number: mongoose.Schema.Types.String,
  uid: mongoose.Schema.Types.String,
  name: mongoose.Schema.Types.String,
  gender: mongoose.Schema.Types.String,
  yob: mongoose.Schema.Types.String,
  co: mongoose.Schema.Types.String,
  house: mongoose.Schema.Types.String,
  street: mongoose.Schema.Types.String,
  vtc: mongoose.Schema.Types.String,
  po: mongoose.Schema.Types.String,
  dist: mongoose.Schema.Types.String,
  subdist: mongoose.Schema.Types.String,
  state: mongoose.Schema.Types.String,
  pc: mongoose.Schema.Types.String,
  dob: mongoose.Schema.Types.String,
  token: mongoose.Schema.Types.String,
  isVoted: mongoose.Schema.Types.Boolean,
  vote: mongoose.Schema.Types.String,
}, {
  timestamp: true,
});

module.exports = mongoose.model('user', schema);
