// controllers/userController.js
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, number, subject, message } = req.body;
        const user = await User.create({ name, email, number, subject, message });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
