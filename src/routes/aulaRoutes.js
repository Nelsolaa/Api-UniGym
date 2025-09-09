const express = require('express');
const { AulaController } = require('../controller/AulaController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Rota principal para buscar aulas.
router.get('/', authMiddleware, AulaController.findAulas);

// Rota para buscar uma aula/slot específico pelo ID.
router.get('/:id', authMiddleware, AulaController.getAulaById);

// Rota para Professor criar novos slots disponíveis.
router.post('/register', authMiddleware, AulaController.createAula);

// Rota para Aluno agendar (reservar) um slot 'Disponivel'.
// Só alunos logados podem acessar.
router.put('/:id/agendar', authMiddleware, AulaController.agendarAula);

// Rota para cancelar uma aula agendada.
// Qualquer usuário logado PODE TENTAR (a lógica no controller/service decide se PODE MESMO).
router.put('/:id/cancelar',authMiddleware, AulaController.cancelarAula);

// Rota para Professor deletar um slot (provavelmente um que esteja 'Disponivel').
// Só professores logados podem acessar.
router.delete('/:id/delete',authMiddleware, AulaController.deleteAula);

// Rota para buscar todas as aulas agendadas de um aluno específico.
router.get('/:professorId/agendadas', authMiddleware, AulaController.findAulasAgendadasByProfessor);

module.exports = { aulaRoutes: router };