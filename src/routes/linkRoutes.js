const express = require('express');
const { LinkController } = require('../controller/LinksController');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();

// 🔹 Criar link
router.post('/', authMiddleware, LinkController.create);

// 🔹 Obter todos os links
router.get('/', authMiddleware, LinkController.getAll);

// 🔹 Obter link específico
router.get('/:linkId', authMiddleware, LinkController.getById);

// 🔹 Atualizar link
router.put('/:linkId', authMiddleware, LinkController.update);

// 🔹 Deletar link
router.delete('/:linkId', authMiddleware, LinkController.delete);

module.exports = { linkRoutes: router };