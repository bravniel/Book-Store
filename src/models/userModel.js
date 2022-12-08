const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			//minlength: 2,
			validate(name) {
				if (name.length < 2) {
					throw new Error("Name is too short");
				}
			}
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			validate(email) {
				if (!validator.isEmail(email)) {
					throw new Error("Invalid email");
				}
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			//minlength: 6
			validate(password) {
				if (password.length < 6) {
					throw new Error("Password is too short");
				}
			}
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
		cart: [{
			book: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Book'
			},
			quantity: {
				type: Number,
				default: 1,
				min: 1
			}
		}]
	},
);

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.statics.findUserbyEmailAndPassword = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Unable to login, user not found");
	}
	const isPassMatch = await bcrypt.compare(password, user.password);
	if (!isPassMatch) {
		throw new Error("Unable to login, password does not match to user");
	}
	return user;
};

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: "6h" });
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.methods.toJSON = function () {
	const user = this;
	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.tokens;
	return userObj;
};

userSchema.methods.addBookToCart = async function (bookID, num) {
	const user = this
	const matchingBookInCart = user.cart.filter(e => e.book._id.toString() === bookID.toString())
	if (matchingBookInCart.length > 0) {
		matchingBookInCart[0].quantity = parseInt(matchingBookInCart[0].quantity) + num
	}
	else
		user.cart.push({ book: bookID, quantity: num })
	await user.save()
}

userSchema.methods.removeBookFromCart = async function (bookID, num) {
	const user = this
	const matchingBookInCart = user.cart.findIndex(e => e.book._id.toString() === bookID.toString())
	if (user.cart[matchingBookInCart].quantity.toString() === num.toString()) {
		user.cart.splice(matchingBookInCart, 1);
	}
	else {
		user.cart[matchingBookInCart].quantity = parseInt(user.cart[matchingBookInCart].quantity) - num
	}
	await user.save()
}

const User = mongoose.model("User", userSchema);

module.exports = User;