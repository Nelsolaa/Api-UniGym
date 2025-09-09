const { Exercicio } = require("../model/ExerciciosDb"); 

const ExercicioDao = {

  async createExercicio(exercicioData) {
    const { nome_exercicio, descricao } = exercicioData;

    const existingExercicio = await Exercicio.findOne({ where: { nome_exercicio } });
    if (existingExercicio) {
      throw new Error('Exercício já existe com este nome.');
    }

    const exercicio = await Exercicio.create({
      nome_exercicio,
      descricao,
    });

    return exercicio.toJSON();
  },

  async getExercicioById(exercicioId) {
    try {
      const exercicio = await Exercicio.findByPk(exercicioId);
      return exercicio;
    } catch (error) {
      console.error('Erro ao buscar exercício por ID:', error);
      throw error;
    }
  },

  async getAllExercicios() {
    try {
      const exercicios = await Exercicio.findAll();
      return exercicios;
    } catch (error) {
      console.error('Erro ao buscar todos os exercícios:', error);
      throw error;
    }
  },

  async updateExercicio(exercicioId, updateData) {
    try {
      const exercicio = await Exercicio.findByPk(exercicioId);
      if (!exercicio) {
        return null;
      }

      await exercicio.update(updateData);
      return exercicio.toJSON();

    } catch (error) {
      console.error('Erro ao atualizar exercício:', error);
      throw error;
    }
  },

  async deleteExercicio(exercicioId) {
    try {
      const deletedRows = await Exercicio.destroy({
        where: { id: exercicioId }
      });
      return deletedRows > 0;
    } catch (error) {
      console.error('Erro ao deletar exercício:', error);
      throw error;
    }
  },
};

module.exports = { ExercicioDao };