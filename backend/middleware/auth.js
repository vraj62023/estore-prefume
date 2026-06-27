import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login again.' });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const authAdmin = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login again.' });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (token_decode.role !== 'admin') {
            return res.json({ success: false, message: 'Not Authorized. Admin access only.' });
        }
        req.body.adminUser = token_decode.email;
        next();
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { authUser, authAdmin };
