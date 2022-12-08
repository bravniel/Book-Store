const express = require('express');
const { adminAuth } = require("../middleware/auth");
const Admin = require('../models/adminModel');

const router = express.Router();

router.get('/admins/login-page', async (req, res) => {
    try {
        res.render('admin-login');
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.get('/admins/home-page/books?page=1', async (req, res) => { // /admins/home
    try {
        res.render('admin-page');
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.get('/admins/home-page', async (req, res) => {
    try {
        res.render('render-to-admin-home-page');
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.get('/admins/connected-admin-info', adminAuth, async (req, res) => {
    const admin = req.admin
    try {
        res.send({ username: admin.username, password: admin.password });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.post('/admins/logout', adminAuth, async (req, res) => {
    const admin = req.admin
    try {
        admin.tokens = admin.tokens.filter((tokenDoc) => tokenDoc.token !== req.token);
        await admin.save();
        res.send();
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.post('/admins/login', async (req, res) => {
    const loginInfo = req.body;
    try {
        const admin = await Admin.findAdminbyUsernameAndPassword(loginInfo.username, loginInfo.password);
        const token = await admin.generateAuthToken();
        res.send({ token, admin });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.post('/admins', async (req, res) => {
    const info = req.body;
    try {
        const admin = new Admin(info);
        if (!admin)
            return res.status(404).send({ Error: 'Invalid credentials' });
        if (admin.password.length < 6)
            return res.status(404).send({ Error: 'Password is too short' });
        await admin.save();
        const token = await admin.generateAuthToken();
        res.send({ admin, token });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.patch('/admins', adminAuth, async (req, res) => {
    const admin = req.admin
    const updateAdmin = req.body;
    try {
        if (updateAdmin.username) {
            const duplicateAdmin = await Admin.findOne({ username: updateAdmin.username });
            if (duplicateAdmin)
                return res.status(400).send({ Error: 'Duplicate user username' });
            if (updateAdmin.username.length < 2)
                return res.status(400).send({ Error: 'Username is too short' });
            admin.username = updateAdmin.username;
        }
        if (updateAdmin.password) {
            if (updateAdmin.password.length < 6)
                return res.status(400).send({ Error: 'Password is too short' });
            if (!updateAdmin.repeatPassword)
                return res.status(400).send({ Error: 'Repeat Password required!' });
            if (updateAdmin.repeatPassword !== updateAdmin.password)
                return res.status(400).send({ Error: 'Password is not equals to Repeat Password' });
            admin.password = updateAdmin.password;
        }
        await admin.save();
        res.send({ admin });
    }
    catch (e) {
        res.status(500).send({ Error: e.message });
    }
});

router.delete("/admins", adminAuth, async (req, res) => {
    try {
        await req.admin.remove()
        res.send();
    } catch (e) {
        res.status(500).send({ Error: e.message });
    }
});
module.exports = router;



