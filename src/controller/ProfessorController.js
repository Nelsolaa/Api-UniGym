const { ProfessorDao } = require('../service/ProfessorDao'); // ⚠️ Verifique se este caminho está correto!

const ProfessorController = {

  async createProfessor(req, res) {
    try {
      // 1. Pega todos os dados do corpo da requisição
      const { nome, data_nascimento, email, password, sexo } = req.body;

      // 2. Valida se os campos obrigatórios foram enviados
      if (!nome || !data_nascimento || !email || !password) {
        return res.status(400).json({ error: 'Nome, data de nascimento, email e senha são obrigatórios!' });
      }

      // 3. Monta o objeto e chama o DAO
      const professorData = { nome, data_nascimento, email, password, sexo };
      const professor = await ProfessorDao.createProfessor(professorData);

      // 4. Retorna sucesso
      res.status(201).json(professor); // O DAO já retorna sem o hash

    } catch (error) {
      // 5. Trata erros específicos (como email duplicado) ou genéricos
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
      const professor = await ProfessorDao.getProfessorById(id); // Corrigido

      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      res.json(professor); // O DAO já retorna sem o hash
    } catch (error) {
      console.error("Erro em getProfessorById:", error);
      res.status(500).json({ error: "Erro interno ao buscar professor." });
    }
  },

  async updateProfessor(req, res) {
    try {
      const { id } = req.params;
      const newData = req.body;

      // Impede a atualização do ID ou do hash diretamente (se necessário)
      delete newData.id;

      const updatedProfessor = await ProfessorDao.updateProfessor(id, newData);

      if (!updatedProfessor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      res.json(updatedProfessor); // Corrigido (retorna o objeto atualizado)

    } catch (error) {
      console.error("Erro em updateProfessor:", error);
      res.status(500).json({ error: "Erro interno ao atualizar professor." });
    }
  },

  async deleteProfessor(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ProfessorDao.deleteProfessor(id); // Corrigido

      if (!deleted) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      res.status(204).send(); // Retorna 204 No Content (padrão DELETE)

    } catch (error) {
      console.error("Erro em deleteProfessor:", error);
      res.status(500).json({ error: "Erro interno ao deletar professor." });
    }
  },
};

module.exports = { ProfessorController };