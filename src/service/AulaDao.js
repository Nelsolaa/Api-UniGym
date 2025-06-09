// Importa os modelos necessários do seu 'index.js' da pasta model
// e a instância do sequelize para transações.
const { Aula, Professor, Aluno, sequelize } = require('../model');


const AulaDao = {

  /**
   * Cria um novo slot de aula (geralmente como 'Disponivel').
   */
  async createAula(aulaData) {
    try {
      const aula = await Aula.create(aulaData);
      return aula.toJSON();
    } catch (error) {
      console.error("Erro ao criar aula/slot:", error);
      throw error;
    }
  },

  /**
   * Busca uma aula/slot específico pelo ID, incluindo dados do professor e aluno.
   */
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

  /**
   * Busca aulas/slots com base em critérios (filtros).
   * Útil para buscar horários disponíveis, agenda do aluno ou do professor.
   */
  async findAulas(criteria) {
    try {
      const aulas = await Aula.findAll({
        where: criteria, // Ex: { status: 'Disponivel', professor_id: 1 }
        include: [
          { model: Professor, as: 'professor', attributes: ['id', 'nome'] },
          { model: Aluno, as: 'aluno', attributes: ['id', 'nome'] }
        ],
        order: [
            ['data_hora_inicio', 'ASC'] // Ordena por data/hora
        ]
      });
      return aulas;
    } catch (error) {
      console.error("Erro ao buscar aulas:", error);
      throw error;
    }
  },

  /**
   * Tenta agendar uma aula. Faz a verificação e atualização de forma segura.
   * Retorna a aula agendada ou null/erro se não foi possível.
   */
  async agendarAula(aulaId, alunoId) {
    // Usa uma transação para garantir que a verificação e atualização
    // aconteçam juntas, sem que outro usuário agende no meio tempo.
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

      await t.commit(); // Confirma a transação se tudo deu certo

      // Busca novamente (fora da transação) para incluir os dados associados
      const aulaAgendada = await this.getAulaById(aulaId);
      return aulaAgendada;

    } catch (error) {
      await t.rollback(); // Desfaz a transação em caso de erro
      console.error("Erro ao agendar aula:", error);
      throw error; // Propaga o erro para o Service/Controller tratar
    }
  },

  /**
   * Cancela uma aula (ou a torna disponível novamente).
   */
  async cancelarAula(aulaId) {
      try {
          const aula = await Aula.findByPk(aulaId);

          if (!aula) {
              return null; // Ou lançar erro
          }

          // Só pode cancelar se estiver 'Agendada'
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

  /**
   * Deleta um slot (geralmente usado por professor para remover horário 'Disponivel').
   */
  async deleteAula(aulaId) {
    try {
      const aula = await Aula.findByPk(aulaId);
      if (!aula) {
          return false; // Não achou, não deletou
      }
      // Opcional: Adicionar uma regra para só deletar se estiver 'Disponivel'
      // if (aula.status !== 'Disponivel') {
      //    throw new Error("Não é possível deletar aulas já agendadas.");
      // }

      const deletedRows = await Aula.destroy({ where: { id: aulaId } });
      return deletedRows > 0;
    } catch (error) {
      console.error("Erro ao deletar aula:", error);
      throw error;
    }
  },
};

module.exports = { AulaDao };