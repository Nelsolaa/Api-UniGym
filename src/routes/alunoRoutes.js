const express = require('express');
const { AlunoController } = require('../controller/AlunoController');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();

// 🔹 Criar Aluno
router.post('/register', AlunoController.createAluno);

// 🔹 Obter Aluno específico (perfil)
router.get('/:Id', authMiddleware, AlunoController.getAlunoById);

// 🔹 Atualizar Aluno
router.put('/:Id', authMiddleware, AlunoController.updateAluno);

// 🔹 Deletar Aluno
router.delete('/:Id', authMiddleware, AlunoController.deleteAluno);

module.exports = { alunoRoutes: router };