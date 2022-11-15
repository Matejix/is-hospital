const { verify } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    console.log(token);
    if(!token){
        res.send("Unauthorized!")
      } else {
        jwt.verify(token.toString(), "TODOOOSecret", (err,decoded) => {
          if (err){
            res.json({ auth: false, message : "Unauthorized!"}); 
          } else { 
            req.userId = decoded.username;
            next();
          }
        })
      }
};

module.exports = { validateToken };