const { FichaExercicioDao } = require("../service/ExercicioFichaDao");

const FichaExercicioController = {

  async createFichaExercicio(req, res) {
    try {
      const { ficha_id, exercicio_id, series, tempo_descanso } = req.body;

      if (ficha_id === undefined || exercicio_id === undefined || series === undefined || tempo_descanso === undefined) {
        return res.status(400).json({ error: 'ficha_id, exercicio_id, series e tempo_descanso são obrigatórios.' });
      }

      const data = { ficha_id, exercicio_id, series, tempo_descanso };
      const novaLigacao = await FichaExercicioDao.create(data);
      res.status(201).json(novaLigacao);

    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Este exercício já está vinculado a esta ficha.' });
      }
      console.error("Erro em createFichaExercicio:", error);
      res.status(500).json({ error: 'Erro interno ao criar a ligação ficha-exercício.' });
    }
  },

  async getFichaExercicioByPks(req, res) {
    try {
      const { fichaId, exercicioId } = req.params;
      const ligacao = await FichaExercicioDao.getByPks(parseInt(fichaId), parseInt(exercicioId));

      if (!ligacao) {
        return res.status(404).json({ error: 'Ligação ficha-exercício não encontrada.' });
      }
      res.json(ligacao);
    } catch (error) {
      console.error("Erro em getFichaExercicioByPks:", error);
      res.status(500).json({ error: 'Erro interno ao buscar a ligação ficha-exercício.' });
    }
  },

  async getExerciciosByFichaId(req, res) {
      try {
          const { fichaId } = req.params;
          const ligacoes = await FichaExercicioDao.findAllByFichaId(parseInt(fichaId));
          if (!ligacoes || ligacoes.length === 0) {
              return res.status(404).json({ error: 'Nenhum exercício encontrado para esta ficha ou ficha não existe.' });
          }
          res.json(ligacoes);
      } catch (error) {
          console.error("Erro em getExerciciosByFichaId:", error);
          res.status(500).json({ error: 'Erro interno ao buscar exercícios da ficha.' });
      }
  },

  async updateFichaExercicioByPks(req, res) {
    try {
      const { fichaId, exercicioId } = req.params;
      const { series, tempo_descanso } = req.body;

      if (series === undefined && tempo_descanso === undefined) {
        return res.status(400).json({ error: 'Pelo menos um campo (series ou tempo_descanso) deve ser fornecido para atualização.' });
      }

      const updateData = {};
      if (series !== undefined) updateData.series = series;
      if (tempo_descanso !== undefined) updateData.tempo_descanso = tempo_descanso;

      const ligacaoAtualizada = await FichaExercicioDao.updateByPks(parseInt(fichaId), parseInt(exercicioId), updateData);

      if (!ligacaoAtualizada) {
        return res.status(404).json({ error: 'Ligação ficha-exercício não encontrada para atualizar.' });
      }
      res.json(ligacaoAtualizada);
    } catch (error) {
      console.error("Erro em updateFichaExercicioByPks:", error);
      res.status(500).json({ error: 'Erro interno ao atualizar a ligação ficha-exercício.' });
    }
  },

  async deleteFichaExercicioByPks(req, res) {
    try {
      const { fichaId, exercicioId } = req.params;
      const deleted = await FichaExercicioDao.deleteByPks(parseInt(fichaId), parseInt(exercicioId));

      if (!deleted) {
        return res.status(404).json({ error: 'Ligação ficha-exercício não encontrada para deletar.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro em deleteFichaExercicioByPks:", error);
      res.status(500).json({ error: 'Erro interno ao deletar a ligação ficha-exercício.' });
    }
  },
};

module.exports = { FichaExercicioController };