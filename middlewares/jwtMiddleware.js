const jwt = require("jsonwebtoken");

const jwtMiddleware=(req,res,next)=>{
    console.log("inside jwtMiddleware");
    try {
        const token = req.headers.authorization?.split(" ")[1]; 
    
        if (!token) {
          return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
    
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded :",decoded);
        
        req.userId = decoded.id; 
    
        next(); 
      } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
}

module.exports = jwtMiddleware