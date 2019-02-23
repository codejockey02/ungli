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
    await newOTP.save();
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
    } else {
      const token = random.generate({
        charset: 'alphanumeric',
      });
      user.register(number, uid, name, gender, yob, co, house, street, vtc, po, dist, subdist, state, pc, dob, token)
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

module.exports = router;
