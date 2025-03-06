const { User } = require("../model/Users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserDao = {
  
  async registerUser(email, password) {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new Error('Usuário já existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password_hash: hashedPassword,
    });

    return user;
  },

  
  async getUserById(userId) {
    try {
      return await User.findByPk(userId);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  },


  async updateUser(userId, newData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) return null;

      await user.update(newData);
      return user;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  
  async deleteUser(userId) {
    try {
      return await User.destroy({ where: { id: userId } });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  },
};

module.exports = {UserDao};
