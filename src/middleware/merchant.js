const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');
const Token = require('../models/Token');
require('dotenv/config')

const {
    merchantRegisterValidation,
    loginValidation
} = require('../config/validation');

var merchantRouter = express.Router();

merchantRouter.use(bodyParser.urlencoded({
    extended: false
}));
merchantRouter.use(bodyParser.json());

// Register 
merchantRouter.post('/register', async (req, res) => {

    const {
        error
    } = merchantRegisterValidation(req.body)
    if (error) return res.status(400).json({
        status: res.statusCode,
        message: error.details[0].message
    })

    try {
        const merchant = req.body;
        const saltRounds = 10;
        const hashedPw = await bcrypt.hash(merchant.password, saltRounds);

        const emailDuplicate = await Merchant.findOne({
            where: {
                email: merchant.email
            }
        })

        if (emailDuplicate) {
            res.status(400).json({
                status: res.statusCode,
                message: 'This email already exist'
            });
        } else {
            merchant.password = hashedPw
            const created = await Merchant.create(merchant)

            res.status(201).json(created)

        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

// Login 
merchantRouter.post('/login', async (req, res) => {

    const {
        error
    } = loginValidation(req.body)
    if (error) return res.status(400).json({
        status: res.statusCode,
        message: error.details[0].message
    })

    try {
        // if email exist
        const merchant = await Merchant.findOne({
            where: {
                email: req.body.email
            }
        })
        if (!merchant) return res.status(400).json({
            status: res.statusCode,
            message: 'Email Anda Salah!'
        })

        // check password
        const validPwd = await bcrypt.compare(req.body.password, merchant.password)
        if (!validPwd) return res.status(400).json({
            status: res.statusCode,
            message: 'Password Anda Salah!'
        })

        // token
        const token = jwt.sign({
            merchant_id: merchant.merchant_id
        }, process.env.SECRET_KEY, {
            expiresIn: 86400
        });
        const tokenData = {
            token: token,
            merchant_id: merchant.merchant_id,
        };

        Token.update({
                merchant_id: merchant.merchant_id,
                token: token
            }, {
                where: {
                    merchant_id: merchant.merchant_id
                }
            })
            .then(data => {
                if (data[0] !== 0) {
                    res.status(200).send({
                        status: res.statusCode,
                        message: "Update Token",
                        token: token
                    });
                } else {
                    Token.create(tokenData)
                        .then(datatoken => {
                            res.status(201).send({
                                status: res.statusCode,
                                message: "Created Token",
                                token: datatoken.token
                            });
                        })
                }
            })
            .catch((error) => res.status(400).send(error));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

// Logout
merchantRouter.post('/logout', async (req, res) => {

    try {
        const dataToken = req.headers['authorization']
        if (!dataToken) return res.status(401).send({
            status: res.statusCode,
            message: 'No token provided.'
        });

        await Token.findOne({
            where: {
                token: dataToken
            }
        }).then(data => {
            if (data[0] === 0) {
                res.status(401).send({
                    status: res.statusCode,
                    message: "Failed to authenticate token",
                });
            } else {
                Token.destroy({
                    where: {
                        merchant_id: data.merchant_id
                    }
                }).then(() => {
                    res.send({
                        status: res.statusCode,
                        message: "User Logout Successfully",
                    })
                })
            }
        }).catch((error) => res.status(401).send({
            status: res.statusCode,
            message: "Failed to authenticate token"
        }));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = merchantRouter;