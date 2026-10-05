import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {

    try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
      
      const info = await transporter.sendMail({
        from: '"Okshor" <team@okshor.com>',
        to: user.email, 
         subject: "Verify your Okshor email address", 
        text: `Welcome to Okshor!

Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire soon. If you didn't create an Okshor account, you can safely ignore this email.

— The Okshor Team`, 
        html: ` <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your email - Okshor</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f7f6;
        font-family: Arial, Helvetica, sans-serif;
        color: #333333;
      ">
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="padding: 40px 20px;"
        >
          <tr>
            <td align="center">

              <!-- Main Container -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width: 560px;
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                "
              >

                <!-- Header -->
                <tr>
                  <td
                    align="center"
                    style="
                      background-color: #12544F;
                      padding: 28px 20px;
                    "
                  >
                    <h1 style="
                      margin: 0;
                      color: #ffffff;
                      font-size: 28px;
                      letter-spacing: 1px;
                    ">
                      Okshor
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 35px;">

                    <h2 style="
                      margin: 0 0 16px;
                      color: #12544F;
                      font-size: 24px;
                    ">
                      Verify your email
                    </h2>

                    <p style="
                      margin: 0 0 16px;
                      font-size: 16px;
                      line-height: 1.6;
                    ">
                      Welcome to <strong>Okshor</strong>!
                    </p>

                    <p style="
                      margin: 0 0 28px;
                      font-size: 15px;
                      line-height: 1.7;
                      color: #555555;
                    ">
                      Thanks for creating an account with us.
                      Please verify your email address to activate your
                      account and get started.
                    </p>

                    <!-- Button -->
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      style="margin: 0 auto 30px;"
                    >
                      <tr>
                        <td
                          align="center"
                          style="
                            background-color: #12544F;
                            border-radius: 8px;
                          "
                        >
                          <a
                            href="${verificationUrl}"
                            style="
                              display: inline-block;
                              padding: 14px 28px;
                              color: #ffffff;
                              text-decoration: none;
                              font-size: 15px;
                              font-weight: bold;
                            "
                          >
                            Verify My Email
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="
                      margin: 0 0 10px;
                      font-size: 13px;
                      line-height: 1.6;
                      color: #777777;
                    ">
                      If the button doesn't work, copy and paste the
                      following link into your browser:
                    </p>

                    <p style="
                      margin: 0 0 25px;
                      font-size: 12px;
                      line-height: 1.6;
                      word-break: break-all;
                    ">
                      <a
                        href="${verificationUrl}"
                        style="color: #12544F;"
                      >
                        ${verificationUrl}
                      </a>
                    </p>

                    <p style="
                      margin: 0;
                      font-size: 13px;
                      line-height: 1.6;
                      color: #888888;
                    ">
                      If you didn't create an Okshor account, you can
                      safely ignore this email.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    align="center"
                    style="
                      background-color: #f8faf9;
                      padding: 22px;
                      border-top: 1px solid #eeeeee;
                    "
                  >
                    <p style="
                      margin: 0;
                      font-size: 12px;
                      color: #999999;
                    ">
                      © ${new Date().getFullYear()} Okshor. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>`
      });

      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
    }
    },
  },
});
