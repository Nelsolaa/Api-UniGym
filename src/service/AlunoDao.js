const { Aluno } = require("../model/AlunosDb");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AlunoDao = {
  
  /**
   * Cria um novo aluno.
   */
  async createAluno(alunoData) {
    const { nome, data_nascimento, email, password, sexo } = alunoData;

    const existingAluno = await Aluno.findOne({ where: { email } });
    if (existingAluno) {
      throw new Error('Aluno já existe com este email.');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const aluno = await Aluno.create({
      nome,
      data_nascimento,
      email,
      password_hash,
      sexo,
    });

    const response = aluno.toJSON();
    delete response.password_hash;
    return response;
  },

  /**
   * Busca um aluno pelo ID.
   */
  async getAlunoById(alunoId) {
    console.log("DAO: Buscando aluno com ID:", alunoId, "- Tipo do ID:", typeof alunoId);
    try {
      const aluno = await Aluno.findByPk(alunoId, {
         attributes: { exclude: ['password_hash'] }
      });
      return aluno;
    } catch (error) {
      console.error('Erro ao buscar aluno por ID:', error);
      throw error;
    }
  },

  /**
   * Busca um aluno pelo Email (útil para login, retorna com hash).
   */
  async getAlunoByEmail(email) {
      try {
          const aluno = await Aluno.findOne({ where: { email } });
          return aluno;
      } catch (error) {
          console.error('Erro ao buscar aluno por email:', error);
          throw error;
      }
  },

  /**
   * Atualiza um aluno.
   */
  async updateAluno(alunoId, updateData) {
    try {
      const aluno = await Aluno.findByPk(alunoId);
      if (!aluno) {
          return null;
      }

      // Se uma nova senha for fornecida, faz o hash
      if (updateData.password) {
          updateData.password_hash = await bcrypt.hash(updateData.password, 10);
          delete updateData.password; // Remove a senha original para não salvar
      }

      await aluno.update(updateData);

      const response = aluno.toJSON();
      delete response.password_hash;
      return response;

    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      throw error;
    }
  },

  /**
   * Deleta um aluno.
   */
  async deleteAluno(alunoId) {
    try {
      const deletedRows = await Aluno.destroy({
          where: { id: alunoId }
      });
      return deletedRows > 0; // Retorna true se deletou, false se não
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      throw error;
    }
  },
};

module.exports = {AlunoDao};
