const express = require("express");
const cors = require("cors");
const hbs = require('hbs')
const path = require('path')

const port = process.env.PORT;
require("./db/mongoose");
const adminsRouter = require("./routers/adminsRouter");
const usersRouter = require("./routers/usersRouter");
const booksRouter = require("./routers/booksRouter");
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../views');

const app = express();

app.set('view engine', 'hbs');
app.set('views', viewPath);

app.use(cors());
app.use(express.json());
app.use(express.static(publicDirectoryPath))
app.use(adminsRouter);
app.use(usersRouter);
app.use(booksRouter);

app.all("*", (req, res) => {
    res.status(400).render('error-page');
})

app.listen(port, () => {
    console.log("-> server has been connected successfully to port:", port, "!");
});