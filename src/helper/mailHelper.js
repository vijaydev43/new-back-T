const nodemailer = require("nodemailer");
const fs = require("fs");
const mailHelper = new Object();



mailHelper.sendMailForUserVerification = async (email, subject, template) => {
  let config = {
    service: "gmail",
    auth: {
      user: process?.env?.SENDER_EMAIL ? process.env.SENDER_EMAIL : 'tiftoorganicgroceries@gmail.com',
      pass: process?.env?.SENDER_EMAIL_PASSWORD ? process.env.SENDER_EMAIL_PASSWORD : 'vmpx abvp armx wrzb'
    }
  }

  let transporter = nodemailer.createTransport(config);

  let message = {
    from: process?.env?.SENDER_EMAIL ? process.env.SENDER_EMAIL : 'leninsalogroups@gmail.com',
    to: `${email}`,
    subject: `${subject}`,
    html: `${template}`
  }
  transporter.sendMail(message).then(() => {
    console.log("Sucess");
  }).catch(err => {
    console.log("Failed");
  })
}

mailHelper.sendInvoiceMail = async (email, file) => {
  const pdfFilePath = `${file?.path}`;
  const pdfData = fs.readFileSync(pdfFilePath);
  let config = {
    service: "gmail",
    auth: {
      user: process?.env?.SENDER_EMAIL ? process.env.SENDER_EMAIL : 'leninsalogroups@gmail.com',
      pass: process?.env?.SENDER_EMAIL_PASSWORD ? process.env.SENDER_EMAIL_PASSWORD : 'ghht womz dfjr qzyj'
    }
  }
  let transporter = nodemailer.createTransport(config);
  let message = {
    from: process?.env?.SENDER_EMAIL ? process.env.SENDER_EMAIL : 'leninsalogroups@gmail.com',
    to: `${email}`,
    subject: `Invoice from Fast-X`,
    attachments: [
      {
        filename: `${file?.filename}`,
        content: pdfData,
      },
    ],
  }
  transporter.sendMail(message).then(() => {
    fs.unlink(pdfFilePath, (error) => {
      console.log("yyyyyyyyyyy",pdfFilePath)
      if (error) {
        console.error('Error deleting file:', error);
      } else {
        console.log('File deleted successfully');
      }
    })
    return true;
  }).catch(err => {
    console.log("Failed");
    return false;
  })
}

mailHelper.sendEmailWithAttachment = async (toEmail, attachmentPath, subject, invoiceNo) => {
  try {
    let config = {
      service: "gmail",
      auth: { 
        user: process?.env?.SENDER_EMAIL ? process.env.SENDER_EMAIL : 'leninsalogroups@gmail.com',
        pass: process?.env?.SENDER_EMAIL_PASSWORD ? process.env.SENDER_EMAIL_PASSWORD : 'ghht womz dfjr qzyj'
      },
    };

    let transporter = nodemailer.createTransport(config);

    let message = {
      from: process?.env?.SENDER_EMAIL ? process.env.SENDER_EMAIL :  'leninsalogroups@gmail.com',
      to: toEmail,
      subject: `${subject}`,
      html: `<p><strong>Dear Customer,</strong></p>
      <p style="text-indent:20px">Thank you for choosing our service, your invoice can be viewed,printed and downloaded as PDF from below</p>`,
      attachments: [
        {
          filename: `FAST-X_${invoiceNo}.pdf`,
          path: attachmentPath,
          encoding: "base64",
        },
      ],
    };
    await transporter.sendMail(message);
    console.log("Success");

    // fs.unlinkSync(attachmentPath);

    return { success: true, message: "Email sent successfully" };
  } catch (err) {
    console.error("Failed to send email:", err);
    return { success: false, message: "Failed to send email" };
  }
};
module.exports = mailHelper;