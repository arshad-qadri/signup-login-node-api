const nodeMailer = require("nodemailer");

exports.mail = (email, subjectname, link) => {
  var transport = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "arshadqadri321@gmail.com",
      pass: "qadri786",
    },
  });

  var mailOption = {
    from: "arshadqadri321@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    text: link,
  };
  transport.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent" + info.response);
    }
  });
};
