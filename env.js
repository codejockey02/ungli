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
};
