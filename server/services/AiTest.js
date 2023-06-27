const { Configuration, OpenAIApi } = require("openai");
const router = require("express").Router();


const GPT_Chat_API_KEY = process.env.GPT_Chat_API_KEY;
const configuration = new Configuration({
  apiKey: GPT_Chat_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post("/getGTPText", async (req, res) => {
    const msg = req.body.message;
  
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        messages: msg,
      });
      console.log(response.data, "my data");
      return res.json({ status: 200, value: response.data });
    } catch (err) {
      console.log(err.response.data);
      return res.json({ status: 500, message: "Internal Server Error" });
    }
});

module.exports = router;