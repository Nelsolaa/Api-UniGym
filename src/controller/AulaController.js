const { AulaDao } = require('../service/AulaDao'); 
const { Op } = require('sequelize'); 

const AulaController = {

  async createAula(req, res) {
    try {
      const { professor_id, data_hora_inicio, data_hora_fim, status } = req.body;

      // Validação básica
      if (!professor_id || !data_hora_inicio || !data_hora_fim) {
        return res.status(400).json({ error: 'Professor, data/hora de início e fim são obrigatórios.' });
      }

      // TODO: Adicionar verificação se o usuário logado (req.user) é um professor
      // e, idealmente, se o professor_id enviado é o mesmo do usuário logado.

      const aulaData = {
          professor_id,
          data_hora_inicio,
          data_hora_fim,
          status: status || 'Disponivel', // Usa 'Disponivel' se não for enviado
          aluno_id: null // Garante que começa como nulo
      };

      const novaAula = await AulaDao.createAula(aulaData);
      res.status(201).json(novaAula);

    } catch (error) {
      console.error("Erro em createAula:", error);
      res.status(500).json({ error: "Erro interno ao criar aula." });
    }
  },

  // ROTA: GET /api/aulas (Ex: Busca geral com filtros)
  async findAulas(req, res) {
      try {
          const { professorId, alunoId, data, status } = req.query;
          const criteria = {};

          if (professorId) criteria.professor_id = professorId;
          if (alunoId) criteria.aluno_id = alunoId;
          if (status) criteria.status = status;

          // Exemplo de filtro por data (buscar todas as aulas de um dia)
          if (data) {
              const startOfDay = new Date(data);
              startOfDay.setHours(0, 0, 0, 0);
              const endOfDay = new Date(data);
              endOfDay.setHours(23, 59, 59, 999);
              criteria.data_hora_inicio = { [Op.between]: [startOfDay, endOfDay] };
          }

          const aulas = await AulaDao.findAulas(criteria);
          res.json(aulas);

      } catch (error) {
          console.error("Erro em findAulas:", error);
          res.status(500).json({ error: "Erro interno ao buscar aulas." });
      }
  },

  // ROTA: GET /api/aulas/:id (Ex: Busca uma aula específica)
  async getAulaById(req, res) {
    try {
      const { id } = req.params;
      const aula = await AulaDao.getAulaById(id);

      if (!aula) {
        return res.status(404).json({ error: 'Aula não encontrada.' });
      }

      res.json(aula);
    } catch (error) {
      console.error("Erro em getAulaById:", error);
      res.status(500).json({ error: "Erro interno ao buscar aula." });
    }
  },

  // ROTA: PUT /api/aulas/:id/agendar (Ex: Aluno agenda uma aula)
async agendarAula(req, res) {
    try {
        const { id } = req.params; // ID da aula/slot que vem da URL
        
        const { alunoId } = req.body; 

        // Validação
        if (!alunoId) {
            return res.status(400).json({ error: 'O ID do aluno é obrigatório no corpo da requisição.' });
        }

        const aulaAgendada = await AulaDao.agendarAula(id, alunoId);
        res.json({ message: "Aula agendada com sucesso!", aula: aulaAgendada });

    } catch (error) {
        console.error("Erro em agendarAula:", error);
        if (error.message.includes('não está mais disponível')) {
            return res.status(409).json({ error: error.message }); // 409 Conflict
        }
        res.status(500).json({ error: "Erro interno ao agendar aula: " + error.message });
    }
},

   // ROTA: PUT /api/aulas/:id/cancelar (Ex: Aluno ou Prof cancela)
  async cancelarAula(req, res) {
    try {
        const { id } = req.params;
        const user = req.user;

        const aulaCancelada = await AulaDao.cancelarAula(id);
        if (!aulaCancelada) {
            return res.status(404).json({ error: 'Aula não encontrada ou já cancelada.' });
        }
        res.json({ message: "Aula cancelada/disponibilizada com sucesso!", aula: aulaCancelada });

    } catch (error) {
        console.error("Erro em cancelarAula:", error);
        res.status(500).json({ error: "Erro interno ao cancelar aula: " + error.message });
    }
  },
async findAulasAgendadasByProfessor(req, res) {
    try {
        const { professorId } = req.params;

        // Validação básica para garantir que o ID foi passado
        if (!professorId) {
            return res.status(400).json({ error: 'O ID do professor é obrigatório na URL.' });
        }

        // Critérios para a busca no DAO: aulas do professor com status 'Agendada'
        const criteria = {
            professor_id: professorId,
            status: 'Agendada'
        };

        const aulas = await AulaDao.findAulas(criteria);

        if (!aulas || aulas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma aula agendada encontrada para este professor.' });
        }

        res.json(aulas);

    } catch (error) {
        console.error("Erro ao buscar aulas agendadas do professor:", error);
        res.status(500).json({ error: "Erro interno ao buscar as aulas." });
    }
},
 
async deleteAula(req, res) {
    try {
        const { id } = req.params;
        const user = req.user;

        // TODO: Adicionar verificação se o 'user' logado é um professor
        // e se ele é o dono deste slot antes de deletar.

        const deleted = await AulaDao.deleteAula(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Aula não encontrada.' });
        }

        res.status(204).send();

    } catch (error) {
        console.error("Erro em deleteAula:", error);
        res.status(500).json({ error: "Erro interno ao deletar aula." });
    }
  },

}

module.exports = { AulaController };