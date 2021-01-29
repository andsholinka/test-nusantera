const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
// const auth = require('../middleware/auth');
const Merchant = require('../models/Merchant');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Bucket = require('../models/Bucket');

require('dotenv/config')

var productRouter = express.Router();

productRouter.use(bodyParser.urlencoded({
    extended: false
}));
productRouter.use(bodyParser.json());

// create product (merchant only)
productRouter.post('/add-product', async (req, res) => {

    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });

    jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
        if (err) return res.status(401).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });
        console.log(decoded);
        const merchant = await Merchant.findOne({
            where: {
                merchant_id: decoded.merchant_id
            }
        })

        if (merchant.role == 1) {

            const product = req.body;

            try {
                product.merchant_id = decoded.merchant_id
                const created = await Product.create(product)

                res.status(201).send({
                    status: res.statusCode,
                    message: "product created successfully",
                })

            } catch (err) {
                console.error(err.message);
                res.status(500).json({
                    message: err.message
                });
            }
        } else(
            res.status(401).send({
                status: res.statusCode,
                message: "has no authority",
            })
        )
    });
});

// getAllProducts
productRouter.get('/products', async (req, res) => {
    try {
        const getAllProduct = await Product.findAll({})
        res.json(getAllProduct);
        // console.log(User)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

// getProductById
productRouter.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                product_id: req.params.id
            }
        })
        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

// getProductByCategoty
productRouter.get('/', async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                category_product: req.query.category
            }
        })
        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

// add to bucket (customer only)
productRouter.post('/bucket/:id', async (req, res) => {

    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });

    jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
        if (err) return res.status(401).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });
        // console.log(decoded);
        const customer = await Customer.findOne({
            where: {
                customer_id: decoded.customer_id
            }
        })

        if (customer.role == 0) {

            const bucker = req.body;

            try {
                bucker.product_id = req.params.id

                await Bucket.create(bucker)

                res.status(201).send({
                    status: res.statusCode,
                    message: "add to bucket successfully",
                })


            } catch (err) {
                // console.error(err.message);
                res.status(500).send({
                    status: res.statusCode,
                    message: err.message
                });
            }
        } else(
            res.status(401).send({
                status: res.statusCode,
                message: "has no authority",
            })
        )
    });
});

// process to order (customer only)
productRouter.post('/order/:id', async (req, res) => {

    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    });

    jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
        if (err) return res.status(401).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });
        // console.log(decoded);
        const customer = await Customer.findOne({
            where: {
                customer_id: decoded.customer_id
            }
        })

        if (customer.role == 0) {

            const order = req.body;

            try {
                order.customer_name = customer.name
                order.customer_phone = customer.phone
                order.customer_address = customer.address
                order.bucket_id = req.params.id

                const bucket = await Bucket.findOne({
                    where: {
                        bucket_id: order.bucket_id
                    }
                })

                order.note = bucket.note
                order.qty = bucket.qty

                const product = await Product.findOne({
                    where: {
                        product_id: bucket.product_id
                    }
                })

                const merchant = await Merchant.findOne({
                    where: {
                        merchant_id: product.merchant_id
                    }
                })

                order.store_name = merchant.store_name
                order.merchant_address = merchant.address

                // console.log(merchant.address);

                await Order.create(order)

                res.status(201).send({
                    status: res.statusCode,
                    message: "order created successfully",
                })


            } catch (err) {
                // console.error(err.message);
                res.status(500).send({
                    status: res.statusCode,
                    message: err.message
                });
            }
        } else(
            res.status(401).send({
                status: res.statusCode,
                message: "has no authority",
            })
        )
    });
});

module.exports = productRouter;