# Node.js 버전 지정
FROM node:16.13.0-alpine

# 작업 디렉토리 설정
WORKDIR /server

# 소스 코드 복사
COPY package.json /server
COPY package-lock.json /server
COPY . /server

# .env 파일 복사
COPY .env /server/.env


# 패키지 설치
RUN npm install

# React 앱 빌드
# RUN npm run build

# 포트 설정
EXPOSE 5000

# 시작 명령 설정
CMD npm start