require("dotenv").config();

const nodemailer = require("nodemailer");
const { poolConfig } = require("../config");
let transporter = nodemailer.createTransport(poolConfig);

test("verify email sending connection", done => {
  transporter.verify(function(error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
      done();
    }
  });
  expect("test done").toBe("test done");
});
