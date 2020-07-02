const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const createToken = require("../utils/services");
const { initSession } = require("../utils/utils");

const isLoggedIn = require('../utils/verifyProtectedRoutes');

// @desc    Register new user
// @route   POST /api/auth/register/
// @access  Public
router.post("/register", async (req, res) => {
  try {
    // Destructuring de lo que manda el usuario
    const { email, username, password, passwordConfirm, role } = req.body;

    if (password.trim() !== passwordConfirm.trim()) {
      return res.status(400).json({
        success: false,
        error: "Passwords must match",
      });
    }

    // Hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    let userExist = await User.findOne({ email });

    if (userExist) {
      userExist = null;
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    userExist = await User.findOne({ username });

    if (userExist) {
      userExist = null;
      return res
        .status(400)
        .json({ success: false, error: "Username already exists" });
    }

    let user = await User.create({
      email,
      username,
      password: hashPassword,
      role,
    });

    user = await User.findById(user._id).populate("role");

    const session = await initSession(user._id);

    // Create JWT a token
    // const token = createToken(user);

    // Send a new token to the client (frontend)
    return res
      .cookie("token", session.token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1209600000,
        secure: false,
      })
      .status(200)
      .json({
        success: true,
        token: session.token,
        user,
      });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error " + err,
      });
    }
  }
});

// @desc    Register new user
// @route   POST /api/users/login/
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate if user exists
    const user = await User.findOne({ email: email }).populate("role");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "User doesn't exists" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid password" });
    }

    // Create JWT a token
    const session = await initSession(user._id);
    // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    // const token = createToken(user);

    // Send a new token to the client (frontend)
    return res
      .cookie("token", session.token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1209600000,
        secure: false,
      })
      .status(200)
      .json({
        success: true,
        token: session.token,
        user,
      });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error " + err,
      });
    }
  }
});

// @desc    Get the authenticated user
// @route   GET /api/auth/me/
// @access  Private
router.get("/me", isLoggedIn, async (req, res) => {
  try {
    const requestedUserID = req.user;
    const user = await User.findById(requestedUserID).populate("role");

    res.status(200).json({
        success: true,
        data: user
      });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
});

// @desc    Logout user
// @route   PUT /api/auth/logout/
// @access  Private
router.put("/logout", isLoggedIn, async (req, res) => {
    try {
        const { session } = req;
        await session.expireToken(session.token);
        res.clearCookie('token');

        return res.status(200).json({
            success: true,
            data: 'Successfuly expired login session'
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Something went wrong during the logout process.'
        })
    }
});

module.exports = router;
