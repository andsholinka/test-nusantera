const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Token = require('../models/Token');
require('dotenv/config')

const {
    registerValidation,
    loginValidation
} = require('../config/validation');
const {
    custom
} = require('@hapi/joi');

var customerRouter = express.Router();

customerRouter.use(bodyParser.urlencoded({
    extended: false
}));
customerRouter.use(bodyParser.json());

// Register 
customerRouter.post('/register', async (req, res) => {

    try {
        const customer = req.body;
        const saltRounds = 10;
        const hashedPw = await bcrypt.hash(customer.password, saltRounds);

        const emailDuplicate = await Customer.findOne({
            where: {
                email: customer.email
            }
        })

        if (emailDuplicate) {
            res.status(400).json({
                status: res.statusCode,
                message: 'This email already exist'
            });
        } else {

            customer.password = hashedPw
            const created = await Customer.create(customer)

            res.status(201).send({
                status: res.statusCode,
                message: "account created successfully",
            })
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

// Login 
customerRouter.post('/login', async (req, res) => {

    const {
        error
    } = loginValidation(req.body)
    if (error) return res.status(400).json({
        status: res.statusCode,
        message: error.details[0].message
    })

    try {
        // if username exist
        const customer = await Customer.findOne({
            where: {
                email: req.body.email
            }
        })
        if (!customer) return res.status(400).json({
            status: res.statusCode,
            message: 'Email Anda Salah!'
        })

        // check password
        const validPwd = await bcrypt.compare(req.body.password, customer.password)
        if (!validPwd) return res.status(400).json({
            status: res.statusCode,
            message: 'Password Anda Salah!'
        })

        // token
        const token = jwt.sign({
            customer_id: customer.customer_id
        }, process.env.SECRET_KEY, {
            expiresIn: 86400
        });
        const tokenData = {
            token: token,
            customer_id: customer.customer_id,
        };

        Token.update({
                customer_id: customer.customer_id,
                token: token
            }, {
                where: {
                    customer_id: customer.customer_id
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
customerRouter.post('/logout', async (req, res) => {

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
                        customer_id: data.customer_id
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

module.exports = customerRouter;