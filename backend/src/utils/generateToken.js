// backend/src/utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (userId, companyId, role) => {
  
  return jwt.sign({ id: userId, companyId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d', 
    
  });
};

export default generateToken;