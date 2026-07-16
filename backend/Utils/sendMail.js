const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function SendMail(email, subject, html) {
    try {

        await transporter.sendMail({
            from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html,
        });

        console.log("✅ Email Sent Successfully");

    } catch (err) {

        console.log("❌ Email Error:", err.message);
        throw err;

    }
}

module.exports = SendMail;