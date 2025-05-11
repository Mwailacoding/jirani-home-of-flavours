// EmailTemplates.jsx
import React from 'react';

const ResetPasswordEmail = ({ resetLink }) => {
  return (
    <html>
      <head>
        <style>
          {`
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #6c63ff;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              margin: 15px 0;
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          
          <a href={resetLink} className="button">
            Reset Password
          </a>
          
          <p>If you didn't request this, please ignore this email. This link will expire in 1 hour.</p>
          <p>Thanks,Your App Team</p>
        </div>
      </body>
    </html>
  );
};

export default ResetPasswordEmail;