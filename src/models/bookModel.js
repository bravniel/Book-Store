const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
            unique: true,
            //minlength: 2
            validate(name) {
                if (name.length < 2) {
                    throw new Error("Name is too short");
                }
            }
        },
        author: {
            type: String,
            require: true,
            trim: true,
            //minlength: 2
            validate(author) {
                if (author.length < 2) {
                    throw new Error("Author is too short");
                }
            }
        },
        year: {
            type: Number,
            require: true
        },
        genre: {
            type: String,
            required: true
        },
        description: {
            type: String,
            require: true
        },
        image: {
            type: String,
            required: true
        },
    },
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;