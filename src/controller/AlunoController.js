const { AlunoDao } = require('../service/AlunoDao'); // ⚠️ Verifique se este caminho está correto!

const AlunoController = {

  async createAluno(req, res) {
    try {
      // 1. Pega todos os dados do corpo da requisição
      const { nome, data_nascimento, email, password, sexo } = req.body;

      // 2. Valida se os campos obrigatórios foram enviados
      if (!nome || !data_nascimento || !email || !password) {
        return res.status(400).json({ error: 'Nome, data de nascimento, email e senha são obrigatórios!' });
      }

      // 3. Monta o objeto e chama o DAO
      const alunoData = { nome, data_nascimento, email, password, sexo };
      const aluno = await AlunoDao.createAluno(alunoData);

      // 4. Retorna sucesso
      res.status(201).json(aluno); // O DAO já retorna sem o hash

    } catch (error) {
      // 5. Trata erros específicos (como email duplicado) ou genéricos
      if (error.message === 'Aluno já existe com este email.') {
        return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      console.error("Erro em createAluno:", error);
      res.status(500).json({ error: "Erro interno ao criar aluno." });
    }
  },

  async getAlunoById(req, res) {
    try {
      const { id } = req.params;
      const aluno = await AlunoDao.getAlunoById(id); // Corrigido

      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      res.json(aluno); // O DAO já retorna sem o hash
    } catch (error) {
      console.error("Erro em getAlunoById:", error);
      res.status(500).json({ error: "Erro interno ao buscar aluno." });
    }
  },

  async updateAluno(req, res) {
    try {
      const { id } = req.params;
      const newData = req.body;

      // Impede a atualização do ID ou do hash diretamente (se necessário)
      delete newData.id;

      const updatedAluno = await AlunoDao.updateAluno(id, newData);

      if (!updatedAluno) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      res.json(updatedAluno); // Corrigido (retorna o objeto atualizado)

    } catch (error) {
      console.error("Erro em updatedAluno:", error);
      res.status(500).json({ error: "Erro interno ao atualizar aluno." });
    }
  },

  async deleteAluno(req, res) {
    try {
      const { id } = req.params;
      const deleted = await AlunoDao.deleteAluno(id); // Corrigido

      if (!deleted) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      res.status(204).send(); // Retorna 204 No Content (padrão DELETE)

    } catch (error) {
      console.error("Erro em deleteAluno:", error);
      res.status(500).json({ error: "Erro interno ao deletar aluno." });
    }
  },
};

module.exports = { AlunoController };