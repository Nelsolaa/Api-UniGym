const { Aula, Professor, Aluno, sequelize } = require('../model');


const AulaDao = {

  async createAula(aulaData) {
    try {
      const aula = await Aula.create(aulaData);
      return aula.toJSON();
    } catch (error) {
      console.error("Erro ao criar aula/slot:", error);
      throw error;
    }
  },

  async getAulaById(aulaId) {
    try {
      const aula = await Aula.findByPk(aulaId, {
        include: [
          { model: Professor, as: 'professor', attributes: ['id', 'nome', 'email'] },
          { model: Aluno, as: 'aluno', attributes: ['id', 'nome', 'email'] }
        ]
      });
      return aula;
    } catch (error) {
      console.error("Erro ao buscar aula por ID:", error);
      throw error;
    }
  },

  async findAulas(criteria) {
    try {
      const aulas = await Aula.findAll({
        where: criteria,
        include: [
          { model: Professor, as: 'professor', attributes: ['id', 'nome'] },
          { model: Aluno, as: 'aluno', attributes: ['id', 'nome'] }
        ],
        order: [
            ['data_hora_inicio', 'ASC'] 
        ]
      });
      return aulas;
    } catch (error) {
      console.error("Erro ao buscar aulas:", error);
      throw error;
    }
  },

  async agendarAula(aulaId, alunoId) {
    const t = await sequelize.transaction();

    try {
      const aula = await Aula.findByPk(aulaId, { transaction: t });

      if (!aula) {
        throw new Error('Horário não encontrado.');
      }

      if (aula.status !== 'Disponivel' || aula.aluno_id !== null) {
        throw new Error('Este horário não está mais disponível.');
      }

      aula.aluno_id = alunoId;
      aula.status = 'Agendada';
      await aula.save({ transaction: t });

      await t.commit();

      const aulaAgendada = await this.getAulaById(aulaId);
      return aulaAgendada;

    } catch (error) {
      await t.rollback(); 
      console.error("Erro ao agendar aula:", error);
      throw error; 
    }
  },

  async cancelarAula(aulaId) {
      try {
          const aula = await Aula.findByPk(aulaId);

          if (!aula) {
              return null; 
          }

          if (aula.status !== 'Agendada') {
              throw new Error("Só é possível cancelar aulas agendadas.");
          }

          aula.aluno_id = null;
          aula.status = 'Disponivel';
          await aula.save();

          return aula.toJSON();

      } catch (error) {
          console.error("Erro ao cancelar aula:", error);
          throw error;
      }
  },

  async deleteAula(aulaId) {
    try {
      const aula = await Aula.findByPk(aulaId);
      if (!aula) {
          return false; // Não achou, não deletou
      }

      const deletedRows = await Aula.destroy({ where: { id: aulaId } });
      return deletedRows > 0;
    } catch (error) {
      console.error("Erro ao deletar aula:", error);
      throw error;
    }
  },
};

module.exports = { AulaDao };