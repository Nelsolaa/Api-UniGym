const express = require('express');
const { ExercicioController } = require('../controller/ExercicioController');
const { authMiddleware } = require('../middleware/authMiddleware'); 

const router = express.Router();

// 🔹 Criar um novo Exercício 
router.post('/register', authMiddleware,ExercicioController.createExercicio);

// 🔹 Obter todos os Exercícios 
router.get('/', authMiddleware,ExercicioController.getAllExercicios);

// 🔹 Obter um Exercício específico por ID 
router.get('/:id/search', authMiddleware,ExercicioController.getExercicioById); // Usando :id minúsculo por convenção

// 🔹 Atualizar um Exercício (Protegido)
router.put('/:id/update', authMiddleware,ExercicioController.updateExercicio);

// 🔹 Deletar um Exercício (Protegido)
router.delete('/:id/delete', authMiddleware,ExercicioController.deleteExercicio);

module.exports = { exercicioRoutes: router };