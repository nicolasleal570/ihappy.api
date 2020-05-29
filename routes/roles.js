const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// @desc    Get all role
// @route   GET /api/roles/
// @access  Public
router.get('/', async (req, res) => {
    try {

        const roles = await Role.find();

        return res.status(200).json({
            success: true,
            data: roles
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }

});

// @desc    Create new role
// @route   POST /api/roles/create
// @access  Public
router.post('/', async (req, res) => {
    try {

        const {
            public_name,
            identification
        } = req.body

        const role = await Role.create({
            public_name,
            identification
        });

        return res.status(200).json({
            success: true,
            data: role
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
                error: 'Server Error'
            });
        }
    }

});

module.exports = router;