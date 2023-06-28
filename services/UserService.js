const bcrypt = require('bcrypt')
const User = require('../models/userModel')
import jwt from 'jsonwebtoken'

const mongoose = require('mongoose')

class UserService {
    async create(firstname, lastname, email, mobile, password) {
        const hash = await bcrypt.hash(password, 8);

        const user = await User.create({
            data: {
                firstname,
                lastname,
                email,
                mobile,
                password: hash,
            },
        });

        return user;
    }

    generateToken(user) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return token;
    }

    async findByEmail(email) {
        const user = await User.findOne({ email });

        return user;
    }

    async checkPassword(password, hash) {
        const passwordMatch = await bcrypt.compare(password, hash);

        return passwordMatch;
    }
}

module.exports = UserService;