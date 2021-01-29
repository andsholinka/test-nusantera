const express = require('express');
const app = express();
const db = require("./src/config/db");
const adminRouter = require('./src/controllers/adminController')
const customerRouter = require('./src/middleware/customer')
const merchantRouter = require('./src/middleware/merchant')
const driverRouter = require('./src/middleware/driver')
const productRouter = require('./src/controllers/productController')
const orderRouter = require('./src/controllers/orderController')

require('dotenv/config')

app.use(express.urlencoded({
    extended: true
}));

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/customer', customerRouter);
app.use('/api/v1/merchant', merchantRouter);
app.use('/api/v1/driver', driverRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/order', orderRouter);

db.authenticate().then(() => console.log("Connection to db success"));

app.listen(process.env.PORT, () => {
    console.log(`App listens to port ${process.env.PORT}`);
});