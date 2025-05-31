import jwt from 'jsonwebtoken';

const AdminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Please login again"
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Token not provided"
            });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);      
         
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid credentials"
            });
        };
        
        next();

    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: error.message || "Authentication failed"
        });
    }
}

export { AdminAuth }