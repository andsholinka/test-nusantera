const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Customer = require('../models/Customer');

var userRouter = express.Router();

userRouter.use(bodyParser.urlencoded({
    extended: false
}));
userRouter.use(bodyParser.json());

// getAllCustomers
userRouter.get('/', async (req, res) => {
    try {
        const getAllUser = await Customer.findAll({})
        res.json(getAllUser);
        // console.log(User)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

// getCustomerById
userRouter.get('/:id', async (req, res) => {
    try {
        const user = await Customer.findOne({
            where: {
                customer_id: req.params.id
            }
        })
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

// updateById
userRouter.put('/:id', async (req, res) => {
    try {
        const {
            email,
            name,
            password
        } = req.body;

        const id = req.params.id

        const saltRounds = 10;
        const hashedPw = await bcrypt.hash(password, saltRounds);

        await Customer.update({
            email: email,
            name: name,
            password: hashedPw
        }, {
            where: {
                customer_id: id
            }
        })

        res.status(200).json({
            status: res.statusCode,
            message: 'Berhasil Mengubah Data'
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

// deleteById
userRouter.delete('/:id', async (req, res) => {
    try {
        await Customer.destroy({
            where: {
                customer_id: req.params.id
            }
        })

        res.status(200).json({
            status: res.statusCode,
            message: 'Berhasil Mengapus Data'
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = userRouter;