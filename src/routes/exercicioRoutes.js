const express = require('express');
const { ExercicioController } = require('../controller/ExercicioController');
const { authMiddleware } = require('../middleware/authMiddleware'); 

const router = express.Router();

// 🔹 Criar um novo Exercício 
router.post('/register', ExercicioController.createExercicio);

// 🔹 Obter todos os Exercícios 
router.get('/', ExercicioController.getAllExercicios);

// 🔹 Obter um Exercício específico por ID 
router.get('/:id/search', ExercicioController.getExercicioById); // Usando :id minúsculo por convenção

// 🔹 Atualizar um Exercício (Protegido)
router.put('/:id/update', ExercicioController.updateExercicio);

// 🔹 Deletar um Exercício (Protegido)
router.delete('/:id/delete', ExercicioController.deleteExercicio);

module.exports = { exercicioRoutes: router };