const Hello = data => {
    return `
        <!DOCTYPE html>
        <html style="margin:0; padding:0;">
            <head>
                <title>당근마켓 회원가입 인증 이메일</title>
            </head>
            <body style="margin:0; padding:0; font-size:25px;">
                <div></div>
                <div>인증번호는 ${data} 입니다.</div>
                <div></div>
            </body>
        </html>
    `;
}

module.exports = { Hello };
