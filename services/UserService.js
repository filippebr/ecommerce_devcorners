const bcrypt = require('bcrypt')
const User = require('../models/User')
import jwt from 'jsonwebtoken'

const mongoose = require('mongoose')

class UserService {
    async create(name, email, password) {
        const hash = await bcrypt.hash(password, 8);

        const user = await mongoose.users.create({
            data: {
                name,
                email,
                password: hash,
            },
        });

        return user;
    }

    generateToken(user) {
        const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
            expiresIn: '7d',
        });

        return token;
    }

    async findByEmail(email) {
        const user = await prisma.users.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    async checkPassword(password, hash) {
        const passwordMatch = await bcrypt.compare(password, hash);

        return passwordMatch;
    }
}

module.exports = UserService;