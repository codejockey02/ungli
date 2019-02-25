const express = require('express');
const SendOTP = require('sendotp');
const random = require('randomstring');
const user = require('./utils/register');
const Voters = require('../models/user');
const Otp = require('../models/otp');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const {
    number,
  } = req.body;
  const otp = random.generate({
    length: 6,
    charset: 'numeric',
  });
  const otpInst = new SendOTP(process.env.OTP_KEY);
  const newOTP = new Otp({
    number,
    otp,
  });
  try {
    const check = await Otp.findOne({
      number,
    }, {
      otp: 1,
    });
    if (check === null) {
      await newOTP.save();
    } else {
      await Otp.updateOne({
        number,
      }, {
        $set: {
          otp,
        },
      });
    }
  } catch (err) {
    res.json({
      error: true,
      code: null,
      output: 'Error making database call',
    });
  }
  otpInst.send(number, 'INGOVT', otp, (err) => {
    if (err) {
      res.json({
        error: true,
        code: null,
        output: 'Error sending OTP',
      });
    } else {
      res.json({
        error: false,
        code: null,
        output: 'OTP Sent',
      });
    }
  });
});

router.post('/auth', async (req, res) => {
  const {
    number,
    otp,
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
  } = req.body;
  const check = await Otp.findOne({
    number,
  }, {
    otp: 1,
  });
  const verify = await Voters.findOne({
    uid,
  }, {
    token: 1,
  });
  if (otp !== check.otp) {
    res.json({
      error: true,
      code: null,
      output: 'OTP is Invalid',
      user_token: null,
    });
  } else {
    const age = Number(yob);
    const presentAge = new Date().getFullYear() - age;
    if (presentAge < 18) {
      res.json({
        error: true,
        code: null,
        output: 'Age is not enough to vote',
        user_token: null,
      });
    } else if (verify !== null) {
      res.json({
        error: false,
        code: null,
        output: 'Already Registered',
        token: verify.token,
      });
    } else {
      const token = random.generate({
        charset: 'alphanumeric',
      });
      user.register(number, uid, name, presentAge, gender, yob, co, house, street, vtc, po, dist, subdist, state, pc, dob, token)
        .then(() => res.json({
          error: false,
          code: null,
          output: 'Registered',
          user_token: token,
        }))
        .catch(() => res.json({
          error: true,
          code: null,
          output: 'Unexpected Error Occurred',
          user_token: null,
        }));
    }
  }
});

router.post('/vote', async (req, res) => {
  const vote_key = req.body.vote;
  const userToken = req.body.token;
  try {
    const check = await Voters.findOne({
      token: userToken,
    }, {
      uid: 1,
    });
    if (check === null) {
      res.json({
        error: true,
        code: null,
        output: 'User does not exist',
      });
    } else {
      await Voters.updateOne({
        token: userToken,
      }, {
        $set: {
          isVoted: 1,
          vote: vote_key,
        },
      });
      res.json({
        error: false,
        code: null,
        output: 'Voted',
      });
    }
  } catch (err) {
    res.json({
      error: true,
      code: null,
      output: 'Error making Database call',
    });
  }
});

router.post('/profile', async (req, res) => {
  const {
    token,
  } = req.body;
  try {
    const pro = await Voters.findOne({
      token,
    });
    res.json({
      error: false,
      code: null,
      output: 'Found',
      profile: pro,
    });
  } catch (err) {
    res.json({
      error: true,
      code: null,
      output: 'Error making database call',
      profile: null,
    });
  }
});

router.post('/stats', async (req, res) => {
  const {
    c1,
    c2,
    c3,
    c4,
  } = req.body;
  try {
    let count1 = await Voters.count({
      vote: c1,
    });
    let count2 = await Voters.count({
      vote: c2,
    });
    let count3 = await Voters.count({
      vote: c3,
    });
    let count4 = await Voters.count({
      vote: c4,
    });
    if (count1 == null) {
      count1 = 0;
    }
    if (count2 == null) {
      count2 = 0;
    }
    if (count3 == null) {
      count3 = 0;
    }
    if (count4 == null) {
      count4 = 0;
    }
    const total = count1 + count2 + count3 + count4;
    const first = (count1 / total) * 100;
    const second = (count2 / total) * 100;
    const third = (count3 / total) * 100;
    const fourth = (count4 / total) * 100;
    res.json({
      error: false,
      code: null,
      output: 'Found',
      stats: [first, second, third, fourth],
    });
  } catch (err) {
    res.json({
      error: true,
      code: null,
      output: 'Error making database call',
      stats: null,
    });
  }
});
module.exports = router;
