const { Professor } = require("../model/ProfessoresDb");
const { sequelize } = require('../model');
const { Aula } = require('../model/AulasDb');
const bcrypt = require('bcryptjs');

const ProfessorDao = {

    async createProfessor(professorData) {
    // Inicia uma transação
    const t = await sequelize.transaction();

    try {
      const { nome, data_nascimento, email, password, sexo } = professorData;

      const existingProfessor = await Professor.findOne({ where: { email }, transaction: t });
      if (existingProfessor) {
        await t.rollback();
        throw new Error('Professor já existe com este email.');
      }

      const password_hash = await bcrypt.hash(password, 10);

      const novoProfessor = await Professor.create({
        nome,
        data_nascimento,
        email,
        password_hash,
        sexo,
        tipo: 'professor' 
      }, { transaction: t });

      const horariosParaCriar = [];
      const hoje = new Date();

      for (let i = 1; i <= 3; i++) {

        const diaDaAula = new Date(hoje);
        diaDaAula.setDate(hoje.getDate() + i);

        // Define o horário (ex: 9:00 e 10:00)
        const inicioAula = new Date(diaDaAula.setHours(9, 0, 0, 0));
        const fimAula = new Date(diaDaAula.setHours(10, 0, 0, 0));

        horariosParaCriar.push({
            professor_id: novoProfessor.id, 
            data_hora_inicio: inicioAula,
            data_hora_fim: fimAula,
            status: 'Disponivel',
            aluno_id: null 
        });
      }

      await Aula.bulkCreate(horariosParaCriar, { transaction: t });

      await t.commit();
      
      const response = novoProfessor.toJSON();
      delete response.password_hash;
      return response;

    } catch (error) {
      await t.rollback();
      console.error("Erro ao criar professor e seus horários:", error);
      throw error; 
    }
  },

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

  async getProfessorByEmail(email) {
      try {
          const professor = await Professor.findOne({ where: { email } });
          return professor;
      } catch (error) {
          console.error('Erro ao buscar professor por email:', error);
          throw error;
      }
  },

  async updateProfessor(professorId, updateData) {
    try {
      const professor = await Professor.findByPk(professorId);
      if (!professor) {
          return null;
      }

      if (updateData.password) {
          updateData.password_hash = await bcrypt.hash(updateData.password, 10);
          delete updateData.password;
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

  async deleteProfessor(professorId) {
    try {
      const deletedRows = await Professor.destroy({
          where: { id: professorId }
      });
      return deletedRows > 0; 
    } catch (error) {
      console.error('Erro ao deletar professor:', error);
      throw error;
    }
  },
};

module.exports = { ProfessorDao };