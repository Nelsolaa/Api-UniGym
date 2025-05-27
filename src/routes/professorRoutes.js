const express = require('express');
const { ProfessorController } = require('../controller/ProfessorController');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();

// 🔹 Criar um novo usuário
router.post('/register', ProfessorController.createProfessor);

// 🔹 Buscar usuário por ID
router.get('/:id', authMiddleware, ProfessorController.getProfessorById);

// 🔹 Atualizar usuário
router.put('/:id', authMiddleware, ProfessorController.updateProfessor);

// 🔹 Deletar usuário
router.delete('/:id', authMiddleware, ProfessorController.deleteProfessor);

module.exports = { professorRoutes: router };
