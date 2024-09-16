const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
    history: [
    {
        role: "user",
        parts: [{ text: "During out chat, you must abide by a few rules. If the user asks for a chart, then you will send the data in a json that react-google charts can use" }],
        },
        {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
});

async function sendModel(req, res) {
    console.log("Working", req.body.data);
    let prompt = req.body.data
    const result = await chat.sendMessage(
        `
            Important: Only when asked for a graph or chart
            
            Please return JSON describing the data-type title, x-axis, y-axis, data, title, extraInfo using the following schema:
            The data-type must be specified as graph

            {"data-type": "graph", "data": list[list[x, y]], "x-axis": str, "y-axis": str, "title": str, "extraInfo": str}
        
            All fields are required.

            Important: Only return a single piece of valid JSON text.
        
            Here is the prompt:
            ` + prompt);
    console.log(result.response);
    res.send(result.response.text());
}

module.exports = { sendModel }