const express = require('express');
const app = express();
const db = require("./src/config/db");
const authRouter = require('./src/middleware/auth')
const merchantRouter = require('./src/middleware/merchant')
const userRouter = require('./src/controllers/customerController')

require('dotenv/config')

app.use(express.urlencoded({
    extended: true
}));

app.use('/api/v1/', authRouter);
app.use('/api/v1/merchant', merchantRouter);
app.use('/api/v1/customer', userRouter);

db.authenticate().then(() => console.log("Connection to db success"));

app.listen(process.env.PORT, () => {
    console.log(`App listens to port ${process.env.PORT}`);
});