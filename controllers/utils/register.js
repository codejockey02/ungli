const User = require('../../models/user');

exports.register = async (number, uid, name, age, gender, yob, co, house, street, vtc, po, dist, subdist, state, pc, dob, token) => {
  const newUser = new User({
    number,
    uid,
    name,
    age,
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
    isVoted: false,
  });
  try {
    await newUser.save();
    return {
      error: false,
      code: null,
      output: 'Registered',
    };
  } catch (err) {
    return {
      error: true,
      code: null,
      output: 'Unexpected Error Occurred',
    };
  }
};
