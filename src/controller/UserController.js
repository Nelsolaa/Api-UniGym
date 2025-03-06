const { UserDao } = require('../service/UsersDao');

const UserController = {
  // 🔹 Criar um novo usuário
  async registerUser(req, res) {
    try {
      const { email, password } = req.body;
  
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
      }
  
      const user = await UserDao.registerUser(email, password);
      res.status(201).json({ message: 'Usuário criado com sucesso', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // 🔹 Buscar usuário por ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserDao.getUserById(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 🔹 Buscar usuário por email
  async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await UserDao.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 🔹 Atualizar usuário
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const newData = req.body;

      const updatedUser = await UserDao.updateUser(id, newData);
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({ message: 'Usuário atualizado com sucesso', updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 🔹 Deletar usuário
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deleted = await UserDao.deleteUser(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = { UserController };
