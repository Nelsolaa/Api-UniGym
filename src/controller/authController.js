const { AuthService } = require("../service/authDao");


const AuthController = {
      
      async login(req, res) {
        try {
          const { email, password } = req.body;
      
          
          if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
          }
      
          const { user, token } = await AuthService.login(email, password);
          res.json({ user, token });
        } catch (error) {
          res.status(401).json({ error: error.message });
        }
      }
};

module.exports = { AuthController }; ;
