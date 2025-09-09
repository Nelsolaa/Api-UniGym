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

require('dotenv').config();
require('pg');

const app = express();

app.use(express.json()); 
app.use(cors());         

app.use('/api/professores', professorRoutes);
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/exercicios', exercicioRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api/fichas', fichaRoutes);
app.use('/api/ficha-exercicios-admin', fichaExercicioRoutes);


sequelize.sync()
  .then(() => {
    console.log('Conexão e sincronização com o banco de dados bem-sucedidas!');
  })
  .catch(err => {
    console.error('Erro ao conectar ou sincronizar com o banco de dados:', err);
  });

module.exports = app;
