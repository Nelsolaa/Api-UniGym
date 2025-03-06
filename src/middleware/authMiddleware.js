const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Acesso negado' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
  }
}

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Exemplo: "Bearer <token>"
  
    if (!token) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Coloca os dados do usuário no `req.user`
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  };

module.exports = {authenticateToken, authMiddleware};
