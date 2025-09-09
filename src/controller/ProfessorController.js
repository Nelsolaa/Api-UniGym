const { ProfessorDao } = require('../service/ProfessorDao'); // ⚠️ Verifique se este caminho está correto!

const ProfessorController = {

  async createProfessor(req, res) {
    try {
      
      const { nome, data_nascimento, email, password, sexo } = req.body;

      if (!nome || !data_nascimento || !email || !password) {
        return res.status(400).json({ error: 'Nome, data de nascimento, email e senha são obrigatórios!' });
      }

      const professorData = { nome, data_nascimento, email, password, sexo };
      const professor = await ProfessorDao.createProfessor(professorData);

      res.status(201).json(professor); 

    } catch (error) {
      if (error.message === 'Professor já existe com este email.') {
        return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      console.error("Erro em createProfessor:", error);
      res.status(500).json({ error: "Erro interno ao criar professor." });
    }
  },

  async getProfessorById(req, res) {
    try {
      const { id } = req.params;
      const professor = await ProfessorDao.getProfessorById(id); 

      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      res.json(professor); 
    } catch (error) {
      console.error("Erro em getProfessorById:", error);
      res.status(500).json({ error: "Erro interno ao buscar professor." });
    }
  },

  async updateProfessor(req, res) {
    try {
      const { id } = req.params;
      const newData = req.body;

      delete newData.id;

      const updatedProfessor = await ProfessorDao.updateProfessor(id, newData);

      if (!updatedProfessor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      res.json(updatedProfessor);

    } catch (error) {
      console.error("Erro em updateProfessor:", error);
      res.status(500).json({ error: "Erro interno ao atualizar professor." });
    }
  },

  async deleteProfessor(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ProfessorDao.deleteProfessor(id); 

      if (!deleted) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      res.status(204).send(); 

    } catch (error) {
      console.error("Erro em deleteProfessor:", error);
      res.status(500).json({ error: "Erro interno ao deletar professor." });
    }
  },
};

module.exports = { ProfessorController };