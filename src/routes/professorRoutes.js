const express = require('express');
const { ProfessorController } = require('../controller/ProfessorController');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();

// 🔹 Criar um novo usuário
router.post('/register', ProfessorController.createProfessor);

// 🔹 Buscar usuário por ID
router.get('/:id/buscar', ProfessorController.getProfessorById);

// 🔹 Atualizar usuário
router.put('/:id/update', ProfessorController.updateProfessor);

// 🔹 Deletar usuário
router.delete('/:id/delete', ProfessorController.deleteProfessor);

module.exports = { professorRoutes: router };
