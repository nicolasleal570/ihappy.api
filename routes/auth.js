const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const createToken = require('../utils/services');

// @desc    Register new user
// @route   POST /api/auth/register/
// @access  Public
router.post('/register', async (req, res) => {
    try {
        // Destructuring de lo que manda el usuario
        const {
            email,
            username,
            password,
            passwordConfirm,
            role
        } = req.body

        if (password.trim() !== passwordConfirm.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Passwords must match'
            });
        }

        // Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const emailExist = await User.findOne({ email: email });
        if (emailExist) {
            return res.status(400).json({ success: false, data: "Email already exists" })
        }

        const user = await User.create({
            email,
            username,
            password: hashPassword,
            role
        });

        // Create JWT a token
        const token = createToken(user);

        // Send a new token to the client (frontend)
        return res.status(200).json({
            success: true,
            token,
            user
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error ' + err
            });
        }
    }

});

// @desc    Register new user
// @route   POST /api/users/login/
// @access  Public
router.post('/login', async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body

        // Validate if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, error: "User doesn't exists" })
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, error: "Invalid password" });
        }

        // Create JWT a token
        // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        const token = createToken(user);

        // Send a new token to the client (frontend)
        return res.status(200).json({
            success: true,
            token,
            user
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error ' + err
            });
        }
    }
});

module.exports = router;