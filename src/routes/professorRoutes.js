const express = require('express');
const { ProfessorController } = require('../controller/ProfessorController');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();

// 🔹 Criar um novo usuário
router.post('/register', ProfessorController.createProfessor);

// 🔹 Buscar usuário por ID
router.get('/:id/buscar', authMiddleware,ProfessorController.getProfessorById);

// 🔹 Atualizar usuário
router.put('/:id/update', authMiddleware,ProfessorController.updateProfessor);

// 🔹 Deletar usuário
router.delete('/:id/delete', authMiddleware,ProfessorController.deleteProfessor);

module.exports = { professorRoutes: router };
