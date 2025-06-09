const express = require('express');
const { AlunoController } = require('../controller/AlunoController');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();

// 🔹 Criar Aluno
router.post('/register', AlunoController.createAluno);

// 🔹 Obter Aluno específico (perfil)
router.get('/:Id/search', AlunoController.getAlunoById);

// 🔹 Atualizar Aluno
router.put('/:Id/update', AlunoController.updateAluno);

// 🔹 Deletar Aluno
router.delete('/:Id/delete', AlunoController.deleteAluno);

module.exports = { alunoRoutes: router };