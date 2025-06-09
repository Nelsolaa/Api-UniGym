const express = require('express');
const { FichaExercicioController } = require('../controller/FichaExercicioController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Define um prefixo base para estas rotas, ex: /api/ficha-exercicios

// Criar uma nova ligação direta Ficha-Exercício
// Geralmente, isso é feito através da rota de Ficha, mas pode ser exposto diretamente
// Apenas professores podem manipular diretamente
router.post('/register', FichaExercicioController.createFichaExercicio);

// Obter uma ligação específica Ficha-Exercício pelas suas chaves primárias
// Qualquer usuário logado pode, se necessário (ex: para debug ou info específica)
router.get('/:fichaId/:exercicioId/search', FichaExercicioController.getFichaExercicioByPks);

// Obter todos os exercícios (e seus detalhes na ficha) para uma ficha_id específica
// Útil para ver o conteúdo de uma ficha pela tabela de junção
// Qualquer usuário logado pode
router.get('/ficha/:fichaId/getAll', FichaExercicioController.getExerciciosByFichaId);

// Atualizar os detalhes de uma ligação Ficha-Exercício (series, tempo_descanso)
// Apenas professores podem manipular diretamente
router.put('/:fichaId/:exercicioId/update', FichaExercicioController.updateFichaExercicioByPks);

// Deletar uma ligação específica Ficha-Exercício
// Apenas professores podem manipular diretamente
router.delete('/:fichaId/:exercicioId/delete', FichaExercicioController.deleteFichaExercicioByPks);

module.exports = { fichaExercicioRoutes: router };