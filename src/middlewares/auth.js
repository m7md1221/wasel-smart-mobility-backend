const jwt = require("jsonwebtoken"); 
function checkAuth(req,res,next){
 try{
   const token = req.headers.authorization.split(" ")[1]; // bearer token , split the string to get the token 
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // verify the token using the secret key
   req.user = decodedToken;// add the decoded token to the request 
   next() ; //passing to the next level 
 }catch(e){
    return res.status(401).json({
     message : "Invalid or expired token" ,
     error : e.message 
    });
 }
}

module.exports= {checkAuth}; 

