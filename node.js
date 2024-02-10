
const Datastore = require('nedb');
const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));
const nodemailer = require('nodemailer');

const database = new Datastore('database.db');
database.loadDatabase();
const verifyDB = new Datastore('verify.db');
verifyDB.loadDatabase();
app.listen(3000,() => 
    console.log("listening")
);

app.get('/api', (request,response) => { //client asking for data
    console.log("testing")
});
app.get('/getPosts', (request,response) => { //client asking for data
    database.find({}).sort({ Order: -1 }).exec(function (err, data) {
        response.json({
            status:'success',
            message: data
    
        });
      });
});
app.post('/getComment', (request,response) => { //client asking for data
    database.find({ _id: request.body.commentKey }, function (err, docs) {
        response.json({
            status:'success',
            message: docs
    
        });
      });
    database.find({}).sort({ Time: -1 }).exec(function (err, data) {

      });
});

app.post('/api', (request,response) => {
    if(request.body.email.includes("@bu.edu")){
        sendVerificationEmail(request.body.email,generateVerificationCode());
        response.json({
            status:"success",
            message: "good work"
        });
    }
});

app.post('/verify', (request,response) => {
    let datacode = request.body.code;
    console.log("edasdas",datacode);
    verifyDB.find({"code":datacode}, function (err, docs) {
        console.log(docs.length);
        if(docs.length == 0) {
            response.json({
                status:"failure",
                message: "incorrect code"
            });
        } 
        else {
            response.json({
                status:"success",
                message: "code is verified"
            });
        }
      });
});
app.post('/getLength', (request,response) => {
    database.find({}, function (err, docs) {
        console.log('Legnth',docs.length);
            response.json({
                status:"success",
                message: "ds"
            });
      });
});
app.post('/sendData', (request,response) => {
    database.insert(request.body);
    database.find({}).sort({}).exec(function (err, docs) {});
        response.json({
            status:"success",
            message: "code is verified"
        });
});
app.post('/submitComment', (request,response) => {
    let arr = [request.body.comment,request.body.Time];
    database.update({ _id: request.body.commentKey}, { $push: { comments:arr} }, {}, function () {
        response.json({
            status:"success",
            message: "comment pushed"
        });
    });

});

function generateVerificationCode() {
    code = Math.floor(100000 + Math.random() * 900000).toString();
    verifyDB.insert({"code":code});
    return code;
}

async function sendVerificationEmail(receiverEmail, verificationCode) {
    const transporter = nodemailer.createTransport({
        service: 'smtp-mail.outlook.com',
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        auth: {
            user: 'burealme@outlook.com',
            pass: 'SpruceHill01062!',
        },
        tls: {
            ciphers:'SSLv3'
        }
    });
    console.log("inside sendverify",receiverEmail);
    const mailOptions = {
        from: 'burealme@outlook.com',
        to: receiverEmail,
        subject: 'Verification Code',
        text: `Your verification code is: ${verificationCode}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully.');
    } catch (error) {
        console.error(`Error sending email: ${error}`);
    }
}

