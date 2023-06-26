const bcrypt = require('bcrypt')
const User = require('../models/User')
import jwt from 'jsonwebtoken'

const mongoose = require('mongoose')

class UserService {
    async create(name, email, password) {
        const hash = await bcrypt.hash(password, 8);

        const user = await User.create({
            data: {
                name,
                email,
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