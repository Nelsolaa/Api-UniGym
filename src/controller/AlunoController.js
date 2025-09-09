const { AlunoDao } = require('../service/AlunoDao'); 

const AlunoController = {

  async createAluno(req, res) {
    try {
     
      const { nome, data_nascimento, email, password, sexo } = req.body;

      if (!nome || !data_nascimento || !email || !password) {
        return res.status(400).json({ error: 'Nome, data de nascimento, email e senha são obrigatórios!' });
      }

      const alunoData = { nome, data_nascimento, email, password, sexo };
      const aluno = await AlunoDao.createAluno(alunoData);

      res.status(201).json(aluno);

    } catch (error) {
      
      if (error.message === 'Aluno já existe com este email.') {
        return res.status(409).json({ error: error.message }); 
      }
      console.error("Erro em createAluno:", error);
      res.status(500).json({ error: "Erro interno ao criar aluno." });
    }
  },

  async getAlunoById(req, res) {
    try {
      const { id } = req.params;
      const aluno = await AlunoDao.getAlunoById(id);

      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      res.json(aluno); 
    } catch (error) {
      console.error("Erro em getAlunoById:", error);
      res.status(500).json({ error: "Erro interno ao buscar aluno." });
    }
  },

  async updateAluno(req, res) {
    try {
      const { id } = req.params;
      const newData = req.body;

      delete newData.id;

      const updatedAluno = await AlunoDao.updateAluno(id, newData);

      if (!updatedAluno) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      res.json(updatedAluno); 

    } catch (error) {
      console.error("Erro em updatedAluno:", error);
      res.status(500).json({ error: "Erro interno ao atualizar aluno." });
    }
  },

  async deleteAluno(req, res) {
    try {
      const { id } = req.params;
      const deleted = await AlunoDao.deleteAluno(id); 

      if (!deleted) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      res.status(204).send(); 

    } catch (error) {
      console.error("Erro em deleteAluno:", error);
      res.status(500).json({ error: "Erro interno ao deletar aluno." });
    }
  },
};

module.exports = { AlunoController };