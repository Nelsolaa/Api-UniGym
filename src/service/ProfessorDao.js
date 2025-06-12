const { Professor } = require("../model/ProfessoresDb");
const { sequelize } = require('../model');
const { Aula } = require('../model/AulasDb');
const bcrypt = require('bcryptjs');

const ProfessorDao = {

  /**
   * Cria um novo professor.
   */
    async createProfessor(professorData) {
    // Inicia uma transação
    const t = await sequelize.transaction();

    try {
      const { nome, data_nascimento, email, password, sexo } = professorData;

      // Verifica se o email já existe (dentro da mesma transação)
      const existingProfessor = await Professor.findOne({ where: { email }, transaction: t });
      if (existingProfessor) {
        // Se já existe, não precisamos fazer nada, então cancelamos a transação
        await t.rollback();
        throw new Error('Professor já existe com este email.');
      }

      const password_hash = await bcrypt.hash(password, 10);

      // 1. Cria o professor DENTRO da transação
      const novoProfessor = await Professor.create({
        nome,
        data_nascimento,
        email,
        password_hash,
        sexo,
        tipo: 'professor' // Garante que o tipo está sendo setado
      }, { transaction: t });

      // ==========================================================
      // ✅ LÓGICA NOVA PARA CRIAR HORÁRIOS
      // ==========================================================
      
      // 2. Prepara os 3 horários aleatórios (ex: 9h, 10h e 11h para o dia seguinte)
      const horariosParaCriar = [];
      const hoje = new Date();

      for (let i = 1; i <= 3; i++) {
        // Pega o dia de amanhã, depois de amanhã, etc.
        const diaDaAula = new Date(hoje);
        diaDaAula.setDate(hoje.getDate() + i);

        // Define o horário (ex: 9:00 e 10:00)
        const inicioAula = new Date(diaDaAula.setHours(9, 0, 0, 0));
        const fimAula = new Date(diaDaAula.setHours(10, 0, 0, 0));

        horariosParaCriar.push({
            professor_id: novoProfessor.id, // Usa o ID do professor que acabamos de criar
            data_hora_inicio: inicioAula,
            data_hora_fim: fimAula,
            status: 'Disponivel', // O status inicial
            aluno_id: null // Começa sem aluno
        });
      }

      // 3. Insere os 3 horários de uma vez só no banco (DENTRO da transação)
      await Aula.bulkCreate(horariosParaCriar, { transaction: t });

      // 4. Se tudo deu certo até aqui, confirma a transação
      await t.commit();
      
      const response = novoProfessor.toJSON();
      delete response.password_hash;
      return response;

    } catch (error) {
      // 5. Se qualquer passo deu errado, desfaz tudo
      await t.rollback();
      console.error("Erro ao criar professor e seus horários:", error);
      throw error; // Propaga o erro para o Controller tratar
    }
  },

  /**
   * Busca um professor pelo ID.
   */
  async getProfessorById(professorId) {
    try {
      const professor = await Professor.findByPk(professorId, {
         attributes: { exclude: ['password_hash'] }
      });
      return professor;
    } catch (error) {
      console.error('Erro ao buscar professor por ID:', error);
      throw error;
    }
  },

  /**
   * Busca um professor pelo Email (útil para login, retorna com hash).
   */
  async getProfessorByEmail(email) {
      try {
          const professor = await Professor.findOne({ where: { email } });
          return professor;
      } catch (error) {
          console.error('Erro ao buscar professor por email:', error);
          throw error;
      }
  },

  /**
   * Atualiza um professor.
   */
  async updateProfessor(professorId, updateData) {
    try {
      const professor = await Professor.findByPk(professorId);
      if (!professor) {
          return null;
      }

      // Se uma nova senha for fornecida, faz o hash
      if (updateData.password) {
          updateData.password_hash = await bcrypt.hash(updateData.password, 10);
          delete updateData.password; // Remove a senha original para não salvar
      }

      await professor.update(updateData);

      const response = professor.toJSON();
      delete response.password_hash;
      return response;

    } catch (error) {
      console.error('Erro ao atualizar professor:', error);
      throw error;
    }
  },

  /**
   * Deleta um professor.
   */
  async deleteProfessor(professorId) {
    try {
      const deletedRows = await Professor.destroy({
          where: { id: professorId }
      });
      return deletedRows > 0; // Retorna true se deletou, false se não
    } catch (error) {
      console.error('Erro ao deletar professor:', error);
      throw error;
    }
  },
};

module.exports = { ProfessorDao };