

const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dukmongonshagai@gmail.com',
         pass: 'fqpprdhbwvogsgku'
    }
});

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Register User and Send OTP
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Хэрэглэгч аль хэдийн бүртгэгдсэн байна' });

        // if (!email || !email.trim().toLowerCase().endsWith("@muls.edu.mn")) {
        //     return res.status(400).json({ message: 'Зөвхөн сургуулийн и-мэйл хаяг ашиглана уу!' });
        // }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user = new User({ name, email, password, otp, otpExpiry });
        await user.save();

        await transporter.sendMail({
            from: 'dukmongonshagai@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Нууц үг: ${otp}`
        });

        res.status(201).json({ message: 'Хэрэглэгч бүртгэгдсэн. И-мэйлдээ OTP-г илгээгдлээ.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Хэрэглэгчийг бүртгэхэд алдаа гарлаа' });
    }
};


// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Хэрэглэгч олдсонгүй' });
        if (user.isVerified) return res.status(400).json({ message: 'Хэрэглэгч аль хэдийн баталгаажсан байна' });

        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP буруу эсвэл хугацаа нь дууссан байна' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ message: 'И-мэйл амжилттай баталгаажлаа. Одоо нэвтэрч болно.' });
    } catch (error) {
        res.status(500).json({ message: 'OTP-г баталгаажуулахад алдаа гарлаа', error });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Хэрэглэгч олдсонгүй' });
        if (user.isVerified) return res.status(400).json({ message: 'Хэрэглэгч бүртгэгдсэн байна' });

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await transporter.sendMail({
            from: 'dukmongonshagai@gmail.com',
            to: email,
            subject: 'OTP баталгаажуулах',
            text: `Нууц үг: ${otp}`
        });

        res.json({ message: 'OTP амжилттай дахин илгээгдлээ.' });
    } catch (error) {
        res.status(500).json({ message: 'OTP-г баталгаажуулахад алдаа гарлаа', error });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Хэрэглэгч олдсонгүй' });
        if (user.password !== password) return res.status(400).json({ message: 'Нууц үг буруу байна' });

        if (!user.isVerified) {
            return res.status(400).json({ message: 'И-мэйл баталгаажаагүй байна. OTP-г баталгаажуулна уу.' });
        }

        req.session.user = { id: user._id, email: user.email, name: user.name };
        res.json({ message: 'Нэвтэрсэн' });
    } catch (error) {
        res.status(500).json({ message: 'Нэвтэрхэд алдаа гарлаа', error });
    }
};

// Logout User
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Нэвтэрэхэд алдаа гарлаа' });
        res.json({ message: 'Нэвтрсэн' });
    });
};

// Dashboard (Protected Route)
exports.dashboard = async (req, res) => {
    res.json({ message: `Тавтай морилно уу, ${req.session.user.name}` });
};
 