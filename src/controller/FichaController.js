const { FichaDao } = require('../service/FichaDao'); 

const FichaController = {

  async createFicha(req, res) {
    try {
  
      const fichaData = req.body;
      if (!fichaData.grupo_muscular) {
        return res.status(400).json({ error: 'Grupo muscular é obrigatório.' });
      }
      const novaFicha = await FichaDao.createFicha(fichaData);
      res.status(201).json(novaFicha);
    } catch (error) {
      if (error.message.includes('já existe')) {
        return res.status(409).json({ error: error.message });
      }
      console.error("Erro em createFicha:", error);
      res.status(500).json({ error: 'Erro interno ao criar ficha.' });
    }
  },

  async getAllFichas(req, res) {
    try {
      const fichas = await FichaDao.getAllFichas();
      res.json(fichas);
    } catch (error) {
      console.error("Erro em getAllFichas:", error);
      res.status(500).json({ error: 'Erro interno ao buscar fichas.' });
    }
  },

  async getFichaById(req, res) {
    try {
      const { id } = req.params;
      const ficha = await FichaDao.getFichaById(id);
      if (!ficha) {
        return res.status(404).json({ error: 'Ficha não encontrada.' });
      }
      res.json(ficha);
    } catch (error) {
      console.error("Erro em getFichaById:", error);
      res.status(500).json({ error: 'Erro interno ao buscar ficha.' });
    }
  },

  async updateFicha(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body; // Pode incluir grupo_muscular e/ou nova lista de exercicios
      delete updateData.id; // Não permitir atualização do ID

      const fichaAtualizada = await FichaDao.updateFicha(id, updateData);
      if (!fichaAtualizada) {
        return res.status(404).json({ error: 'Ficha não encontrada para atualizar.' });
      }
      res.json(fichaAtualizada);
    } catch (error) {
      console.error("Erro em updateFicha:", error);
      res.status(500).json({ error: 'Erro interno ao atualizar ficha.' });
    }
  },

  async deleteFicha(req, res) {
    try {
      const { id } = req.params;
      const deleted = await FichaDao.deleteFicha(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Ficha não encontrada para deletar.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro em deleteFicha:", error);
      res.status(500).json({ error: 'Erro interno ao deletar ficha.' });
    }
  },

  async addExercicioToFicha(req, res) {
    try {
      const { fichaId } = req.params;
      const { exercicio_id, series, tempo_descanso } = req.body;

      if (!exercicio_id || series === undefined || tempo_descanso === undefined) {
        return res.status(400).json({ error: 'Exercicio ID, séries e tempo de descanso são obrigatórios.' });
      }

      const exercicioData = { exercicio_id, series, tempo_descanso };
      const novaLigacao = await FichaDao.addExercicioToFicha(fichaId, exercicioData);
      res.status(201).json(novaLigacao);
    } catch (error) {
      if (error.message.includes('não encontrada') || error.message.includes('já está nesta ficha')) {
          return res.status(400).json({ error: error.message });
      }
      console.error("Erro em addExercicioToFicha:", error);
      res.status(500).json({ error: 'Erro interno ao adicionar exercício à ficha.' });
    }
  },

  async updateExercicioInFicha(req, res) {
    try {
      const { fichaId, exercicioId } = req.params;
      const { series, tempo_descanso } = req.body;

      if (series === undefined && tempo_descanso === undefined) {
        return res.status(400).json({ error: 'Pelo menos um campo (séries ou tempo de descanso) deve ser fornecido para atualização.' });
      }

      const updateData = {};
      if (series !== undefined) updateData.series = series;
      if (tempo_descanso !== undefined) updateData.tempo_descanso = tempo_descanso;

      const updated = await FichaDao.updateExercicioInFicha(fichaId, exercicioId, updateData);
      if (!updated) {
        return res.status(404).json({ error: 'Exercício não encontrado nesta ficha ou nenhum dado alterado.' });
      }

      const fichaAtualizada = await FichaDao.getFichaById(fichaId);
      res.json({ message: 'Exercício atualizado na ficha.', ficha: fichaAtualizada });
    } catch (error) {
      console.error("Erro em updateExercicioInFicha:", error);
      res.status(500).json({ error: 'Erro interno ao atualizar exercício na ficha.' });
    }
  },

  async removeExercicioFromFicha(req, res) {
    try {
      const { fichaId, exercicioId } = req.params;
      const deleted = await FichaDao.removeExercicioFromFicha(fichaId, exercicioId);

      if (!deleted) {
        return res.status(404).json({ error: 'Exercício não encontrado nesta ficha para remoção.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro em removeExercicioFromFicha:", error);
      res.status(500).json({ error: 'Erro interno ao remover exercício da ficha.' });
    }
  },

};

module.exports = { FichaController };