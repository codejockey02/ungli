const express = require('express');
const random = require('randomstring');
const user = require('./utils/register');
const Voters = require('../models/user');

const router = new express.Router();

router.post('/auth', async (req, res) => {
  const {
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
  } = req.body;
  const age = Number(number);
  const presentAge = new Date().getFullYear() - age;
  if (presentAge < 18) {
    res.json({
      error: true,
      code: null,
      output: 'Age is not enough to vote',
    });
  } else {
    const token = random.generate({
      charset: 'alphanumeric',
    });
    user.register(number, uid, name, gender, yob, co, house, street, vtc, po, dist, subdist, state, pc, dob, token)
      .then(() => res.json({
        error: true,
        code: null,
        output: 'Registered',
      }))
      .catch(() => res.json({
        error: true,
        code: null,
        output: 'Unexpected Error Occurred',
      }));
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
