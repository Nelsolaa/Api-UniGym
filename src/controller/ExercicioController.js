const { ExercicioDao } = require('../service/ExercicioDao'); // ⚠️ Verifique se este caminho está correto!

const ExercicioController = {

  async createExercicio(req, res) {
    try {
      const { nome_exercicio, descricao } = req.body;

      if (!nome_exercicio) {
        return res.status(400).json({ error: 'O nome do exercício é obrigatório!' });
      }

      const exercicioData = { nome_exercicio, descricao };
      const exercicio = await ExercicioDao.createExercicio(exercicioData);

      res.status(201).json(exercicio);

    } catch (error) {
      if (error.message === 'Exercício já existe com este nome.') {
        return res.status(409).json({ error: error.message });
      }
      console.error("Erro em createExercicio:", error);
      res.status(500).json({ error: "Erro interno ao criar exercício." });
    }
  },

  async getAllExercicios(req, res) {
      try {
          const exercicios = await ExercicioDao.getAllExercicios();
          res.json(exercicios);
      } catch (error) {
          console.error("Erro em getAllExercicios:", error);
          res.status(500).json({ error: "Erro interno ao buscar exercícios." });
      }
  },

  async getExercicioById(req, res) {
    try {
      const { id } = req.params;
      const exercicio = await ExercicioDao.getExercicioById(id);

      if (!exercicio) {
        return res.status(404).json({ error: 'Exercício não encontrado' });
      }

      res.json(exercicio);
    } catch (error) {
      console.error("Erro em getExercicioById:", error);
      res.status(500).json({ error: "Erro interno ao buscar exercício." });
    }
  },

  async updateExercicio(req, res) {
    try {
      const { id } = req.params;
      const newData = req.body;
      delete newData.id;

      const updatedExercicio = await ExercicioDao.updateExercicio(id, newData);

      if (!updatedExercicio) {
        return res.status(404).json({ error: 'Exercício não encontrado' });
      }

      res.json(updatedExercicio);

    } catch (error) {
      console.error("Erro em updateExercicio:", error);
      res.status(500).json({ error: "Erro interno ao atualizar exercício." });
    }
  },

  async deleteExercicio(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ExercicioDao.deleteExercicio(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Exercício não encontrado' });
      }

      res.status(204).send();

    } catch (error) {
      console.error("Erro em deleteExercicio:", error);
      res.status(500).json({ error: "Erro interno ao deletar exercício." });
    }
  },
};

module.exports = { ExercicioController };