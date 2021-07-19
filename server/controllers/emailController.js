const db = require('../db');
const ApiError = require('../error/ApiError');
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport(
  {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    }
  },
  {
    from: `PhoneStore <${process.env.EMAIL_ADDRESS}>`
  }
);

class EmailController {
  async sendOrderEmailToUnregistredUser(req, res, next) {
    try {
      const { email, pass } = req.body
      const message = { 
        to: email, 
        subject: `Your New Order!` ,
        html: `
          <h2>Order has been successfully created!</h2>
          <h3>You can see more detailed information about your order in your profile, which we have created automatically:</h3>
          <h1>Email: ${email}</h1>
          <h1>Password: ${pass}</h1>
        `
      }
      return await transporter.sendMail(message, (err, info) => {
        if(err) return next(ApiError.badRequest(err.message));
        else return res.json(info)
      })
    }catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async sendOrderEmailToRegistredUser(req, res, next) {
    try {
      const { email } = req.body
      const message = { 
        to: email, 
        subject: `Your New Order!` ,
        html: `
          <h2>Order has been successfully created!</h2>
          <h3>You can see more detailed information about your order in your profile!</h3>
        `
      }
      return await transporter.sendMail(message, (err, info) => {
        if(err) return next(ApiError.badRequest(err.message));
        else return res.json(info)
      })
    }catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }
}

module.exports = new EmailController();