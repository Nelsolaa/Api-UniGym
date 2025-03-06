const express = require('express');
const { UserController } = require('../controller/UserController');


const router = express.Router();

// 🔹 Criar um novo usuário
router.post('/register', UserController.registerUser);

// 🔹 Buscar usuário por ID
router.get('/:id', UserController.getUserById);

// 🔹 Buscar usuário por email
router.get('/email/:email', UserController.getUserByEmail);

// 🔹 Atualizar usuário
router.put('/:id', UserController.updateUser);

// 🔹 Deletar usuário
router.delete('/:id', UserController.deleteUser);

module.exports = { userRoutes: router };
