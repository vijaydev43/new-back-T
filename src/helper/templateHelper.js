const templateHelper = new Object();

templateHelper.mailTemplate = async (otp) => {

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Mail Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #F98322;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            margin: 0 0 10px;
        }
        .password {
            display: block;
            background-color: #eee;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        .footer p {
            margin: 0;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>FastX</h1>
        </div>
        <div class="content">
            <p>Dear [Recipient],</p>
            <p>Your password for accessing our service is:</p>
            <span class="password">${otp}</span>
            <p>Please keep this password secure and do not share it with anyone.</p>
        </div>
        <div class="footer">
            <p>If you did not request this password, please contact our support team immediately.</p>
            <p>Thank you, <br> The [Company] Team</p>
        </div>
        <p>We are registered under <span style="font-weight: 600;">ALO INFO-TECH Private LTD.</span></p>
    </div>
</body>
</html>`

}

templateHelper.mailPasswordTemplate = async (password) => {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'>
    <title>Password Email</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f4f3ee;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 500px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #EE4C46;
        }


        .content {
            color:black;
            padding: 20px;
        }

        .otpTime {
            margin: 5px 0px !important;
            color: #333333;
            font-size: 14px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 400;

        }

        .otpTimebottom {
            margin-top: 20px;
            color: #333333;
            font-size: 14px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 400;
        }

        .centerAlign {
            text-align: center;
        }

        .fastxText {
            font-size: 14px;
            color: #F98322;
            margin-top: 5px !important;
        }

        .otp-code {
            display: inline-block;
            background:#fff;
            padding: 10px 30px;
            font-size: 20px;
            color: #F98322;
            border-radius:20px;
            letter-spacing: 4px;
            margin-top: 20px;
            border: 1px dashed #F98322
        }

        .footer {
            text-align: center;
            font-size: 12px;
        }

        .footer a {
            text-decoration: none !important;
        }
         .footer_text p{
         color:black
         }   
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://fastxlivebucket.s3.ap-south-1.amazonaws.com/fastx-logo-center.png" width="100px">
        </div>
        <div class="content">
            <img src="https://fastxlivebucket.s3.ap-south-1.amazonaws.com/emailBanner.png"  width="100%">
            <h3>Hi User,</h3>
            <p class="otpTime">Here is your Password </p>
            <p class="otpTime">Please use this password to log in. After logging in, you may change the password if you wish. </p>
            <div class="centerAlign">
                <div class="otp-code">${password}</div>
            </div>
            <p class="otpTime">Best Regards,</p>
            <p class="fastxText">FastX</p>
        </div>

        <div class="footer">
            <hr>
            <a href="https://www.instagram.com/fastx_nagercoil/" target="_blank">
                <img src="https://fastxlivebucket.s3.ap-south-1.amazonaws.com/email-insta.png"  alt="Instagram" width="24"
                    height="24" style="vertical-align: middle;">
            </a>
            <a href="https://www.facebook.com/profile.php?id=61557927441845&paipv=0&eav=AfamnYPkGikhpFFojrbUaFPNI4g5rtXMv2KgM5qtrijnPEuOtP23iTk59_nNITgzOOA"
                target="_blank">
                <img src="https://fastxlivebucket.s3.ap-south-1.amazonaws.com/email-fb.png" alt="Facebook" width="24"
                    height="24" style="vertical-align: middle;margin-left:10px;">
            </a>
            <hr>
            <div class="footer_text">
                <p>FastX Employees will never request your personal information, such as bank details, passwords, or
                    CVVs. For your safety, don’t share this information via phone, SMS, or email.</p>

                <p>We are registered under <span style="font-weight: 600;">ALO INFO-TECH Private LTD.</span></p>
                <p>&copy;2024 Fastx. All rights reserved.</p>
            </div>
        </div>

    </div>
</body>

</html>
`// HTML content
}

module.exports =templateHelper