const express = require('express');
const { AulaController } = require('../controller/AulaController');
const { authMiddleware } = require('../middleware/authMiddleware');
// Vamos precisar do checkRole para garantir que só professores criem/deletem
// e só alunos agendem.

const router = express.Router();

// ------------------------------------------------------------------
// ROTAS DE CONSULTA (GET)
// ------------------------------------------------------------------

// Rota principal para buscar aulas. Usa query params para filtrar.
// Qualquer usuário logado (aluno ou prof) pode acessar.
router.get(
    '/',
    AulaController.findAulas
);

// Rota para buscar uma aula/slot específico pelo ID.
// Qualquer usuário logado pode acessar.
router.get(
    '/:id',
    AulaController.getAulaById
);

// ------------------------------------------------------------------
// ROTAS DE AÇÃO (POST, PUT, DELETE)
// ------------------------------------------------------------------

// Rota para Professor criar novos slots disponíveis.
// Só professores logados podem acessar.
router.post(
    '/register', // Usamos a raiz (POST /api/aulas) para cria, 
    AulaController.createAula
);

// Rota para Aluno agendar (reservar) um slot 'Disponivel'.
// Só alunos logados podem acessar.
router.put(
    '/:id/agendar', // Rota específica para a ação de agenda,
    AulaController.agendarAula
);

// Rota para cancelar uma aula agendada.
// Qualquer usuário logado PODE TENTAR (a lógica no controller/service decide se PODE MESMO).
router.put(
    '/:id/cancelar',
    AulaController.cancelarAula
);

// Rota para Professor deletar um slot (provavelmente um que esteja 'Disponivel').
// Só professores logados podem acessar.
router.delete(
    '/:id/delete',
    AulaController.deleteAula
);


module.exports = { aulaRoutes: router };