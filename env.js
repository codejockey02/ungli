module.exports = () => {
  if (process.env.PORT === undefined) {
    process.env.PORT = 3000;
  }
  if (process.env.MONGO_URL === undefined) {
    process.env.MONGO_URL = 'mongodb://ungliUser:Ungli123@ds113179.mlab.com:13179/ungli';
  }
  if (process.env.OTP_KEY === undefined) {
    process.env.OTP_KEY = '242758AH31FYTYG5bc3238e';
  }
  if (process.env.JWT_SECRET === undefined) {
    process.env.JWT_SECRET = 'L(@#@%%DHHVNNnn&777NNN_TIGDI_1516_C_420_00001111aAhHgTFnnn*&%6#@mbmLL';
  }
};
