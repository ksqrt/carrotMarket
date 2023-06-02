const express = require("express");
const app = express();
// express 프레임워크를 불러옵니다.

const { PORT } = require("./config/config");
// 포트 번호를 설정합니다. 기본값은 5000입니다.

const http = require("http").createServer(app);
// Express 애플리케이션을 위한 HTTP 서버를 생성합니다.

const auth = require("./middlewares/auth");
// 인증을 처리하는 미들웨어를 불러옵니다.

const routes = require("./routes");
// 라우트를 정의한 파일을 불러옵니다.

require("dotenv").config();
// .env 파일을 사용하기 위해 dotenv를 설정합니다.

require("./config/express")(app);
// Express 애플리케이션의 설정을 위한 파일을 불러옵니다.

require("./config/mongoose");
// MongoDB와의 연결을 설정하기 위한 파일을 불러옵니다.

app.use(auth());
// 애플리케이션에 인증 미들웨어를 사용합니다.

app.use(routes);
// 애플리케이션에 정의한 라우트를 사용합니다.

http.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}...`)
);
// 설정한 포트 번호로 서버를 실행합니다.
