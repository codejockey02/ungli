const User = require('../../models/user');

exports.register = async (number, uid, name, gender, yob, co, house, street, vtc, po, dist, subdist, state, pc, dob, token) => {
  const newUser = new User({
    number,
    uid,
    name,
    gender,
    yob,
    co,
    house,
    street,
    vtc,
    po,
    dist,
    subdist,
    state,
    pc,
    dob,
    token,
  });
  try {
    await newUser.save();
    return {
      message: 'Registered',
    };
  } catch (err) {
    return {
      message: 'Unexpected Error Occurred',
    };
  }
};
