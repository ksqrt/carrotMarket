const { Router } = require('express');
const router = Router();
const fs = require('fs');
const request = require('request');

function stt(language, filePath) {
    const url = `https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=${language}`;
    const requestConfig = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'X-NCP-APIGW-API-KEY-ID': "v7x02wmg2r",
            'X-NCP-APIGW-API-KEY': "TvLwgRyRGXnkS03SqfouYgkLoKN1PaUH128zrn41"
        },
        body: fs.createReadStream(filePath)
    };

    return new Promise((resolve, reject) => {
        request(requestConfig, (err, response, body) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            console.log(response.statusCode);
            console.log(body);
            resolve(body);
        });
    });
}

router.post('/', async (req, res) => {
    try {
        const base64Audio = req.body.audioData;
        const base64Data = base64Audio.replace(/^data:audio\/mp3;base64,/, '');

        // Convert the base64 string to binary data
        const binaryData = Buffer.from(base64Data, 'base64');

        // Write the binary data to a file
        fs.writeFile('./test.mp3', binaryData, 'binary', async (err) => {
            if (err) {
                console.error('Error saving audio file:', err);
                res.status(500).json({ error: 'Error saving audio file' });
            } else {
                console.log('Audio file saved successfully!');
                try {
                    let message = await stt('Kor', './test.mp3');
                    res.status(200).json({ message: message });
                } catch (error) {
                    res.status(500).json({ error });
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;
