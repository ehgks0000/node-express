const nodemailer = require('nodemailer');

exports.sendingMail = (id, email, resetToken) => {
    console.log(`패스워드 초기화 신청
    아이디 : ${id}, 
    이메일 : ${email}`);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILER_EMAIL_ID,
            pass: process.env.MAILER_PASSWORD,
        },
    });
    const options = {
        from: process.env.MAILER_EMAIL_ID,
        to: 'ehgks0083@gmail.com',
        subject: 'Test sending email',
        text: `
        Sending Test Mail
        Id : ${id}
        Email : ${email}
        Token : ${process.env.CLIENT_URL}/users/${resetToken}`,
    };
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('set : ', info.response);
    });
};
