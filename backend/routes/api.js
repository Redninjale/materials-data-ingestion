const express = require('express');
const { sendModel } = require('../model/gemini');

const router = express.Router();

router.get('/llm', (req, res) => {
    console.log("HELLO");
    res.send("adwad");
});

router.post('/llm', sendModel);

module.exports = router;