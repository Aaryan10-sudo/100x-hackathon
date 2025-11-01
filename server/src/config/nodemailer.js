const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporterInfo = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || undefined,
  service: process.env.SMTP_SERVICE || undefined,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

/**
 * Send email using nodemailer. Returns the send result on success.
 * On SMTP verification failure, when not in production, fall back to Ethereal test account
 * so developers can still see sent messages. Callers should still handle thrown errors.
 * mailInfo: { from, to, subject, text?, html? }
 */
exports.sendEmail = async (mailInfo) => {
  // primary transporter (real SMTP)
  const transporter = nodemailer.createTransport(transporterInfo);

  // verify connection configuration (helps surfacing config errors early)
  try {
    await transporter.verify();
  } catch (err) {
    // verification failed (bad credentials / host unreachable)
    const verifyErr = new Error(`SMTP verify failed: ${err?.message || err}`);

    // If running in non-production, try Ethereal fallback so devs can preview mails
    const allowFallback = process.env.NODE_ENV !== "production";
    if (!allowFallback) {
      throw verifyErr;
    }

    try {
      const testAccount = await nodemailer.createTestAccount();
      const etherealTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      const info = await etherealTransporter.sendMail(mailInfo);
      // attach preview URL so caller / logs can show it
      const preview = nodemailer.getTestMessageUrl(info);
      return Object.assign({}, info, { preview });
    } catch (fallbackErr) {
      // fallback also failed, prefer original verify error message
      verifyErr.message += `; Ethereal fallback failed: ${
        fallbackErr?.message || fallbackErr
      }`;
      throw verifyErr;
    }
  }

  // send mail via primary transporter
  try {
    const info = await transporter.sendMail(mailInfo);
    return info;
  } catch (err) {
    // sending failed after verify succeeded; attempt dev fallback if allowed
    const sendErr = new Error(`sendMail failed: ${err?.message || err}`);
    const allowFallback = process.env.NODE_ENV !== "production";
    if (!allowFallback) throw sendErr;

    try {
      const testAccount = await nodemailer.createTestAccount();
      const etherealTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      const info = await etherealTransporter.sendMail(mailInfo);
      const preview = nodemailer.getTestMessageUrl(info);
      return Object.assign({}, info, { preview });
    } catch (fallbackErr) {
      sendErr.message += `; Ethereal fallback failed: ${
        fallbackErr?.message || fallbackErr
      }`;
      throw sendErr;
    }
  }
};
