function cors(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000','http://default-server-service-222e6-17896616-b0cd346835ce.kr.lb.naverncp.com');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST, PUT, PATCH, DELETE');
  
    res.setHeader('Access-Control-Allow-Headers',  
     'Content-Type, Authorization');
  
    next();
}

module.exports = cors;