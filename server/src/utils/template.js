
const emailVerificationHtml = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Email Verification</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
                }
                .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                color: #333;
                text-align: center;
                }
                p {
                line-height: 1.5;
                color: #555;
                }
                .otp {
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                padding: 10px;
                background-color: #f4f4f4;
                border-radius: 5px;
                }
                span {
                    font-weight: bold;
                    color: white;
                }
                .expire {
                color: #999;
                font-size: 12px;
                text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Email Verification</h1>
                <p>Dear User,</p>
                <p>Thank you for registering to <span>Charity Compass</span>. To complete the verification process, please use the following One-Time Password (OTP):</p>
                <div class="otp">${otp}</div>
                <p>This OTP is valid for 5 minutes. Please enter the OTP in the verification form on our website.</p>
                <p class="expire">This OTP will expire after 5 minutes.</p>
                <p>If you did not initiate this verification request, please ignore this email.</p>
                <p>Thank you for choosing our service.</p>
                <p>Best regards,<br><span>Charity Compass</span></p>
            </div>
        </body>
    </html>`
}

const donationHtml = (amount, charityName, donorName) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for your Charity Donation</title>
      <style>
        /* Add some basic styling */
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
          text-align: center;
          margin-top: 0;
        }
        p {
          color: #555;
          line-height: 1.5;
        }
        .button {
          display: inline-block;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Thank you for your Charity Donation!</h1>
        <p>Dear ${donorName},</p>
        <p>We are truly grateful for your recent donation of ₹${amount} to our charity listed on our website. Your generosity and support make a meaningful difference in the lives of those we serve.</p>
        <p>Your contribution helps us continue our mission of ${charityName} and provides vital resources to those in need.</p>
        <p>As we move forward, we hope you will consider supporting our work further.</p>
        <p>Together, we can create a brighter future for all. Thank you again for your generous donation. We are deeply appreciative of your support.</p>
        <a href="[Charity Website URL]" class="button">Donate Again</a>
      </div>
    </body>
    </html>`
}

module.exports = { emailVerificationHtml, donationHtml };