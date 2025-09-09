const express = require('express');
const { AlunoController } = require('../controller/AlunoController');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();

// Criar Aluno
router.post('/register', AlunoController.createAluno);

// Obter Aluno específico (perfil)
router.get('/:id/search', authMiddleware , AlunoController.getAlunoById);

// Atualizar Aluno
router.put('/:id/update', authMiddleware, AlunoController.updateAluno);

// Deletar Aluno
router.delete('/:id/delete',authMiddleware ,AlunoController.deleteAluno);

module.exports = { alunoRoutes: router };