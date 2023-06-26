require('dotenv').config();
const mailer = require("nodemailer");
// const smtpTransport = require('nodemailer-smtp-transport');
const {Hello} = require("./hello_template");
const { REACT_APP_NODEMAILER_USER, REACT_APP_NODEMAILER_PASS } = require('../config/config');

const getEmailData = (to, authCode) => {
    data = {
        from: "Carrot Market",
        to,
        subject: "당근마켓 회원가입 인증 이메일",
        html: Hello(authCode)
    }
    return data;
}

const sendEmail = (to, authCode) => {
    const smtpTransport = mailer.createTransport({
        service: "Gmail",
        // host: 'smtp.naver.com',
        // port: 587,
        // secure: true,
        auth: {
            user: REACT_APP_NODEMAILER_USER, //본인 이메일 주소 사용하세요
            pass: REACT_APP_NODEMAILER_PASS //본인 이메일 주소의 비밀번호
            // user: process.env.REACT_APP_NODEMAILER_USER, //본인 이메일 주소 사용하세요
            // pass: process.env.REACT_APP_NODEMAILER_PASS //본인 이메일 주소의 비밀번호
        }
    })

    const mail = getEmailData(to, authCode)

    smtpTransport.sendMail(mail, function(error, response) {
        if(error) {
            console.log(error)
        } else {
            console.log("email sent successfully")
        }

        smtpTransport.close();
    })
}
module.exports = {sendEmail}