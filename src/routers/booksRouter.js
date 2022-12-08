const express = require("express");
const { adminAuth } = require("../middleware/auth");
const Book = require('../models/bookModel');

const router = new express.Router();

router.get("/books", async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 4
        const skip = (page - 1) * limit
        const books = await Book.find({
            $or: [
                { name: { "$regex": `${req.query.search || ""}`, "$options": "i" } },
                { author: { "$regex": `${req.query.search || ""}`, "$options": "i" } }
            ]
        }).skip(skip).limit(limit).sort('name')
        const allBooks = await Book.countDocuments().where({
            $or: [
                { name: { "$regex": `${req.query.search || ""}`, "$options": "i" } },
                { author: { "$regex": `${req.query.search || ""}`, "$options": "i" } }
            ]
        })
        const allPages = Math.ceil(allBooks / limit);
        const isLeftArrow = (page != 1)
        const isRightArrow = (page != allPages)
        const isSearchValue = !(!req.query.search)
        const searchValue = isSearchValue ? req.query.search : ''
        console.log("page: " + page + " allPage: " + allPages)
        console.log("isLeftArrow: " + isLeftArrow + " isRightArrow: " + isRightArrow + " isSearchValue" + isSearchValue)
        if (!books || books.length === 0) {
            return res.status(404).send({ Error: "No books" });
        }
        res.render('index', { books, page, allPages, isLeftArrow, isRightArrow, isSearchValue, searchValue });
    } catch (err) {
        res.status(500).send({ Error: err.message });
    }
});

router.get("/admins/home-page/books", async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 4
        const skip = (page - 1) * limit
        const books = await Book.find({
            $or: [
                { name: { "$regex": `${req.query.search || ""}`, "$options": "i" } },
                { author: { "$regex": `${req.query.search || ""}`, "$options": "i" } }
            ]
        }).skip(skip).limit(limit).sort('name')
        const allBooks = await Book.countDocuments().where({
            $or: [
                { name: { "$regex": `${req.query.search || ""}`, "$options": "i" } },
                { author: { "$regex": `${req.query.search || ""}`, "$options": "i" } }
            ]
        })
        const allPages = Math.ceil(allBooks / limit);
        const isLeftArrow = (page != 1)
        const isRightArrow = (page != allPages)
        const isSearchValue = !(!req.query.search)
        const searchValue = isSearchValue ? req.query.search : ''
        console.log("page: " + page + " allPage: " + allPages)
        console.log("isLeftArrow: " + isLeftArrow + " isRightArrow: " + isRightArrow + " isSearchValue" + isSearchValue)
        if (!books || books.length === 0) {
            return res.status(404).send({ Error: "No books" });
        }
        res.render('admin-page', { books, page, allPages, isLeftArrow, isRightArrow, isSearchValue, searchValue });
    } catch (err) {
        res.status(500).send({ Error: err.message });
    }
});

// router.get('/books/search',async (req,res)=>{
//     try{
//         const page = req.query.page || 1
//         const limit = req.query.limit || 4
//         const skip = (page - 1) * limit
//         const books = await Book.find({
//             $or: [
//                 { name: { "$regex": `${req.query.search || ""}`, "$options": "i" } },
//                 { author: { "$regex": `${req.query.search || ""}`, "$options": "i" } }
//             ]
//         }).limit(limit).skip(skip).sort('name');
//         const allBooks = await Book.countDocuments().where({
//             $or: [
//                 { name: { "$regex": `${req.query.search || ""}`, "$options": "i" } },
//                 { author: { "$regex": `${req.query.search || ""}`, "$options": "i" } }
//             ]
//         })
//         let allPages = Math.ceil(allBooks / limit);
//         if (!books || books.length === 0)
//             return res.status(400).send( {Error:'Invalid Search. There are no books by search value:' + bookSearch} );
//         res.render('index',{books,page,allPages});
//     }
//     catch(err){
//         res.status(500).send({Error: err.message});
//     }
// });

router.get('/books/:id', async (req, res) => {
    const bookName = req.params.id;
    try {
        const book = await Book.findOne({ name: bookName });
        if (!book || book.length === 0)
            return res.status(400).send({ Error: 'Book not found' });
        res.send({ book });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.post('/books', adminAuth, async (req, res) => { // /books/
    try {
        const book = new Book(req.body);
        const duplicateBook = await Book.findOne({ name: book.name });
        if (duplicateBook)
            return res.status(400).send({ Error: 'Duplicate book name' });
        if (book.name.length < 2 || book.author.length < 2 || book.year.length < 2)
            return res.status(400).send({ Error: 'Invalid add book. Missing fields or too short' });
        await book.save();
        res.send({ book });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.patch('/books/:id', adminAuth, async (req, res) => { // /books/:name
    const bookName = req.params.id;
    const bookInfo = req.body;
    try {
        const book = await Book.findOne({ name: bookName });
        if (bookInfo.name) {
            if (bookInfo.name.length < 2)
                return res.status(400).send({ Error: 'Name is too short' });
            book.name = bookInfo.name;
        }
        if (bookInfo.author) {
            if (bookInfo.author.length < 2)
                return res.status(400).send({ Error: 'Author is too short' });
            book.author = bookInfo.author;
        }
        if (bookInfo.year) {
            if (bookInfo.year.length < 2)
                return res.status(400).send({ Error: 'Year is too short' });
            book.year = bookInfo.year;
        }
        if (bookInfo.genre) {
            if (bookInfo.genre.length < 2)
                return res.status(400).send({ Error: 'Genre is too short' });
            book.genre = bookInfo.genre;
        }
        if (bookInfo.description) {
            if (bookInfo.description.length < 2)
                return res.status(400).send({ Error: 'Description is too short' });
            book.description = bookInfo.description;
        }
        if (bookInfo.image) {
            if (bookInfo.image.length < 2)
                return res.status(400).send({ Error: 'Image is too short' });
            book.image = bookInfo.image;
        }
        await book.save();
        res.send(book);
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.delete('/books/:id', adminAuth, async (req, res) => {
    const bookName = req.params.id;
    try {
        const deletedBook = await Book.findOneAndDelete({ name: bookName });
        if (!deletedBook)
            return res.status(400).send({ Error: 'Book not found' });
        res.send({ deletedBook });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

// router.get('*',async (req,res)=>{
//     try{
//         res.render('error-page');
//     }
//     catch(e){
//         res.status(500).send({Error: e.message});
//     }
// });

module.exports = router;