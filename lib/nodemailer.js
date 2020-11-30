const nodemailer = require('nodemailer');

exports.sendingMail = options => {
    console.log(`options : ${options}`);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILER_EMAIL_ID,
            pass: process.env.MAILER_PASSWORD,
        },
    });
    // const options = {
    //     from: process.env.MAILER_EMAIL_ID,
    //     to: 'ehgks0083@gmail.com',
    //     subject: 'Test sending email',
    //     text: `
    //     Sending Test Mail
    //     Id : ${id}
    //     Email : ${email}
    //     Token : ${process.env.CLIENT_URL}/users/${resetToken}`,
    // };
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('set : ', info.response);
    });
};

// exports.options = {
//     from: `${process.env.MAILER_EMAIL_ID}`,
//     to: `${email}`,
//     subject: 'Test sending email',
//     text: `
//     Sending Test Mail

//     Your info :
//     Name : ${name}
//     Email : ${email}
//     Please click this link if you want to be certified. : ${process.env.CLIENT_URL}/users/certify/${certifyToken}`,
// };
