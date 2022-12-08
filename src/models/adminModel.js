const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        //minlength: 2,
        validate(username) {
            if (username.length < 2) {
                throw new Error("Username is too short");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        //minlength: 6,
        validate(password) {
            if (password.length < 6) {
                throw new Error("Password is too short");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
});

adminSchema.pre('save', async function (next) {
    const admin = this;
    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});

adminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    const token = jwt.sign({ _id: admin._id }, process.env.TOKEN_SECRET, { expiresIn: "6h" });
    admin.tokens = admin.tokens.concat({ token });
    await admin.save();
    return token;
};

adminSchema.methods.toJSON = function () {
    const admin = this
    const adminObj = admin.toObject()
    delete adminObj.password
    delete adminObj.tokens
    return adminObj
}

adminSchema.statics.findAdminbyUsernameAndPassword = async (username, password) => {
    const admin = await Admin.findOne({ username: username });
    if (!admin) {
        throw new Error("Unable to login, admin not found");
    }
    const isPassMatch = await bcrypt.compare(password, admin.password);
    if (!isPassMatch) {
        throw new Error("Unable to login, password does not match to admin");
    }
    return admin;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;