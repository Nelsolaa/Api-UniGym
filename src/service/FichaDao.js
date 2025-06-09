const { Ficha, Exercicio, FichaExercicio, sequelize } = require('../model'); // Ajuste o caminho se necessário

const FichaDao = {

  async createFicha(fichaData) {
    const { grupo_muscular, exercicios } = fichaData;

    // Validação básica
    if (!grupo_muscular) {
      throw new Error('Grupo muscular é obrigatório.');
    }

    const t = await sequelize.transaction();
    try {
      const existingFicha = await Ficha.findOne({ where: { grupo_muscular }, transaction: t });
      if (existingFicha) {
        await t.rollback();
        throw new Error('Ficha com este grupo muscular já existe.');
      }

      const novaFicha = await Ficha.create({ grupo_muscular }, { transaction: t });

      if (exercicios && exercicios.length > 0) {
        const exerciciosParaAdicionar = exercicios.map(ex => ({
          ficha_id: novaFicha.id,
          exercicio_id: ex.exercicio_id,
          series: ex.series,
          tempo_descanso: ex.tempo_descanso,
        }));
        await FichaExercicio.bulkCreate(exerciciosParaAdicionar, { transaction: t });
      }

      await t.commit();
      // Retorna a ficha com os exercícios incluídos
      return this.getFichaById(novaFicha.id);

    } catch (error) {
      await t.rollback();
      console.error("Erro ao criar ficha:", error);
      throw error;
    }
  },

  async getAllFichas() {
    try {
      return await Ficha.findAll({
        include: [{
          model: Exercicio,
          as: 'exercicios',
          attributes: ['id', 'nome_exercicio', 'descricao'],
          through: {
            model: FichaExercicio,
            attributes: ['series', 'tempo_descanso']
          }
        }],
        order: [['grupo_muscular', 'ASC']],
      });
    } catch (error) {
      console.error("Erro ao buscar todas as fichas:", error);
      throw error;
    }
  },

  async getFichaById(fichaId) {
    try {
      return await Ficha.findByPk(fichaId, {
        include: [{
          model: Exercicio,
          as: 'exercicios',
          attributes: ['id', 'nome_exercicio', 'descricao'],
          through: { // Para pegar os atributos da tabela de junção
            model: FichaExercicio,
            attributes: ['series', 'tempo_descanso']
          }
        }]
      });
    } catch (error) {
      console.error("Erro ao buscar ficha por ID:", error);
      throw error;
    }
  },

  async updateFicha(fichaId, updateData) {
    const { grupo_muscular, exercicios } = updateData;
    const t = await sequelize.transaction();
    try {
      const ficha = await Ficha.findByPk(fichaId, { transaction: t });
      if (!ficha) {
        await t.rollback();
        return null;
      }

      if (grupo_muscular !== undefined) {
        ficha.grupo_muscular = grupo_muscular;
        await ficha.save({ transaction: t });
      }

      if (exercicios !== undefined) {
        // Remove os exercícios antigos e adiciona os novos
        // Esta é uma forma simples; pode ser otimizada para diffing se necessário
        await FichaExercicio.destroy({ where: { ficha_id: fichaId }, transaction: t });

        if (exercicios.length > 0) {
          const exerciciosParaAdicionar = exercicios.map(ex => ({
            ficha_id: fichaId,
            exercicio_id: ex.exercicio_id,
            series: ex.series,
            tempo_descanso: ex.tempo_descanso,
          }));
          await FichaExercicio.bulkCreate(exerciciosParaAdicionar, { transaction: t });
        }
      }

      await t.commit();
      return this.getFichaById(fichaId); // Retorna a ficha atualizada com exercícios

    } catch (error) {
      await t.rollback();
      console.error("Erro ao atualizar ficha:", error);
      throw error;
    }
  },

  async deleteFicha(fichaId) {
    try {
      // A tabela FichaExercicio tem ON DELETE CASCADE, então as associações serão removidas
      const deletedRows = await Ficha.destroy({
        where: { id: fichaId },
      });
      return deletedRows > 0;
    } catch (error) {
      console.error("Erro ao deletar ficha:", error);
      throw error;
    }
  },

  // Métodos específicos para gerenciar exercícios em uma ficha

  async addExercicioToFicha(fichaId, exercicioData) {
    const { exercicio_id, series, tempo_descanso } = exercicioData;
    try {
      // Verifica se a ficha e o exercício existem
      const ficha = await Ficha.findByPk(fichaId);
      const exercicio = await Exercicio.findByPk(exercicio_id);

      if (!ficha) throw new Error('Ficha não encontrada.');
      if (!exercicio) throw new Error('Exercício não encontrado.');

      // Verifica se a ligação já existe para evitar duplicidade
      const existingLink = await FichaExercicio.findOne({
        where: { ficha_id: fichaId, exercicio_id: exercicio_id }
      });

      if (existingLink) {
        throw new Error('Este exercício já está nesta ficha.');
      }

      const novaLigacao = await FichaExercicio.create({
        ficha_id: fichaId,
        exercicio_id: exercicio_id,
        series,
        tempo_descanso,
      });
      return novaLigacao.toJSON();
    } catch (error) {
      console.error("Erro ao adicionar exercício à ficha:", error);
      throw error;
    }
  },

  async removeExercicioFromFicha(fichaId, exercicioId) {
    try {
      const deletedRows = await FichaExercicio.destroy({
        where: {
          ficha_id: fichaId,
          exercicio_id: exercicioId,
        },
      });
      return deletedRows > 0;
    } catch (error) {
      console.error("Erro ao remover exercício da ficha:", error);
      throw error;
    }
  },

  async updateExercicioInFicha(fichaId, exercicioId, updateExercicioData) {
    const { series, tempo_descanso } = updateExercicioData;
    try {
        const [updatedRows] = await FichaExercicio.update(
            { series, tempo_descanso },
            {
                where: {
                    ficha_id: fichaId,
                    exercicio_id: exercicioId
                }
            }
        );
        return updatedRows > 0;
    } catch (error) {
        console.error("Erro ao atualizar exercício na ficha:", error);
        throw error;
    }
  }
};

module.exports = { FichaDao };