const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function sendModel(req, res) {
    console.log("Working", req.body.data);
    const prompt = JSON.parse(req.body.data);
    const result = await model.generateContent(prompt);
    res.send(result.response.text());
}

module.exports = { sendModel }