const express = require('express');
const { FichaController } = require('../controller/FichaController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Criar uma nova Ficha (com ou sem exercícios)
// Apenas professores podem criar
router.post('/register', FichaController.createFicha);

// Obter todas as Fichas (com seus exercícios)
// Qualquer usuário logado pode ver
router.get('/getAll', FichaController.getAllFichas);

// Obter uma Ficha específica pelo ID (com seus exercícios)
// Qualquer usuário logado pode ver
router.get('/:id/search', FichaController.getFichaById
);

// Atualizar uma Ficha (grupo muscular e/ou lista de exercícios)
// Apenas professores podem atualizar
router.put('/:id/update', FichaController.updateFicha);

// Deletar uma Ficha
// Apenas professores podem deletar
router.delete('/:id/delete', FichaController.deleteFicha);

// Adicionar um exercício a uma ficha existente
// Apenas professores podem modificar
router.post('/:fichaId/exercicios/add', FichaController.addExercicioToFicha);

// Atualizar os detalhes de um exercício específico dentro de uma ficha (séries, descanso)
// Apenas professores podem modificar
router.put('/:fichaId/exercicios/:exercicioId/update', FichaController.updateExercicioInFicha);

// Remover um exercício de uma ficha
// Apenas professores podem modificar
router.delete('/:fichaId/exercicios/:exercicioId/delete', FichaController.removeExercicioFromFicha);

module.exports = { fichaRoutes: router };