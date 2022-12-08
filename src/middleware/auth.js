const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");

const userAuth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const data = jwt.verify(token, process.env.TOKEN_SECRET);
		const user = await User.findOne({
			_id: data._id,
			"tokens.token": token,
		});
		if (!user) {
			//throw new Error();
			const err = new Error({ Message: "No user found" })
			err.status = 401
			throw err
		}
		req.user = user;
		req.token = token;
		next();
	} catch (e) {
		// res.status(400).send({
		// 	status: 400,
		// 	Message: "not authenticate",
		// });
		res.status(401).send({ Error: "not authenticate" });
	}
};

const adminAuth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const data = jwt.verify(token, process.env.TOKEN_SECRET);
		const admin = await Admin.findOne({
			_id: data._id,
			"tokens.token": token,
		});
		if (!admin) {
			//throw new Error();
			const err = new Error("No admin found")
			err.status = 401
			throw err
		}
		req.admin = admin;
		req.token = token;
		next();
	} catch (err) {
		res.status(400).send({
			status: 400,
			Message: "not authenticate",
		});
	}
};

module.exports = { adminAuth, userAuth };