const { Professor } = require("../model/ProfessoresDb");
const bcrypt = require('bcryptjs');

const ProfessorDao = {

  /**
   * Cria um novo professor.
   */
  async createProfessor(professorData) {
    const { nome, data_nascimento, email, password, sexo } = professorData;

    const existingProfessor = await Professor.findOne({ where: { email } });
    if (existingProfessor) {
      throw new Error('Professor já existe com este email.');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const professor = await Professor.create({
      nome,
      data_nascimento,
      email,
      password_hash,
      sexo,
    });

    const response = professor.toJSON();
    delete response.password_hash;
    return response;
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