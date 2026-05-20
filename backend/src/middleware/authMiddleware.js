// backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  // Frontend eken token eka ewanne "Authorization: Bearer <token>" widihata
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // "Bearer" kiyana kallai token ekai wen karala token eka witharak gannawa
      token = req.headers.authorization.split(' ')[1];

      // Token eka verify karanawa ape Secret Key eka use karala
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Decoded token eke thiyena details (id, companyId, role) request object ekata attach karanawa
      // Me details api issarahata controllers waladi direct use karanawa
      req.user = decoded;

      // Token eka valid nam next() call karala controller ekata yanna denawa
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Admin routes protect karanna thawa podi middleware ekak (Optional but good for SaaS)
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized, Admin access required' });
  }
};