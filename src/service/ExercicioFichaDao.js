const { FichaExercicio, sequelize } = require('../model'); 

const FichaExercicioDao = {

  async create(data) {
    try {
      const fichaExercicio = await FichaExercicio.create(data);
      return fichaExercicio.toJSON();
    } catch (error) {
      console.error("Erro ao criar ligação Ficha-Exercício:", error);
      throw error;
    }
  },

  async getByPks(fichaId, exercicioId) {
    try {
      const fichaExercicio = await FichaExercicio.findOne({
        where: {
          ficha_id: fichaId,
          exercicio_id: exercicioId,
        },
      });
      return fichaExercicio ? fichaExercicio.toJSON() : null;
    } catch (error) {
      console.error("Erro ao buscar ligação Ficha-Exercício:", error);
      throw error;
    }
  },

  async updateByPks(fichaId, exercicioId, updateData) {
    try {
      const [updatedRows] = await FichaExercicio.update(updateData, {
        where: {
          ficha_id: fichaId,
          exercicio_id: exercicioId,
        },
      });

      if (updatedRows > 0) {
        return this.getByPks(fichaId, exercicioId);
      }
      return null; 
    } catch (error) {
      console.error("Erro ao atualizar ligação Ficha-Exercício:", error);
      throw error;
    }
  },

  async deleteByPks(fichaId, exercicioId) {
    try {
      const deletedRows = await FichaExercicio.destroy({
        where: {
          ficha_id: fichaId,
          exercicio_id: exercicioId,
        },
      });
      return deletedRows > 0; 
    } catch (error) {
      console.error("Erro ao deletar ligação Ficha-Exercício:", error);
      throw error;
    }
  },

  async findAllByFichaId(fichaId) {
    try {
      const ligacoes = await FichaExercicio.findAll({
        where: { ficha_id: fichaId },
      });
      return ligacoes.map(link => link.toJSON());
    } catch (error){
      console.error("Erro ao buscar todas as ligações por Ficha ID:", error);
      throw error;
    }
  },

};

module.exports = { FichaExercicioDao };