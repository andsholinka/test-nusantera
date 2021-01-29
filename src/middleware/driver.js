const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');
const Token = require('../models/Token');
require('dotenv/config')

var driverRouter = express.Router();

driverRouter.use(bodyParser.urlencoded({
    extended: false
}));
driverRouter.use(bodyParser.json());

// Register 
driverRouter.post('/register', async (req, res) => {

    try {
        const driver = req.body;
        const saltRounds = 10;
        const hashedPw = await bcrypt.hash(driver.password, saltRounds);

        const emailDuplicate = await Driver.findOne({
            where: {
                email: driver.email
            }
        })

        if (emailDuplicate) {
            res.status(400).json({
                status: res.statusCode,
                message: 'This email already exist'
            });
        } else {

            driver.password = hashedPw
            const created = await Driver.create(driver)

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
driverRouter.post('/login', async (req, res) => {

    try {
        // if username exist
        const driver = await Driver.findOne({
            where: {
                email: req.body.email
            }
        })
        if (!driver) return res.status(400).json({
            status: res.statusCode,
            message: 'Email Anda Salah!'
        })

        // check password
        const validPwd = await bcrypt.compare(req.body.password, driver.password)
        if (!validPwd) return res.status(400).json({
            status: res.statusCode,
            message: 'Password Anda Salah!'
        })

        // token
        const token = jwt.sign({
            driver_id: driver.driver_id
        }, process.env.SECRET_KEY, {
            expiresIn: 86400
        });
        const tokenData = {
            token: token,
            driver_id: driver.driver_id,
        };

        Token.update({
                driver_id: driver.driver_id,
                token: token
            }, {
                where: {
                    driver_id: driver.driver_id
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
driverRouter.post('/logout', async (req, res) => {

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
                        driver_id: data.driver_id
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

module.exports = driverRouter;