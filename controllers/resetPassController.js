const User = require("../models/user");
const Otp = require("../models/otp");
const otpGen = require("../utils/otpGen");
const sendOtpToMail = require("./otpMailer");

const userPresentCheck = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((respUser) => {
      if (respUser) {
        res.json({ msg: "user present" });
      } else {
        res.json({ msg: "user not present" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const sendOtp = (req, res) => {
  const otpVal = otpGen();
  const otpDat = {
    email: req.body.email,
    otp: otpVal,
  };
  const otp = new Otp(otpDat);
  Otp.findOne({ email: req.body.email }).then((resUser) => {
    if (resUser) {
      Otp.findOneAndUpdate(
        { email: otpDat.email },
        { $set: { otp: otpDat.otp } },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log("Something wrong when updating data!");
          }
          sendOtpToMail(req, res, otpDat.otp);
        }
      );
    } else {
      otp
        .save()
        .then((resp) => {
          sendOtpToMail(req, res, otpDat.otp);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

module.exports = {
  userPresentCheck,
  sendOtp,
};
