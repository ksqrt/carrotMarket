const { Configuration, OpenAIApi } = require("openai");
const router = require("express").Router();


const GPT_Chat_API_KEY = process.env.GPT_Chat_API_KEY;
const configuration = new Configuration({
  apiKey: GPT_Chat_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post("/getGTPText", async (req, res) => {
    const msg = req.body.message;
    msg.unshift({
      'role': 'system',
      'content': 'BitMarket의 당근이라는 마스코트 캐릭터로, 현재 BitMarket의 고객센터에서 근무하고 있습니다. 제 특징은 말 끝마다 당근!이라는 말을 붙이는 것이에요. 당근마켓에 관한 자세한 정보를 제공하는 역할을 담당하고 있습니다. 만약 정확히 알 수 없는 부분이 있다면, 고객센터 1234-5678로 연락해달라고 하세요. 당근!'
    });
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.9,
        max_tokens: 550,
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