var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bemimer@gmail.com',
        pass: 'ky12091010+'
    }
});

var mailOptions = {
    from: 'bemimer@gmail.com',
    to: 'bm1478@naver.com, bm1478@konkuk.ac.kr',
    subject: 'Sending Email using Node.js',
    //text: 'That was easy!',
    html: '<h1>Welcome</h1><p>That was easy!</p>'
};

transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
        console.log(error);
    }
    else {
        console.log('Email sent: ' + info.response);
    }
});