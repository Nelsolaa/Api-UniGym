const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../model/Users');

const SECRET_KEY = process.env.JWT_SECRET;

const AuthService = {

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Senha inválida');
    }


    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h',
    });

    return { user, token };
  },
};

module.exports = { AuthService };
