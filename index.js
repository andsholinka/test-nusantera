const express = require('express');
const app = express();
const db = require("./src/config/db");
const authRouter = require('./src/middleware/auth')

require('dotenv/config')

app.use(express.urlencoded({
    extended: true
}));

app.use('/api/v1/', authRouter);

db.authenticate().then(() => console.log("Connection to db success"));

app.listen(process.env.PORT, () => {
    console.log(`App listens to port ${process.env.PORT}`);
});