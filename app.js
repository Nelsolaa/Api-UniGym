// Importações necessárias
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/config/config');
const { authRoutes } = require('./src/routes/authRoutes');
const { protectedRoutes } = require('./src/routes/protectedRoutes');
const { alunoRoutes } = require('./src/routes/alunoRoutes');
const { professorRoutes } = require('./src/routes/professorRoutes');
const { exercicioRoutes } = require('./src/routes/exercicioRoutes');
const { aulaRoutes } = require('./src/routes/aulaRoutes');
const { fichaRoutes } = require('./src/routes/fichaRoutes');
const { fichaExercicioRoutes } = require('./src/routes/fichaExercicioRoutes');

// Carrega variáveis de ambiente e força a inclusão do driver 'pg'
require('dotenv').config();
require('pg');

// Inicializa a aplicação Express
const app = express();

// Configura os middlewares
app.use(express.json()); // Para interpretar o corpo das requisições como JSON
app.use(cors());         // Para permitir requisições de outras origens

// Configura as rotas da sua API
app.use('/api/professores', professorRoutes);
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/exercicios', exercicioRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api/fichas', fichaRoutes);
app.use('/api/ficha-exercicios-admin', fichaExercicioRoutes);

// Sincroniza o banco de dados.
// Isso inicia o processo, mas não impede que o app seja exportado.
sequelize.sync()
  .then(() => {
    console.log('Conexão e sincronização com o banco de dados bem-sucedidas!');
  })
  .catch(err => {
    console.error('Erro ao conectar ou sincronizar com o banco de dados:', err);
  });

// Exporta o app para que a Vercel possa usá-lo
// Esta DEVE ser a última linha e no formato correto.
module.exports = app;
