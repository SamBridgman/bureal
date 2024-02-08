
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
    database.find({}).sort({ Time: -1 }).exec(function (err, data) {
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
app.post('/sendData', (request,response) => {
    database.insert(request.body);
        response.json({
            status:"success",
            message: "code is verified"
        });
});
app.post('/submitComment', (request,response) => {
    database.update({ _id: request.body.commentKey}, { $push: { comments:request.body.comment} }, {}, function () {
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
        service: 'gmail',
        auth: {
            user: 'bridgmansam03@gmail.com',
            pass: 'lkex giss ajva eyex',
        },
    });
    console.log("inside sendverify",receiverEmail);
    const mailOptions = {
        from: 'bridgmansam03@gmail.com',
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

