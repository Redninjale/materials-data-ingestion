const express = require('express');
const { sendModel } = require('../model/gemini');
const alloy = require('../db/alloy');
const db = require('../db/db');
const alloyReference = require('../db/alloyreference');
const reference = require('../db/reference');
const users = require('../db/users');

const router = express.Router();

router.get('/llm', (req, res) => {
    console.log("HELLO");
    res.send("adwad");
});

router.post('/llm', sendModel);

router.get('/db', db.getPgVersion);

router.post('/db/alloy', alloy.postAlloy);

router.get('db/reference', reference.getReference);
router.post('db/reference', reference.postReference);

module.exports = router;