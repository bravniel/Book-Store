const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require('../models/userModel');
const Book = require('../models/bookModel');

const router = new express.Router();

router.get('', async (req, res) => {
    try {
        res.render('render-to-home-page');
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.post('/users', async (req, res) => {
    const info = req.body;
    try {
        const user = new User(info);
        if (!info.name)
            return res.status(400).send({ Error: 'Name required' });
        if (!info.email)
            return res.status(400).send({ Error: 'Email required' });
        if (!info.password)
            return res.status(400).send({ Error: 'Password required' });
        const duplicateUser = await User.findOne({ email: info.email });
        if (duplicateUser)
            return res.status(400).send({ Error: 'Email exists in the system, Email is unique' });
        await user.save();
        const token = await user.generateAuthToken();
        res.send({ user, token, name: user.name });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.get('/users/connected-user-info', userAuth, async (req, res) => {
    const user = req.user
    try {
        res.send({ name: user.name, email: user.email, password: user.password });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.patch('/users', userAuth, async (req, res) => {
    const user = req.user
    const updateUser = req.body;
    try {
        if (updateUser.name) {
            if (updateUser.name.length < 2)
                return res.status(400).send({ Error: 'Name is too short' });
            user.name = updateUser.name;
        }
        if (updateUser.email) {
            const duplicateUser = await User.findOne({ email: updateUser.email });
            if (duplicateUser)
                return res.status(400).send({ Error: 'Duplicate user email' });
            user.email = updateUser.email;
        }
        if (updateUser.password) {
            if (updateUser.password.length < 6)
                return res.status(400).send({ Error: 'Password is too short' });
            if (!updateUser.repeatPassword)
                return res.status(400).send({ Error: 'Repeat Password required!' });
            if (updateUser.repeatPassword !== updateUser.password)
                return res.status(400).send({ Error: 'Password is not equals to Repeat Password' });
            user.password = updateUser.password;
        }
        await user.save();
        res.send({ user });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
})

router.post('/users/login', async (req, res) => {
    const loginInfo = req.body;
    try {
        if (!loginInfo.email)
            return res.status(400).send({ Error: 'Email required' });
        if (!loginInfo.password)
            return res.status(400).send({ Error: 'Password required' });
        const user = await User.findUserbyEmailAndPassword(loginInfo.email, loginInfo.password);
        const token = await user.generateAuthToken();
        res.send({ token, user, name: user.name });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.post('/users/logout', userAuth, async (req, res) => {
    const user = req.user
    try {
        user.tokens = user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token);
        await user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.delete("/users", userAuth, async (req, res) => {
    try {
        await req.user.remove()
        res.send();
    } catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.get('/users/cart', userAuth, async (req, res) => {
    const user = req.user
    try {
        await user.populate('cart.book');
        let books = [];
        for (let i = 0; i < user.cart.length; i++) {
            books.push({ book: user.cart[i].book.name, quantity: user.cart[i].quantity })
        }
        if (books.length === 0) {
            return res.status(400).send({ Error: "No books in cart" });
        }
        res.send(books);
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.post('/users/cart/:id', userAuth, async (req, res) => {
    const bookName = req.params.id;
    console.log(bookName)
    const user = req.user
    console.log(user.cart)
    const num = req.body.num;
    console.log(num)
    try {
        const book = await Book.findOne({ name: bookName });
        await user.addBookToCart(book._id, num)
        res.send(user.cart);
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.delete('/users/cart/:id', userAuth, async (req, res) => {
    const bookName = req.params.id;
    const user = req.user
    const num = req.body.num;
    try {
        const book = await Book.findOne({ name: bookName });
        await user.removeBookFromCart(book._id, num)
        res.send(user.cart);
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.delete('/users/cart', userAuth, async (req, res) => {
    const user = req.user
    try {
        if (user.cart.length === 0)
            return res.status(400).send({ Error: 'Cart is empty' });
        user.cart = [];
        await user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

module.exports = router;