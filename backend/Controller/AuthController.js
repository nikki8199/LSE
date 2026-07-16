const User = require("../Model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OtpModel = require("../Model/OtpModel");
const GenerateOTP = require("../Utils/GenerateOtp");
const SendMail = require("../Utils/sendMail");

async function Register(req, res) {
    try {

        let body = req.body;

        let user = await User.findOne({ email: body.email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        let hashPassword = await bcrypt.hash(body.password, 10);

        let newUser = await User.create({
            name: body.name,
            email: body.email,
            password: hashPassword,
            skillsOffered: body.skillsOffered || [],
            skillsNeeded: body.skillsNeeded || []
        });

        let token = jwt.sign(
            {
                userId: newUser._id,
                role: newUser.role
            },
            process.env.JWT_SECRET || "fallback_secret_key",
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            token,
            user: newUser
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
}

async function Login(req, res) {

    try {

        let body = req.body;

        let user = await User.findOne({ email: body.email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

        let checkPassword = await bcrypt.compare(body.password, user.password);

        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });
        }

        let token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET || "fallback_secret_key",
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

async function SendOTP(req, res) {

    try {

        let body = req.body;

        let user = await User.findOne({
            email: body.email
        });

        if (user) {

            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });

        }

        let otp = GenerateOTP();

        await OtpModel.deleteMany({
            email: body.email
        });

        await OtpModel.create({

            email: body.email,

            otp,

            userData: {

                name: body.name,

                email: body.email,

                password: await bcrypt.hash(body.password, 10),

                skillsOffered: body.skillsOffered || [],

                skillsNeeded: body.skillsNeeded || []

            },

            expiresAt: new Date(Date.now() + 30 * 60 * 1000)

        });

        await SendMail(

            body.email,

            "SkillSwap Email Verification",

            `
            <h2>Welcome to SkillSwap</h2>

            <p>Your OTP is</p>

            <h1>${otp}</h1>

            <p>This OTP is valid for 5 minutes.</p>
            `

        );

        return res.status(200).json({

            success: true,

            message: "OTP Sent Successfully"

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

async function VerifyOTP(req, res) {

    try {

        let { email, otp } = req.body;

        let otpData = await OtpModel.findOne({ email });

        if (!otpData) {

            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });

        }

        console.log("OTP Expires At :", otpData.expiresAt);
        console.log("Current Time   :", new Date());

        if (otpData.expiresAt < new Date()) {

            await OtpModel.deleteOne({ _id: otpData._id });

            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            });

        }

        if (otpData.otp !== otp) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });

        }

        const data = otpData.userData;



        const newUser = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            skillsOffered: data.skillsOffered,
            skillsNeeded: data.skillsNeeded,
            isVerified: true
        });

        const token = jwt.sign(
            {
                userId: newUser._id,
                role: newUser.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            bio: newUser.bio,
            skillsOffered: newUser.skillsOffered,
            skillsNeeded: newUser.skillsNeeded,
            isVerified: newUser.isVerified,
            createdAt: newUser.createdAt
        };

        await OtpModel.deleteOne({ _id: otpData._id });

        return res.status(201).json({
            success: true,
            message: "Registration Successful",
            token,
            user: userResponse
        });
    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email does not exist"
            });
        }

        const otp = GenerateOTP();

        await OtpModel.deleteMany({ email });

        await OtpModel.create({
            email,
            otp,
            userData: {},
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        });

        await SendMail(
            email,
            "SkillSwap Password Reset Verification",
            `
            <h2>Password Reset Code</h2>
            <p>Your OTP for resetting your password is</p>
            <h1>${otp}</h1>
            <p>This code is valid for 15 minutes.</p>
            `
        );

        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const otpData = await OtpModel.findOne({ email });

        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: "Verification code not found or expired"
            });
        }

        if (otpData.expiresAt < new Date()) {
            await OtpModel.deleteOne({ _id: otpData._id });
            return res.status(400).json({
                success: false,
                message: "Verification code expired"
            });
        }

        if (otpData.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code"
            });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        await User.findOneAndUpdate({ email }, { password: hashPassword });

        await OtpModel.deleteOne({ _id: otpData._id });

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now login."
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    Register,
    Login,
    SendOTP,
    VerifyOTP,
    forgotPassword,
    resetPassword
};