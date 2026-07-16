const express = require("express");
const router = express.Router();

const {
    Register,
    Login,
    SendOTP,
    VerifyOTP,
    forgotPassword,
    resetPassword
} = require("../Controller/AuthController");

// const SendMail = require("../Utils/SendMail");

// router.get("/testmail", async (req, res) => {

//     try {

//         await SendMail(
//             "anil15102000@gmail.com", // Replace with your email
//             "SkillSwap Test",
//             "<h1>Hello 👋</h1><p>Your email service is working.</p>"
//         );

//         res.json({
//             success: true,
//             message: "Email Sent Successfully",
//         });

//     } catch (err) {

//         res.status(500).json({
//             success: false,
//             message: err.message,
//         });

//     }

// });

router.post("/register", Register);

router.post("/sendOTP", SendOTP);

router.post("/verifyOTP", VerifyOTP);

router.post("/login", Login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;